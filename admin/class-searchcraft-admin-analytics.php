<?php
/**
 * Analytics AJAX handler and cache layer for the Searchcraft plugin.
 *
 * Provides three AJAX endpoints (sum, chart, refresh) backed by a three-family
 * schema-versioned transient cache. Cache keys incorporate a schema version token
 * so bumping CACHE_SCHEMA_VERSION naturally orphans stale entries without a migration.
 *
 * Hash formula (sum/chart): substr(md5($index_id . '|' . $range), 0, 32)
 * Hash formula (doc_count): substr(md5($index_id), 0, 32)
 * Max transient key length: 57 chars — well under WP's 172-char limit.
 *
 * @link       https://searchcraft.io
 * @since      1.5.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/admin
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Searchcraft\Searchcraft as SearchcraftPhpClient;
use Searchcraft\Exception\SearchcraftException;

/**
 * Analytics AJAX handler and cache layer.
 *
 * @since      1.5.0
 * @package    Searchcraft
 * @subpackage Searchcraft/admin
 * @author     Searchcraft <support@searchcraft.io>
 */
class Searchcraft_Admin_Analytics {

	/**
	 * Cache schema version baked into every transient key.
	 * Bump to 'v2' when the response shape changes — orphans old entries naturally.
	 *
	 * @since 1.5.0
	 * @var string
	 */
	const CACHE_SCHEMA_VERSION = 'v1';

	/**
	 * Cache TTL for sum and chart families (5 minutes).
	 *
	 * @since 1.5.0
	 * @var int
	 */
	const CACHE_TTL = 300;

	/**
	 * Cache TTL for 5xx negative-cache sentinel (30 seconds).
	 *
	 * @since 1.5.0
	 * @var int
	 */
	const NEGATIVE_CACHE_TTL = 30;

	/**
	 * Accepted range tokens, ordered for documentation clarity.
	 *
	 * @since 1.5.0
	 * @var string[]
	 */
	private static $valid_ranges = array( '1w', '2w', '1m', '3m', 'ytd', 'all' );

	/**
	 * The ID of the plugin.
	 *
	 * @since 1.5.0
	 * @var string $plugin_name
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since 1.5.0
	 * @var string $plugin_version
	 */
	protected $plugin_version;

	/**
	 * Constructor.
	 *
	 * @since 1.5.0
	 * @param string $plugin_name    The name of this plugin.
	 * @param string $plugin_version The version of this plugin.
	 */
	public function __construct( $plugin_name, $plugin_version ) {
		$this->plugin_name    = $plugin_name;
		$this->plugin_version = $plugin_version;

		$this->init_hooks();
	}

	/**
	 * Register all WordPress hooks for analytics functionality.
	 *
	 * @since 1.5.0
	 */
	private function init_hooks() {
		// AJAX endpoints — admin-only (logged-in users).
		add_action( 'wp_ajax_searchcraft_analytics_sum', array( $this, 'handle_analytics_sum' ) );
		add_action( 'wp_ajax_searchcraft_analytics_chart', array( $this, 'handle_analytics_chart' ) );
		add_action( 'wp_ajax_searchcraft_refresh_analytics', array( $this, 'handle_refresh' ) );

		// doc_count cache invalidation — mirrors existing sync hook split in Searchcraft_Admin.
		add_action( 'wp_after_insert_post', array( $this, 'on_publish_post_doc_count' ), 10, 4 );
		add_action( 'transition_post_status', array( $this, 'on_unpublish_post_doc_count' ), 10, 3 );
		// REST API force-delete (wp_delete_post with $force=true) bypasses transition_post_status
		// for published posts — before_delete_post closes that gap.
		add_action( 'before_delete_post', array( $this, 'on_before_delete_post' ), 10, 1 );

		// Flush analytics cache on Re-Sync All and Delete All success.
		add_action( 'searchcraft_after_reindex_all', array( $this, 'flush_cache' ) );
		add_action( 'searchcraft_after_delete_all', array( $this, 'flush_cache' ) );

		// Flush when critical config fields (index_id, endpoint_url, read_key) change.
		add_action( 'update_option_searchcraft_config', array( $this, 'on_config_option_update' ), 10, 2 );

		// Flush on plugin upgrade, gated on SEARCHCRAFT_VERSION change.
		add_action( 'admin_init', array( $this, 'maybe_flush_on_upgrade' ) );
	}

	// -------------------------------------------------------------------------
	// AJAX handlers
	// -------------------------------------------------------------------------

	/**
	 * Handle wp_ajax_searchcraft_analytics_sum.
	 *
	 * Returns daily_active_users, monthly_active_users, total_searches, and
	 * popular_terms for the requested range. DAU/MAU windows are baked into the
	 * API response and do not vary with the range filter.
	 *
	 * Security ordering (locked — no exceptions):
	 *   1. Nonce  2. Capability  3. Input validation
	 *
	 * @since 1.5.0
	 */
	public function handle_analytics_sum() {
		// 1. Nonce — false suppresses wp_die on failure.
		if ( ! check_ajax_referer( 'searchcraft_analytics', 'nonce', false ) ) {
			wp_send_json_error( array( 'code' => 'forbidden' ), 403 );
			return;
		}
		// 2. Capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'code' => 'forbidden' ), 403 );
			return;
		}
		// 3. Input validation — default to 1w when range is absent (initial Overview load).
		$raw_range = isset( $_POST['range'] ) && is_string( $_POST['range'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			? sanitize_text_field( wp_unslash( $_POST['range'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			: '1w';
		if ( ! in_array( $raw_range, self::$valid_ranges, true ) ) {
			wp_send_json_error( array( 'code' => 'invalid_range' ), 400 );
			return;
		}
		$range = $raw_range;

		if ( ! Searchcraft_Config::is_configured() ) {
			wp_send_json_error( array( 'code' => 'not_configured' ), 400 );
			return;
		}

		$index_id  = Searchcraft_Config::get_index_id();
		$cache_key = $this->get_cache_key_sum( $index_id, $range );
		$bypass    = isset( $_GET['searchcraft_cache_bypass'] ) && current_user_can( 'manage_options' ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( ! $bypass ) {
			$cached = get_transient( $cache_key );
			if ( false !== $cached ) {
				if ( isset( $cached['__error'] ) ) {
					if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
						header( 'X-Searchcraft-Cache: NEGATIVE' );
					}
					wp_send_json_error( array( 'code' => 'upstream_error' ), 503 );
					return;
				}
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					$age = time() - ( isset( $cached['_cached_at'] ) ? (int) $cached['_cached_at'] : 0 );
					header( 'X-Searchcraft-Cache: HIT' );
					header( 'X-Searchcraft-Cache-Age: ' . $age );
				}
				$out = $cached;
				unset( $out['_cached_at'] );
				wp_send_json_success( $out );
				return;
			}
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				header( 'X-Searchcraft-Cache: MISS' );
			}
		} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				header( 'X-Searchcraft-Cache: BYPASS' );
		}

		$client = $this->get_read_client();
		if ( null === $client ) {
			wp_send_json_error( array( 'code' => 'not_configured' ), 503 );
			return;
		}

		$date_params = $this->get_date_range_params( $range );
		$filters     = array(
			'index_names' => $index_id,
			'date_start'  => $date_params['date_start'],
			'date_end'    => $date_params['date_end'],
			'granularity' => $date_params['granularity'],
		);

		try {
			$response = $client->measure()->getDashboardSummary( $filters );
			$data     = isset( $response['data'] ) && is_array( $response['data'] ) ? $response['data'] : array();

			$result = array(
				'daily_active_users'   => isset( $data['daily_active_users'] ) ? (int) $data['daily_active_users'] : 0,
				'monthly_active_users' => isset( $data['monthly_active_users'] ) ? (int) $data['monthly_active_users'] : 0,
				'total_searches'       => isset( $data['total_searches'] ) ? (int) $data['total_searches'] : 0,
				'popular_terms'        => $this->extract_popular_terms( $data ),
				'range'                => $range,
				'generated_at'         => gmdate( 'c' ),
				'_cached_at'           => time(),
			);

			set_transient( $cache_key, $result, self::CACHE_TTL );
			unset( $result['_cached_at'] );
			wp_send_json_success( $result );

		} catch ( SearchcraftException $e ) {
			$status = (int) $e->getCode();
			if ( $status >= 500 || 0 === $status ) {
				// Negative cache: suppress repeated upstream hammering on 5xx or network failure.
				set_transient(
					$cache_key,
					array(
						'__error' => true,
						'status'  => $status,
					),
					self::NEGATIVE_CACHE_TTL
				);
			}
			// Never include exception message — it may contain values from Searchcraft_Config::get().
			wp_send_json_error( array( 'code' => 'upstream_error' ), 503 );
		}
	}

	/**
	 * Handle wp_ajax_searchcraft_analytics_chart.
	 *
	 * Returns chart_series (searches over time) and total_searches for the
	 * requested range. Called on every chart range tab click.
	 *
	 * Security ordering (locked — no exceptions):
	 *   1. Nonce  2. Capability  3. Input validation
	 *
	 * @since 1.5.0
	 */
	public function handle_analytics_chart() {
		// 1. Nonce.
		if ( ! check_ajax_referer( 'searchcraft_analytics', 'nonce', false ) ) {
			wp_send_json_error( array( 'code' => 'forbidden' ), 403 );
			return;
		}
		// 2. Capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'code' => 'forbidden' ), 403 );
			return;
		}
		// 3. Input validation — range is required; no default for chart requests.
		$raw_range = isset( $_POST['range'] ) && is_string( $_POST['range'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			? sanitize_text_field( wp_unslash( $_POST['range'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
			: '';
		if ( ! in_array( $raw_range, self::$valid_ranges, true ) ) {
			wp_send_json_error( array( 'code' => 'invalid_range' ), 400 );
			return;
		}
		$range = $raw_range;

		if ( ! Searchcraft_Config::is_configured() ) {
			wp_send_json_error( array( 'code' => 'not_configured' ), 400 );
			return;
		}

		$index_id  = Searchcraft_Config::get_index_id();
		$cache_key = $this->get_cache_key_chart( $index_id, $range );
		$bypass    = isset( $_GET['searchcraft_cache_bypass'] ) && current_user_can( 'manage_options' ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( ! $bypass ) {
			$cached = get_transient( $cache_key );
			if ( false !== $cached ) {
				if ( isset( $cached['__error'] ) ) {
					if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
						header( 'X-Searchcraft-Cache: NEGATIVE' );
					}
					wp_send_json_error( array( 'code' => 'upstream_error' ), 503 );
					return;
				}
				if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
					$age = time() - ( isset( $cached['_cached_at'] ) ? (int) $cached['_cached_at'] : 0 );
					header( 'X-Searchcraft-Cache: HIT' );
					header( 'X-Searchcraft-Cache-Age: ' . $age );
				}
				$out = $cached;
				unset( $out['_cached_at'] );
				wp_send_json_success( $out );
				return;
			}
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				header( 'X-Searchcraft-Cache: MISS' );
			}
		} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				header( 'X-Searchcraft-Cache: BYPASS' );
		}

		$client = $this->get_read_client();
		if ( null === $client ) {
			wp_send_json_error( array( 'code' => 'not_configured' ), 503 );
			return;
		}

		$date_params = $this->get_date_range_params( $range );
		$filters     = array(
			'index_names' => $index_id,
			'date_start'  => $date_params['date_start'],
			'date_end'    => $date_params['date_end'],
			'granularity' => $date_params['granularity'],
		);

		try {
			$response = $client->measure()->getDashboardSummary( $filters );
			$data     = isset( $response['data'] ) && is_array( $response['data'] ) ? $response['data'] : array();

			$result = array(
				'chart_series'   => $this->extract_chart_series( $data ),
				'total_searches' => isset( $data['total_searches'] ) ? (int) $data['total_searches'] : 0,
				'range'          => $range,
				'generated_at'   => gmdate( 'c' ),
				'_cached_at'     => time(),
			);

			set_transient( $cache_key, $result, self::CACHE_TTL );
			unset( $result['_cached_at'] );
			wp_send_json_success( $result );

		} catch ( SearchcraftException $e ) {
			$status = (int) $e->getCode();
			if ( $status >= 500 || 0 === $status ) {
				set_transient(
					$cache_key,
					array(
						'__error' => true,
						'status'  => $status,
					),
					self::NEGATIVE_CACHE_TTL
				);
			}
			wp_send_json_error( array( 'code' => 'upstream_error' ), 503 );
		}
	}

	/**
	 * Handle wp_ajax_searchcraft_refresh_analytics.
	 *
	 * Flushes all three cache families and records the refresh timestamp.
	 *
	 * Security ordering (locked — no exceptions):
	 *   1. Nonce  2. Capability
	 *
	 * @since 1.5.0
	 */
	public function handle_refresh() {
		// 1. Nonce.
		if ( ! check_ajax_referer( 'searchcraft_analytics', 'nonce', false ) ) {
			wp_send_json_error( array( 'code' => 'forbidden' ), 403 );
			return;
		}
		// 2. Capability.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'code' => 'forbidden' ), 403 );
			return;
		}

		$this->flush_cache();

		$index_id   = Searchcraft_Config::get_index_id();
		$idx_hash   = empty( $index_id ) ? 'default' : substr( md5( $index_id ), 0, 32 );
		$option_key = 'searchcraft_analytics_last_refresh_' . $idx_hash;
		$timestamp  = time();
		update_option( $option_key, $timestamp );

		wp_send_json_success(
			array(
				'refreshed_at' => gmdate( 'c', $timestamp ),
				'timestamp'    => $timestamp,
			)
		);
	}

	// -------------------------------------------------------------------------
	// Post lifecycle hooks for doc_count cache invalidation
	// -------------------------------------------------------------------------

	/**
	 * Flush doc_count cache when a post is published.
	 * Mirrors the wp_after_insert_post hook in Searchcraft_Admin.
	 *
	 * @since 1.5.0
	 * @param int          $post_id     Post ID.
	 * @param WP_Post      $post        Post object.
	 * @param bool         $update      Whether this is an update.
	 * @param WP_Post|null $post_before Post object before update.
	 */
	public function on_publish_post_doc_count( $post_id, $post, $update, $post_before ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		if ( 'publish' !== $post->post_status ) {
			return;
		}
		$public_post_types = get_post_types( array( 'public' => true ), 'names' );
		if ( ! in_array( $post->post_type, $public_post_types, true ) ) {
			return;
		}
		$this->flush_doc_count_cache();
	}

	/**
	 * Flush doc_count cache when a post is unpublished or trashed.
	 * Mirrors the transition_post_status hook in Searchcraft_Admin.
	 *
	 * @since 1.5.0
	 * @param string  $new_status New post status.
	 * @param string  $old_status Old post status.
	 * @param WP_Post $post       Post object.
	 */
	public function on_unpublish_post_doc_count( $new_status, $old_status, $post ) {
		if ( 'publish' === $new_status ) {
			return;
		}
		if ( 'publish' !== $old_status ) {
			return;
		}
		$public_post_types = get_post_types( array( 'public' => true ), 'names' );
		if ( ! in_array( $post->post_type, $public_post_types, true ) ) {
			return;
		}
		$this->flush_doc_count_cache();
	}

	/**
	 * Flush doc_count cache before a post is permanently deleted.
	 *
	 * Coverage gap note: wp_delete_post() with $force=true (e.g. REST API DELETE
	 * with ?force=true) removes the post row without calling wp_trash_post() first,
	 * which means transition_post_status never fires for published posts deleted this
	 * way. This hook closes that gap for doc_count cache purposes.
	 * Verification: existing Searchcraft_Admin uses wp_after_insert_post and
	 * transition_post_status — neither fires for REST force-delete, so the gap is real.
	 *
	 * @since 1.5.0
	 * @param int $post_id Post ID about to be deleted.
	 */
	public function on_before_delete_post( $post_id ) {
		$post = get_post( $post_id );
		if ( ! $post ) {
			return;
		}
		$public_post_types = get_post_types( array( 'public' => true ), 'names' );
		if ( ! in_array( $post->post_type, $public_post_types, true ) ) {
			return;
		}
		$this->flush_doc_count_cache();
	}

	// -------------------------------------------------------------------------
	// Config and upgrade flush hooks
	// -------------------------------------------------------------------------

	/**
	 * Flush all cache when critical config fields change.
	 *
	 * Index_id and endpoint_url are stored plaintext — compared directly.
	 * read_key is stored encrypted — any change in ciphertext means a new key
	 * was submitted (different IV each encryption), so we flush.
	 * If read_key is left empty on the config form, the existing ciphertext is
	 * preserved and the values are equal, so no flush occurs.
	 *
	 * @since 1.5.0
	 * @param mixed $old_value Previous option value (raw, keys still encrypted).
	 * @param mixed $new_value New option value (raw, keys still encrypted).
	 */
	public function on_config_option_update( $old_value, $new_value ) {
		if ( ! is_array( $old_value ) || ! is_array( $new_value ) ) {
			return;
		}
		foreach ( array( 'index_id', 'endpoint_url', 'read_key' ) as $key ) {
			$old = isset( $old_value[ $key ] ) ? $old_value[ $key ] : '';
			$new = isset( $new_value[ $key ] ) ? $new_value[ $key ] : '';
			if ( $old !== $new ) {
				$this->flush_cache();
				return;
			}
		}
	}

	/**
	 * Flush all cache when the plugin version changes (after an upgrade).
	 * Stores the last-seen version in wp_options to detect changes.
	 *
	 * @since 1.5.0
	 */
	public function maybe_flush_on_upgrade() {
		$stored = get_option( 'searchcraft_analytics_version', '' );
		if ( SEARCHCRAFT_VERSION !== $stored ) {
			$this->flush_cache();
			update_option( 'searchcraft_analytics_version', SEARCHCRAFT_VERSION );
		}
	}

	// -------------------------------------------------------------------------
	// Cache management
	// -------------------------------------------------------------------------

	/**
	 * Flush all three cache families for the current index.
	 *
	 * Iterates all valid ranges × {sum, chart} and deletes the single doc_count
	 * key. Uses delete_transient() per known key — no wildcard or LIKE queries.
	 *
	 * @since 1.5.0
	 */
	public function flush_cache() {
		$index_id = Searchcraft_Config::get_index_id();
		if ( empty( $index_id ) ) {
			return;
		}
		foreach ( self::$valid_ranges as $range ) {
			$hash = substr( md5( $index_id . '|' . $range ), 0, 32 );
			delete_transient( 'searchcraft_sum_' . self::CACHE_SCHEMA_VERSION . '_' . $hash );
			delete_transient( 'searchcraft_chart_' . self::CACHE_SCHEMA_VERSION . '_' . $hash );
		}
		$this->flush_doc_count_cache();
	}

	/**
	 * Flush only the doc_count transient for the current index.
	 *
	 * @since 1.5.0
	 */
	public function flush_doc_count_cache() {
		$index_id = Searchcraft_Config::get_index_id();
		if ( empty( $index_id ) ) {
			return;
		}
		$doc_hash = substr( md5( $index_id ), 0, 32 );
		delete_transient( 'searchcraft_doc_count_' . self::CACHE_SCHEMA_VERSION . '_' . $doc_hash );
	}

	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/**
	 * Build a read-key Searchcraft client for analytics API calls.
	 *
	 * @since 1.5.0
	 * @return object|null Client instance, or null if credentials are missing.
	 */
	private function get_read_client() {
		$read_key     = Searchcraft_Config::get_read_key();
		$endpoint_url = Searchcraft_Config::get_endpoint_url();
		if ( empty( $read_key ) || empty( $endpoint_url ) ) {
			return null;
		}
		try {
			return new SearchcraftPhpClient( $read_key, SearchcraftPhpClient::KEY_TYPE_READ, $endpoint_url );
		} catch ( \Exception $e ) {
			return null;
		}
	}

	/**
	 * Convert a range token to Searchcraft API filter params.
	 *
	 * Date_start / date_end are Unix timestamps as strings (seconds since epoch),
	 * matching the format expected by the Searchcraft measure API.
	 * Granularity uses the plural lowercase form accepted by the API.
	 *
	 * @since 1.5.0
	 * @param string $range One of self::$valid_ranges.
	 * @return array Associative array with date_start, date_end, granularity.
	 */
	private function get_date_range_params( $range ) {
		$now = time();
		switch ( $range ) {
			case '1w':
				return array(
					'date_start'  => (string) strtotime( '-1 week', $now ),
					'date_end'    => (string) $now,
					'granularity' => 'days',
				);
			case '2w':
				return array(
					'date_start'  => (string) strtotime( '-2 weeks', $now ),
					'date_end'    => (string) $now,
					'granularity' => 'days',
				);
			case '1m':
				return array(
					'date_start'  => (string) strtotime( '-1 month', $now ),
					'date_end'    => (string) $now,
					'granularity' => 'days',
				);
			case '3m':
				return array(
					'date_start'  => (string) strtotime( '-3 months', $now ),
					'date_end'    => (string) $now,
					'granularity' => 'weeks',
				);
			case 'ytd':
				return array(
					'date_start'  => (string) mktime( 0, 0, 0, 1, 1, (int) gmdate( 'Y', $now ) ),
					'date_end'    => (string) $now,
					'granularity' => 'weeks',
				);
			case 'all':
			default:
				return array(
					'date_start'  => '0',
					'date_end'    => (string) $now,
					'granularity' => 'months',
				);
		}
	}

	/**
	 * Build the transient key for the analytics summary cache family.
	 * Key length: 19 + 32 = 51 chars.
	 *
	 * @since 1.5.0
	 * @param string $index_id The configured index ID.
	 * @param string $range    Validated range token.
	 * @return string Transient key.
	 */
	private function get_cache_key_sum( $index_id, $range ) {
		$hash = substr( md5( $index_id . '|' . $range ), 0, 32 );
		return 'searchcraft_sum_' . self::CACHE_SCHEMA_VERSION . '_' . $hash;
	}

	/**
	 * Build the transient key for the analytics chart cache family.
	 * Key length: 21 + 32 = 53 chars.
	 *
	 * @since 1.5.0
	 * @param string $index_id The configured index ID.
	 * @param string $range    Validated range token.
	 * @return string Transient key.
	 */
	private function get_cache_key_chart( $index_id, $range ) {
		$hash = substr( md5( $index_id . '|' . $range ), 0, 32 );
		return 'searchcraft_chart_' . self::CACHE_SCHEMA_VERSION . '_' . $hash;
	}

	/**
	 * Extract popular_terms from an API summary data array.
	 *
	 * Terms are sanitized via sanitize_text_field() — XSS hot zone downstream.
	 * Returns at most 10 entries, matching the Figma Popular Search Terms table.
	 *
	 * @since 1.5.0
	 * @param array $data Raw 'data' payload from the API response.
	 * @return array Array of {term, count} pairs.
	 */
	private function extract_popular_terms( $data ) {
		if ( ! isset( $data['popular_search_terms'] ) || ! is_array( $data['popular_search_terms'] ) ) {
			return array();
		}
		$terms = array();
		foreach ( $data['popular_search_terms'] as $item ) {
			if ( isset( $item['term'], $item['quantity'] ) ) {
				$terms[] = array(
					'term'  => sanitize_text_field( (string) $item['term'] ),
					'count' => (int) $item['quantity'],
				);
			}
		}
		return array_slice( $terms, 0, 10 );
	}

	/**
	 * Extract chart series from an API summary data array.
	 *
	 * Returns searches_chart.series[0].data as an array of [timestamp, count]
	 * pairs, which Chart.js consumes directly in Story 4.
	 *
	 * @since 1.5.0
	 * @param array $data Raw 'data' payload from the API response.
	 * @return array Array of [timestamp, count] pairs, or empty array.
	 */
	private function extract_chart_series( $data ) {
		if ( isset( $data['searches_chart']['series'][0]['data'] )
			&& is_array( $data['searches_chart']['series'][0]['data'] )
		) {
			return $data['searches_chart']['series'][0]['data'];
		}
		return array();
	}
}
