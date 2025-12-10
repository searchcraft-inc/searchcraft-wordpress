<?php
/**
 * The file that defines the admin-specific functionality of the plugin
 *
 * A class definition that includes attributes and functions used for
 * defining the admin-specific functionality of the plugin.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
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
 * The admin-specific functionality of the plugin
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @since      1.0.0
 * @package    Searchcraft
 * @subpackage Searchcraft/admin
 * @author     Searchcraft <support@searchcraft.io>
 */
class Searchcraft_Admin {
	/**
	 * The ID of the plugin.
	 *
	 * @since 1.0.0
	 * @var string $plugin_name The ID of the plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since 1.0.0
	 * @var string $plugin_version The version of this plugin.
	 */
	protected $plugin_version;

	/**
	 * The key with read (1) authorization.
	 *
	 * This key is used for:
	 * - Searching the index
	 *
	 * @since 1.0.0
	 * @var string $searchcraft_read_key The read key.
	 */
	protected $searchcraft_read_key;

	/**
	 * The key with ingest (1) authorization.
	 *
	 * This key is used for:
	 * - Managing the synonyms
	 * - Managing the stopwords
	 * - Managing the documents
	 *
	 * @since 1.0.0
	 * @var string $searchcraft_ingest_key The ingest key
	 */
	protected $searchcraft_ingest_key;

	/**
	 * The class constructor.
	 *
	 * @since 1.0.0
	 * @param string $plugin_name    The name of this plugin.
	 * @param string $plugin_version The version of this plugin.
	 */
	public function __construct( $plugin_name, $plugin_version ) {
		$this->plugin_name    = $plugin_name;
		$this->plugin_version = $plugin_version;

		// Initialize all hooks.
		$this->init_hooks();
	}

	/**
	 * Initialize all WordPress hooks for admin functionality.
	 *
	 * @since 1.0.0
	 */
	private function init_hooks() {
		// Only run setup if we're in the admin area and not during plugin activation.
		if ( is_admin() && ! ( defined( 'WP_INSTALLING' ) && WP_INSTALLING ) ) {
			// Defer setup to avoid memory issues during activation.
			add_action( 'admin_init', array( $this, 'searchcraft_setup' ) );
		}

		// Clear oldest post year transient when posts are published/updated.
		add_action( 'publish_post', array( $this, 'clear_oldest_post_year_transient' ) );
		add_action( 'delete_post', array( $this, 'clear_oldest_post_year_transient' ) );

		// Clear meta keys transient cache when posts are saved/updated.
		add_action( 'save_post', array( $this, 'clear_meta_keys_transient' ), 10, 1 );
		add_action( 'delete_post', array( $this, 'clear_meta_keys_transient' ), 10, 1 );

		// Register admin-specific hooks.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'remove_footer_on_searchcraft_pages' ) );
		add_action( 'admin_menu', array( $this, 'searchcraft_add_menu_page' ) );
		add_action( 'admin_init', array( $this, 'searchcraft_request_handler' ) );

		// Remove non-Searchcraft admin notices on Searchcraft pages.
		// Use admin_head which runs before admin_notices to safely modify the hooks.
		add_action( 'admin_head', array( $this, 'remove_non_searchcraft_notices' ) );

		// Use wp_after_insert_post instead of transition_post_status to ensure Yoast SEO meta data is saved first.
		add_action( 'wp_after_insert_post', array( $this, 'searchcraft_on_publish_post' ), 10, 4 );
		add_action( 'transition_post_status', array( $this, 'searchcraft_on_unpublish_post' ), 10, 3 );

		add_action( 'add_meta_boxes', array( $this, 'searchcraft_add_exclude_from_searchcraft_meta_box' ) );
		// 'save_post' happens before 'transition_post_status' in the execution order
		// So we will have the updated '_searchcraft_exclude_from_index' value before publishing the post
		add_action( 'save_post', array( $this, 'searchcraft_on_save_post' ) );
	}

	/**
	 * Get the year of the oldest post and store as transient. This is used for date filters.
	 *
	 * @since    1.0.0
	 * @return   int    The year of the oldest post
	 */
	public function get_oldest_post_year() {
		// Check if we have a cached value.
		$oldest_year = get_transient( 'searchcraft_oldest_post_year' );

		if ( false === $oldest_year ) {
			global $wpdb;

			// Check object cache first.
			$cache_key   = 'searchcraft_oldest_post_date';
			$oldest_post = wp_cache_get( $cache_key );

			if ( false === $oldest_post ) {
				// Query to get the oldest post date.
				$oldest_post = $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
					"SELECT post_date FROM {$wpdb->posts}
					 WHERE post_status = 'publish'
					 AND post_type = 'post'
					 ORDER BY post_date ASC
					 LIMIT 1"
				);

				// Cache the database result for 1 hour.
				wp_cache_set( $cache_key, $oldest_post, '', HOUR_IN_SECONDS );
			}

			if ( $oldest_post ) {
				$oldest_year = (int) gmdate( 'Y', strtotime( $oldest_post ) );
			} else {
				// Fallback to current year if no posts found.
				$oldest_year = (int) gmdate( 'Y' );
			}

			// Cache for 30 days.
			set_transient( 'searchcraft_oldest_post_year', $oldest_year, 30 * DAY_IN_SECONDS );
		}

		return $oldest_year;
	}

	/**
	 * Clear the oldest post year transient when posts are modified.
	 *
	 * @since    1.0.0
	 */
	public function clear_oldest_post_year_transient() {
		delete_transient( 'searchcraft_oldest_post_year' );
	}

	/**
	 * Clear the meta keys transient cache for a specific post type when posts are saved/deleted.
	 *
	 * @since    1.0.0
	 * @param int $post_id The post ID.
	 */
	public function clear_meta_keys_transient( $post_id ) {
		$post_type = get_post_type( $post_id );
		if ( $post_type ) {
			$transient_key = '_searchcraft_meta_keys_for_' . $post_type;
			delete_transient( $transient_key );
		}
	}

	/**
	 * Register the stylesheets for the admin.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_name . '-admin-styles', plugin_dir_url( __FILE__ ) . 'css/searchcraft-admin.css', array(), $this->plugin_version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( $this->plugin_name . '-admin-js', plugin_dir_url( __FILE__ ) . 'js/searchcraft-admin.js', array(), $this->plugin_version, false );
	}

	/**
	 * Remove WordPress footer on Searchcraft admin pages.
	 *
	 * @since 1.0.0
	 */
	public function remove_footer_on_searchcraft_pages() {
		$screen = get_current_screen();

		// Check if we're on a Searchcraft admin page.
		if ( $screen && strpos( $screen->id, 'searchcraft' ) !== false ) {
			// Remove the "Thank you for creating with WordPress" text.
			add_filter( 'admin_footer_text', '__return_false' );

			// Remove the WordPress version text.
			add_filter( 'update_footer', '__return_false', 11 );
		}
	}

	/**
	 * Remove non-Searchcraft admin notices on Searchcraft pages.
	 *
	 * This filters out all admin notices except those generated by Searchcraft itself.
	 * We remove hooks early before they execute to avoid modifying the filter array during iteration.
	 *
	 * @since 1.0.0
	 */
	public function remove_non_searchcraft_notices() {
		$screen = get_current_screen();

		// Only filter notices on Searchcraft admin pages.
		if ( ! $screen || strpos( $screen->id, 'searchcraft' ) === false ) {
			return;
		}

		global $wp_filter;

		// Check if admin_notices has any registered callbacks.
		if ( ! isset( $wp_filter['admin_notices'] ) || ! isset( $wp_filter['admin_notices']->callbacks ) ) {
			return;
		}

		// Collect callbacks to remove (we'll remove them after iteration to avoid issues).
		$callbacks_to_remove = array();

		// Iterate through all priorities.
		foreach ( $wp_filter['admin_notices']->callbacks as $priority => $callbacks ) {
			if ( ! is_array( $callbacks ) ) {
				continue;
			}

			foreach ( $callbacks as $key => $callback ) {
				$is_searchcraft_notice = false;

				// Check if this is a Searchcraft notice.
				if ( is_array( $callback['function'] ) ) {
					// Check for class-based callbacks.
					if ( isset( $callback['function'][0] ) && is_object( $callback['function'][0] ) ) {
						$class_name = get_class( $callback['function'][0] );
						if ( strpos( $class_name, 'Searchcraft' ) !== false ) {
							$is_searchcraft_notice = true;
						}
					}
				} elseif ( is_string( $callback['function'] ) ) {
					// Check for function name callbacks.
					if ( strpos( $callback['function'], 'searchcraft' ) !== false ) {
						$is_searchcraft_notice = true;
					}
				}

				// Mark non-Searchcraft notices for removal.
				if ( ! $is_searchcraft_notice ) {
					$callbacks_to_remove[] = array(
						'priority' => $priority,
						'key'      => $key,
					);
				}
			}
		}

		// Now remove the callbacks we identified.
		foreach ( $callbacks_to_remove as $item ) {
			unset( $wp_filter['admin_notices']->callbacks[ $item['priority'] ][ $item['key'] ] );
		}
	}

	/**
	 * Add the menu page.
	 *
	 * @since 1.0.0
	 */
	public function searchcraft_add_menu_page() {
		$svg_path = plugin_dir_path( __FILE__ ) . '../assets/images/searchcraft.svg';

		// Use WordPress filesystem API for reading local files.
		$svg_data = '';
		if ( file_exists( $svg_path ) ) {
			global $wp_filesystem;
			if ( empty( $wp_filesystem ) ) {
				require_once ABSPATH . '/wp-admin/includes/file.php';
				WP_Filesystem();
			}
			$svg_data = $wp_filesystem->get_contents( $svg_path );
		}

		// Base64 encode SVG for use as menu icon (legitimate use case).
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		$base64_svg_data = 'data:image/svg+xml;base64,' . base64_encode( $svg_data );

		add_menu_page(
			'Searchcraft',                                                   // Page title.
			'Searchcraft',                                                   // Menu title.
			'edit_posts',                                                    // Capability.
			'searchcraft',                                                   // Menu slug.
			array( $this, 'searchcraft_render_menu_page' ),                  // Callback.
			$base64_svg_data,                                               // SVG icon.
			61                                                              // Position (just below Appearance at 60).
		);
	}

	/**
	 * Render the menu page.
	 *
	 * @since 1.0.0
	 */
	public function searchcraft_render_menu_page() {
		include_once 'partials/searchcraft-admin-menu-page.php';
	}


	/**
	 *  Render the "Exclude from Searchcraft" meta box.
	 *
	 * @since 1.0.0
	 * @param WP_Post $post The WP_Post object (required by WordPress meta box callback).
	 */
	public function searchcraft_render_exclude_from_searchcraft_meta_box( $post ) {
		// Include the meta box template.
		include_once 'partials/searchcraft-admin-exclude-from-searchcraft-meta-box.php';

		// Note: $post parameter is required by WordPress meta box callback signature.
		// It is intentionally unused in this implementation as the template handles post data directly.
		// phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
		unset( $post );
	}

	/**
	 * Register the "Exclude from Searchcraft" meta box.
	 *
	 * It will appear on all post types.
	 *
	 * @since 1.0.0
	 */
	public function searchcraft_add_exclude_from_searchcraft_meta_box() {
		$post_types = get_post_types( array( 'public' => true ), 'names' );

		foreach ( $post_types as $post_type ) {
			add_meta_box(
				'searchcraft_exclude_from_index',                                         // ID.
				'Searchcraft',                                                            // Title.
				array( $this, 'searchcraft_render_exclude_from_searchcraft_meta_box' ),   // Callback.
				$post_type,                                                               // Post type.
				'side',                                                                   // Context (normal, side, advanced).
				'default'                                                                 // Priority.
			);
		}
	}

	/**
	 * Performs initial setup tasks for the Searchcraft integration.
	 *
	 * Includes retrieving necessary client keys and index configuration,
	 * and synchronizing documents, if need be.
	 *
	 * @since 1.0.0
	 */
	public function searchcraft_setup() {
		// Prevent multiple setup runs.
		static $setup_done = false;
		if ( $setup_done ) {
			return;
		}
		$setup_done = true;

		// Retrieve the client keys, required for read and ingest operations.
		$this->searchcraft_get_keys();
	}

	/**
	 * Initialize a Searchcraft client instance based on a specific key and type.
	 *
	 * The available client types correspond to permission levels:
	 * - admin (63): Full access
	 * - read (1): Read-only access
	 * - ingest (15): Add/update documents, synonyms, and stopwords
	 *
	 * @since 1.0.0
	 * @param string $key  The key associated with the client type.
	 * @param string $type The client type (determines permission level).
	 * @return object|null The initialized client instance.
	 */
	private function searchcraft_create_client( $key, $type ) {
		try {
			// Get endpoint URL from configuration.
			$endpoint_url = Searchcraft_Config::get_endpoint_url();

			// Attempt to instantiate the client with the provided credentials.
			$client = new SearchcraftPhpClient(
				$key,
				$type,
				$endpoint_url
			);

			// If the client was successfully created, return it.
			if ( isset( $client ) ) {
				return $client;
			}
		} catch ( \Exception $e ) {
			Searchcraft_Helper_Functions::searchcraft_error_log( $e );
		}

		return null;
	}

	/**
	 * Get the initialized read Searchcraft client instance.
	 *
	 * @since 1.0.0
	 * @return object|null The initialized client instance.
	 */
	public function searchcraft_get_read_client() {
		$read_key = Searchcraft_Config::get_read_key();
		if ( empty( $read_key ) ) {
			// Try to get keys if not already retrieved.
			$this->searchcraft_get_keys();
			$read_key = Searchcraft_Config::get_read_key();
		}
		return $this->searchcraft_create_client( $read_key, 'read' );
	}

	/**
	 * Get the initialized ingest Searchcraft client instance.
	 *
	 * @since 1.0.0
	 * @return object|null The initialized client instance.
	 */
	public function searchcraft_get_ingest_client() {
		$ingest_key = Searchcraft_Config::get_ingest_key();
		if ( empty( $ingest_key ) ) {
			// Try to get keys if not already retrieved.
			$this->searchcraft_get_keys();
			$ingest_key = Searchcraft_Config::get_ingest_key();
		}
		return $this->searchcraft_create_client( $ingest_key, 'ingest' );
	}

	/**
	 * Recursively sanitize an array of data.
	 *
	 * @param mixed $data The data to sanitize.
	 * @return mixed The sanitized data.
	 */
	private function sanitize_array_recursive( $data ) {
		if ( is_array( $data ) ) {
			return array_map( array( $this, 'sanitize_array_recursive' ), $data );
		} else {
			return sanitize_text_field( $data );
		}
	}

	/**
	 * Route and handle incoming $_POST requests.
	 *
	 * Ensures requests are secure and dispatches them to the appropriate handler
	 * based on the 'searchcraft_action' value.
	 *
	 * @since 1.0.0
	 */
	public function searchcraft_request_handler() {
		// Check if the request method is POST and a valid action is specified.
		if ( isset( $_SERVER['REQUEST_METHOD'] ) && 'POST' === $_SERVER['REQUEST_METHOD'] &&
			isset( $_POST['searchcraft_action'] ) ) {

			// Verify the nonce for security to prevent CSRF attacks.
			$nonce = isset( $_POST['searchcraft_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['searchcraft_nonce'] ) ) : '';
			if ( ! wp_verify_nonce( $nonce, 'searchcraft_settings' ) ) {
				wp_die( 'Invalid request.' ); // Abort if the nonce is invalid or missing.
			}

			$action = sanitize_text_field( wp_unslash( $_POST['searchcraft_action'] ) );

			// Route the action to the appropriate handler method.
			switch ( $action ) {
				case 'config':
					$config_data = isset( $_POST['searchcraft_config'] ) && is_array( $_POST['searchcraft_config'] ) ? $_POST['searchcraft_config'] : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized,WordPress.Security.ValidatedSanitizedInput.MissingUnslash
					$reset_flag  = isset( $_POST['searchcraft_reset_config'] );
					// Note: We can't rely on the submit button name being in POST because JavaScript hides it before submission.
					// Instead, treat it as a save if we have config data and we're not resetting.
					$save_flag   = ! $reset_flag && ! empty( $config_data );
					$this->searchcraft_on_config_request( $config_data, $reset_flag, $save_flag );
					break;
				case 'reindex_all_documents':
					$this->searchcraft_on_reindex_all_documents_request();
					break;
				case 'delete_all_documents':
					$this->searchcraft_on_delete_all_documents_request();
					break;
				case 'layout_settings_config':
					$this->searchcraft_on_layout_settings_config_request( $_POST ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					break;
				default:
					break;
			}
		}
	}

	/**
	 * Handles the configuration update request.
	 *
	 * @since 1.0.0
	 * @param array $config_data The configuration data array.
	 * @param bool  $reset_flag  Whether to reset the configuration.
	 * @param bool  $save_flag   Whether to save the configuration.
	 */
	private function searchcraft_on_config_request( $config_data, $reset_flag, $save_flag ) {
		// Handle reset request.
		if ( $reset_flag ) {
			Searchcraft_Config::reset();
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-success is-dismissible"><p>Configuration reset to defaults.</p></div>';
				}
			);
			return;
		}

		// Handle save request.
		if ( $save_flag && ! empty( $config_data ) ) {
			// Get existing config to preserve values that aren't being changed.
			$existing_config = Searchcraft_Config::get_all();

			// Sanitize the input data with proper validation.
			$sanitized_config = array(
				'endpoint_url' => isset( $config_data['endpoint_url'] ) ? esc_url_raw( wp_unslash( $config_data['endpoint_url'] ) ) : '',
				'index_id'     => isset( $config_data['index_id'] ) ? sanitize_text_field( wp_unslash( $config_data['index_id'] ) ) : '',
				'read_key'     => isset( $config_data['read_key'] ) && ! empty( $config_data['read_key'] ) ? sanitize_text_field( wp_unslash( $config_data['read_key'] ) ) : $existing_config['read_key'],
				'ingest_key'   => isset( $config_data['ingest_key'] ) && ! empty( $config_data['ingest_key'] ) ? sanitize_text_field( wp_unslash( $config_data['ingest_key'] ) ) : $existing_config['ingest_key'],
				'cortex_url'   => isset( $config_data['cortex_url'] ) && ! empty( $config_data['cortex_url'] ) ? esc_url_raw( wp_unslash( $config_data['cortex_url'] ) ) : '',
			);

			// Validate the configuration.
			$errors = Searchcraft_Config::validate( $sanitized_config );

			if ( empty( $errors ) ) {
				// Save the configuration.
				$success = Searchcraft_Config::set_multiple( $sanitized_config );

				// Get previous taxonomy selections.
				$previous_taxonomies = get_option( 'searchcraft_filter_taxonomies', array() );
				if ( ! is_array( $previous_taxonomies ) ) {
					$previous_taxonomies = array();
				}

				// Save taxonomy filter selections.
				$filter_taxonomies = isset( $_POST['searchcraft_filter_taxonomies'] ) && is_array( $_POST['searchcraft_filter_taxonomies'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in searchcraft_request_handler().
					? array_map( 'sanitize_text_field', wp_unslash( $_POST['searchcraft_filter_taxonomies'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing  -- Nonce verified in searchcraft_request_handler().
					: array();

				// Always include category in the filter taxonomies.
				if ( ! in_array( 'category', $filter_taxonomies, true ) ) {
					$filter_taxonomies[] = 'category';
				}

				// Normalize previous taxonomies to also include category for fair comparison.
				if ( ! in_array( 'category', $previous_taxonomies, true ) ) {
					$previous_taxonomies[] = 'category';
				}

				// Sort both arrays to ensure order doesn't affect comparison.
				sort( $previous_taxonomies );
				sort( $filter_taxonomies );

				update_option( 'searchcraft_filter_taxonomies', $filter_taxonomies );

				// Save PublishPress Authors setting.
				$use_publishpress_authors = isset( $_POST['searchcraft_use_publishpress_authors'] ) ? '1' : '0'; // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in searchcraft_request_handler().
				update_option( 'searchcraft_use_publishpress_authors', $use_publishpress_authors );

				// Get previous custom post types selections for comparison.
				$previous_custom_post_types = get_option( 'searchcraft_custom_post_types', array() );
				if ( ! is_array( $previous_custom_post_types ) ) {
					$previous_custom_post_types = array();
				}
				$previous_custom_post_types_with_fields = get_option( 'searchcraft_custom_post_types_with_fields', array() );
				if ( ! is_array( $previous_custom_post_types_with_fields ) ) {
					$previous_custom_post_types_with_fields = array();
				}

				// Save custom post types selections.
				$custom_post_types = isset( $_POST['searchcraft_custom_post_types'] ) && is_array( $_POST['searchcraft_custom_post_types'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in searchcraft_request_handler().
					? array_map( 'sanitize_text_field', wp_unslash( $_POST['searchcraft_custom_post_types'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing  -- Nonce verified in searchcraft_request_handler().
					: array();

				// Save custom post types with custom fields enabled.
				$custom_post_types_with_fields = isset( $_POST['searchcraft_custom_post_types_with_fields'] ) && is_array( $_POST['searchcraft_custom_post_types_with_fields'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in searchcraft_request_handler().
					? array_map( 'sanitize_text_field', wp_unslash( $_POST['searchcraft_custom_post_types_with_fields'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing  -- Nonce verified in searchcraft_request_handler().
					: array();

				// Sort arrays for fair comparison.
				sort( $previous_custom_post_types );
				sort( $custom_post_types );
				sort( $previous_custom_post_types_with_fields );
				sort( $custom_post_types_with_fields );

				// Check if custom post types or custom fields have changed.
				$custom_post_types_changed        = ( serialize( $previous_custom_post_types ) !== serialize( $custom_post_types ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
				$custom_post_types_fields_changed = ( serialize( $previous_custom_post_types_with_fields ) !== serialize( $custom_post_types_with_fields ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize

				// Update options after comparison.
				update_option( 'searchcraft_custom_post_types', $custom_post_types );
				update_option( 'searchcraft_custom_post_types_with_fields', $custom_post_types_with_fields );

				// Check if taxonomies have changed and need index update.
				// We need to update if taxonomies changed, regardless of whether we're adding or removing them.
				$taxonomies_changed = ( serialize( $previous_taxonomies ) !== serialize( $filter_taxonomies ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
				$needs_index_update = $taxonomies_changed || $custom_post_types_changed || $custom_post_types_fields_changed;

				if ( $success ) {
					// Clear cached data since configuration has changed.
					delete_transient( 'searchcraft_index_stats' );
					delete_transient( 'searchcraft_index' );
					// Update index schema if taxonomies or custom post types changed.
					if ( $needs_index_update ) {
						$all_updates_successful = true;
						$reindexed               = false;
						$error_messages          = array();

						// Update taxonomy schema if taxonomies changed.
						if ( $taxonomies_changed ) {
							$index_update_result = $this->searchcraft_update_index_schema( $filter_taxonomies );

							if ( ! $index_update_result['success'] ) {
								$all_updates_successful = false;
								$error_messages[]        = 'Taxonomy schema update: ' . $index_update_result['error'];
							} elseif ( $index_update_result['reindexed'] ) {
								$reindexed = true;
							}
						}

						// Update custom post types schema if custom post types or fields changed.
						if ( $custom_post_types_changed || $custom_post_types_fields_changed ) {
							$custom_types_update_result = $this->searchcraft_update_index_schema_for_custom_post_types(
								$custom_post_types,
								$custom_post_types_with_fields,
								$previous_custom_post_types_with_fields
							);

							if ( ! $custom_types_update_result['success'] ) {
								$all_updates_successful = false;
								$error_messages[]        = 'Custom post types schema update: ' . $custom_types_update_result['error'];
							} elseif ( $custom_types_update_result['reindexed'] ) {
								$reindexed = true;
							}
						}

						if ( $all_updates_successful ) {
							$message = 'Configuration saved successfully.';
							if ( $reindexed ) {
								$message .= ' Index schema updated and documents re-indexed.';
							} else {
								$message .= ' Index schema updated.';
							}

							add_action(
								'admin_notices',
								function () use ( $message ) {
									echo '<div class="notice notice-success is-dismissible"><p>' . esc_html( $message ) . '</p></div>';
								}
							);
						} else {
							$error_message = implode( ' ', $error_messages );
							add_action(
								'admin_notices',
								function () use ( $error_message ) {
									echo '<div class="notice notice-error is-dismissible">';
									echo '<p><strong>Configuration saved, but there was an issue:</strong></p>';
									echo '<p>' . esc_html( $error_message ) . '</p>';
									echo '<p>Please check the error logs for more details or contact support.</p>';
									echo '</div>';
								}
							);
						}
					} else {
						add_action(
							'admin_notices',
							function () {
								echo '<div class="notice notice-success is-dismissible"><p>Configuration saved successfully.</p></div>';
							}
						);
					}
				} else {
					add_action(
						'admin_notices',
						function () {
							echo '<div class="notice notice-error is-dismissible"><p>Failed to save configuration.</p></div>';
						}
					);
				}
			} else {
				// Display validation errors.
				add_action(
					'admin_notices',
					function () use ( $errors ) {
						echo '<div class="notice notice-error is-dismissible">';
						echo '<p><strong>Configuration errors:</strong></p><ul>';
						foreach ( $errors as $field => $error ) {
							echo '<li>' . esc_html( ucfirst( str_replace( '_', ' ', $field ) . ': ' . $error ) ) . '</li>';
						}
						echo '</ul></div>';
					}
				);
			}
		}
	}

	/**
	 * Handles the request to delete all documents from the index.
	 *
	 * @since 1.0.0
	 */
	private function searchcraft_on_delete_all_documents_request() {
		try {
			$this->searchcraft_delete_all_documents();

			// Show success message.
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-success is-dismissible">';
					echo '<p><strong>Success:</strong> All documents have been deleted from the Searchcraft index.</p>';
					echo '</div>';
				}
			);
		} catch ( \Exception $e ) {
			// Show error message.
			add_action(
				'admin_notices',
				function () use ( $e ) {
					echo '<div class="notice notice-error is-dismissible">';
					echo '<p><strong>Error:</strong> Failed to delete documents. ' . esc_html( $e->getMessage() ) . '</p>';
					echo '</div>';
				}
			);
		}
	}

	/**
	 * Handles the request to re-index all documents from the index.
	 *
	 * @since 1.0.0
	 */
	private function searchcraft_on_reindex_all_documents_request() {
		try {
			$this->searchcraft_add_all_documents();

			// Show success message.
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-success is-dismissible">';
					echo '<p><strong>Success:</strong> All documents have been added to the Searchcraft index.</p>';
					echo '</div>';
				}
			);
		} catch ( \Exception $e ) {
			// Show error message.
			add_action(
				'admin_notices',
				function () use ( $e ) {
					echo '<div class="notice notice-error is-dismissible">';
					echo '<p><strong>Error:</strong> Failed to index documents. ' . esc_html( $e->getMessage() ) . '</p>';
					echo '</div>';
				}
			);
		}
	}

	/**
	 * Handles the unified layout settings configuration request.
	 * This combines all layout-related settings: search form, search results, and advanced settings.
	 *
	 * @since 1.0.0
	 * @param array $request The $_POST request from the form submission.
	 */
	private function searchcraft_on_layout_settings_config_request( $request ) {
		// Ensure request is an array.
		if ( ! is_array( $request ) ) {
			return;
		}

		$updated_settings = array();

		// ========================================
		// SEARCH FORM SETTINGS
		// ========================================

		// Handle search experience type.
		if ( isset( $request['searchcraft_search_experience'] ) ) {
			$experience = sanitize_text_field( wp_unslash( $request['searchcraft_search_experience'] ) );

			// Validate the experience value.
			$valid_experiences = array( 'full', 'popover' );
			if ( ! in_array( $experience, $valid_experiences, true ) ) {
				$experience = 'full';
			}

			update_option( 'searchcraft_search_experience', $experience );
			$updated_settings['experience'] = $experience;
		}

		// Handle search behavior.
		if ( isset( $request['searchcraft_search_behavior'] ) ) {
			$behavior        = sanitize_text_field( wp_unslash( $request['searchcraft_search_behavior'] ) );
			$valid_behaviors = array( 'on_page', 'stand_alone' );
			if ( ! in_array( $behavior, $valid_behaviors, true ) ) {
				$behavior = 'on_page';
			}
			update_option( 'searchcraft_search_behavior', $behavior );
			$updated_settings['behavior'] = $behavior;
		}

		// Handle search placeholder text.
		if ( isset( $request['searchcraft_search_placeholder'] ) ) {
			$placeholder = sanitize_text_field( wp_unslash( $request['searchcraft_search_placeholder'] ) );

			// Use default if empty.
			if ( empty( $placeholder ) ) {
				$placeholder = 'Search...';
			}

			update_option( 'searchcraft_search_placeholder', $placeholder );
			$updated_settings['placeholder'] = $placeholder;
		}

		// Handle input component horizontal padding.
		if ( isset( $request['searchcraft_input_padding'] ) ) {
			$padding = absint( wp_unslash( $request['searchcraft_input_padding'] ) );

			// Validate range (0-200px).
			if ( $padding < 0 ) {
				$padding = 0;
			} elseif ( $padding > 200 ) {
				$padding = 200;
			}

			update_option( 'searchcraft_input_padding', $padding );
			$updated_settings['padding'] = $padding;
		}

		// Handle input component vertical padding.
		if ( isset( $request['searchcraft_input_vertical_padding'] ) ) {
			$vertical_padding = absint( wp_unslash( $request['searchcraft_input_vertical_padding'] ) );

			// Validate range (0-100px).
			if ( $vertical_padding < 0 ) {
				$vertical_padding = 0;
			} elseif ( $vertical_padding > 100 ) {
				$vertical_padding = 100;
			}

			update_option( 'searchcraft_input_vertical_padding', $vertical_padding );
			$updated_settings['vertical_padding'] = $vertical_padding;
		}

		// Handle input border radius.
		if ( isset( $request['searchcraft_input_border_radius'] ) ) {
			$border_radius = sanitize_text_field( wp_unslash( $request['searchcraft_input_border_radius'] ) );

			// Allow empty value (no default).
			if ( '' === $border_radius ) {
				update_option( 'searchcraft_input_border_radius', '' );
				$updated_settings['border_radius'] = 'default';
			} else {
				$border_radius = absint( $border_radius );

				if ( $border_radius < 0 ) {
					$border_radius = 0;
				} elseif ( $border_radius > 1000 ) {
					$border_radius = 1000;
				}

				update_option( 'searchcraft_input_border_radius', $border_radius );
				$updated_settings['border_radius'] = $border_radius . 'px';
			}
		}

		// Handle search icon color.
		if ( isset( $request['searchcraft_search_icon_color'] ) ) {
			$search_icon_color = sanitize_text_field( wp_unslash( $request['searchcraft_search_icon_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $search_icon_color ) ) {
				$search_icon_color = '#000000';
			}

			update_option( 'searchcraft_search_icon_color', $search_icon_color );
			$updated_settings['search_icon_color'] = $search_icon_color;
		}

		// Handle clear icon color.
		if ( isset( $request['searchcraft_clear_icon_color'] ) ) {
			$clear_icon_color = sanitize_text_field( wp_unslash( $request['searchcraft_clear_icon_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $clear_icon_color ) ) {
				$clear_icon_color = '#000000';
			}

			update_option( 'searchcraft_clear_icon_color', $clear_icon_color );
			$updated_settings['clear_icon_color'] = $clear_icon_color;
		}

		// Handle input width.
		if ( isset( $request['searchcraft_input_width'] ) ) {
			$input_width = absint( wp_unslash( $request['searchcraft_input_width'] ) );

			// Validate range (1-100%).
			if ( $input_width < 1 ) {
				$input_width = 1;
			} elseif ( $input_width > 100 ) {
				$input_width = 100;
			}

			update_option( 'searchcraft_input_width', $input_width );
			$updated_settings['input_width'] = $input_width;
		}

		// ========================================
		// SEARCH RESULTS SETTINGS
		// ========================================

		// Handle AI summary setting.
		$enable_ai_summary = isset( $request['searchcraft_enable_ai_summary'] ) ? true : false;
		update_option( 'searchcraft_enable_ai_summary', $enable_ai_summary );
		$updated_settings['ai_summary'] = $enable_ai_summary ? 'enabled' : 'disabled';

		// Handle AI summary banner text.
		if ( isset( $request['searchcraft_ai_summary_banner'] ) ) {
			$ai_summary_banner = sanitize_text_field( wp_unslash( $request['searchcraft_ai_summary_banner'] ) );
			update_option( 'searchcraft_ai_summary_banner', $ai_summary_banner );
		}

		// Handle filter panel setting.
		$include_filter_panel = isset( $request['searchcraft_include_filter_panel'] ) ? true : false;
		update_option( 'searchcraft_include_filter_panel', $include_filter_panel );
		$updated_settings['filter_panel'] = $include_filter_panel ? 'enabled' : 'disabled';

		// Handle filter panel toggle settings.
		$enable_most_recent_toggle = isset( $request['searchcraft_enable_most_recent_toggle'] ) ? '1' : '0';
		update_option( 'searchcraft_enable_most_recent_toggle', $enable_most_recent_toggle );

		$enable_exact_match_toggle = isset( $request['searchcraft_enable_exact_match_toggle'] ) ? '1' : '0';
		update_option( 'searchcraft_enable_exact_match_toggle', $enable_exact_match_toggle );

		$enable_date_range = isset( $request['searchcraft_enable_date_range'] ) ? '1' : '0';
		update_option( 'searchcraft_enable_date_range', $enable_date_range );

		$enable_facets = isset( $request['searchcraft_enable_facets'] ) ? '1' : '0';
		update_option( 'searchcraft_enable_facets', $enable_facets );

		$hide_uncategorized = isset( $request['searchcraft_hide_uncategorized'] ) ? true : false;
		update_option( 'searchcraft_hide_uncategorized', $hide_uncategorized );

		$enable_post_type_filter = isset( $request['searchcraft_enable_post_type_filter'] ) ? true : false;
		update_option( 'searchcraft_enable_post_type_filter', $enable_post_type_filter );

		// Handle filter panel order.
		if ( isset( $request['searchcraft_filter_panel_order'] ) ) {
			$filter_panel_order = sanitize_text_field( wp_unslash( $request['searchcraft_filter_panel_order'] ) );
			$filter_panel_order_array = array_filter( array_map( 'trim', explode( ',', $filter_panel_order ) ) );

			// Validate that we have valid filter keys.
			$valid_keys = array( 'most_recent', 'exact_match', 'date_range', 'post_type', 'facets' );
			$filter_panel_order_array = array_intersect( $filter_panel_order_array, $valid_keys );

			// Ensure all keys are present (add missing ones at the end).
			foreach ( $valid_keys as $key ) {
				if ( ! in_array( $key, $filter_panel_order_array, true ) ) {
					$filter_panel_order_array[] = $key;
				}
			}

			update_option( 'searchcraft_filter_panel_order', $filter_panel_order_array );
		}

		// Handle toggle button disabled color.
		if ( isset( $request['searchcraft_toggle_button_disabled_color'] ) ) {
			$toggle_button_disabled_color = sanitize_text_field( wp_unslash( $request['searchcraft_toggle_button_disabled_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $toggle_button_disabled_color ) ) {
				$toggle_button_disabled_color = '#E0E0E0';
			}

			update_option( 'searchcraft_toggle_button_disabled_color', $toggle_button_disabled_color );
		}

		// Handle filter label color.
		if ( isset( $request['searchcraft_filter_label_color'] ) ) {
			$filter_label_color = sanitize_text_field( wp_unslash( $request['searchcraft_filter_label_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $filter_label_color ) ) {
				$filter_label_color = '#000000';
			}

			update_option( 'searchcraft_filter_label_color', $filter_label_color );
		}

		// Handle results per page setting.
		if ( isset( $request['searchcraft_results_per_page'] ) ) {
			$results_per_page = absint( wp_unslash( $request['searchcraft_results_per_page'] ) );

			// Validate the results per page value (between 1 and 100).
			if ( $results_per_page < 1 ) {
				$results_per_page = 1;
			} elseif ( $results_per_page > 100 ) {
				$results_per_page = 100;
			}

			update_option( 'searchcraft_results_per_page', $results_per_page );
			$updated_settings['results_per_page'] = $results_per_page;
		}

		// Handle result orientation setting.
		if ( isset( $request['searchcraft_result_orientation'] ) ) {
			$result_orientation = sanitize_text_field( wp_unslash( $request['searchcraft_result_orientation'] ) );

			// Validate the orientation value.
			$valid_orientations = array( 'column', 'grid' );
			if ( ! in_array( $result_orientation, $valid_orientations, true ) ) {
				$result_orientation = 'column';
			}

			update_option( 'searchcraft_result_orientation', $result_orientation );
			$updated_settings['result_orientation'] = $result_orientation;
		}

		// Handle image alignment setting.
		if ( isset( $request['searchcraft_image_alignment'] ) ) {
			$image_alignment = sanitize_text_field( wp_unslash( $request['searchcraft_image_alignment'] ) );

			// Validate the alignment value.
			$valid_alignments = array( 'left', 'right' );
			if ( ! in_array( $image_alignment, $valid_alignments, true ) ) {
				$image_alignment = 'left';
			}

			update_option( 'searchcraft_image_alignment', $image_alignment );
			$updated_settings['image_alignment'] = $image_alignment;
		}

		// Handle display post date setting.
		$display_post_date = isset( $request['searchcraft_display_post_date'] ) ? true : false;
		update_option( 'searchcraft_display_post_date', $display_post_date );

		// Handle display primary category setting.
		$display_primary_category = isset( $request['searchcraft_display_primary_category'] ) ? '1' : '0';
		update_option( 'searchcraft_display_primary_category', $display_primary_category );

		// Handle brand color setting.
		if ( isset( $request['searchcraft_brand_color'] ) ) {
			$brand_color = sanitize_text_field( wp_unslash( $request['searchcraft_brand_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $brand_color ) ) {
				$brand_color = '#000000';
			}

			update_option( 'searchcraft_brand_color', $brand_color );
			$updated_settings['brand_color'] = $brand_color;
		}

		// Handle result info text color.
		if ( isset( $request['searchcraft_result_info_text_color'] ) ) {
			$result_info_text_color = sanitize_text_field( wp_unslash( $request['searchcraft_result_info_text_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $result_info_text_color ) ) {
				$result_info_text_color = '#6C757D';
			}

			update_option( 'searchcraft_result_info_text_color', $result_info_text_color );
		}

		// Handle summary background color setting.
		if ( isset( $request['searchcraft_summary_background_color'] ) ) {
			$summary_background_color = sanitize_text_field( wp_unslash( $request['searchcraft_summary_background_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $summary_background_color ) ) {
				$summary_background_color = '#F5F5F5';
			}

			update_option( 'searchcraft_summary_background_color', $summary_background_color );
		}

		// Handle summary border color setting.
		if ( isset( $request['searchcraft_summary_border_color'] ) ) {
			$summary_border_color = sanitize_text_field( wp_unslash( $request['searchcraft_summary_border_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $summary_border_color ) ) {
				$summary_border_color = '#E0E0E0';
			}

			update_option( 'searchcraft_summary_border_color', $summary_border_color );
		}

		// Handle summary title color.
		if ( isset( $request['searchcraft_summary_title_color'] ) ) {
			$summary_title_color = sanitize_text_field( wp_unslash( $request['searchcraft_summary_title_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $summary_title_color ) ) {
				$summary_title_color = '#000000';
			}

			update_option( 'searchcraft_summary_title_color', $summary_title_color );
		}

		// Handle summary text color setting.
		if ( isset( $request['searchcraft_summary_text_color'] ) ) {
			$summary_text_color = sanitize_text_field( wp_unslash( $request['searchcraft_summary_text_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $summary_text_color ) ) {
				$summary_text_color = '#4C6876';
			}

			update_option( 'searchcraft_summary_text_color', $summary_text_color );
		}

		// Handle summary box border radius setting.
		if ( isset( $request['searchcraft_summary_box_border_radius'] ) ) {
			$summary_box_border_radius = absint( wp_unslash( $request['searchcraft_summary_box_border_radius'] ) );

			// Validate the border radius value (between 0 and 1000).
			if ( $summary_box_border_radius < 0 ) {
				$summary_box_border_radius = 0;
			} elseif ( $summary_box_border_radius > 1000 ) {
				$summary_box_border_radius = 1000;
			}

			update_option( 'searchcraft_summary_box_border_radius', $summary_box_border_radius );
		}

		// ========================================
		// ADVANCED SETTINGS
		// ========================================

		// Handle custom CSS setting.
		if ( isset( $request['searchcraft_custom_css'] ) ) {
			// Use wp_unslash and trim without sanitize_textarea_field to preserve CSS syntax.
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Custom sanitization below for CSS.
			$custom_css = trim( wp_unslash( $request['searchcraft_custom_css'] ) );
			// Strip any HTML/script tags from CSS.
			$custom_css = wp_strip_all_tags( $custom_css );
			// Additional CSS-specific sanitization to remove potential XSS.
			$custom_css = preg_replace( '/javascript\s*:/i', '', $custom_css );
			$custom_css = preg_replace( '/expression\s*\(/i', '', $custom_css );
			$custom_css = preg_replace( '/@import/i', '', $custom_css );
			update_option( 'searchcraft_custom_css', $custom_css );
			$updated_settings['custom_css'] = true;
		}

		// Handle result template callback function setting.
		if ( isset( $request['searchcraft_result_template'] ) ) {
			// Use wp_unslash and trim without sanitize_textarea_field to preserve HTML/JS.
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Custom sanitization below for JavaScript template.
			$result_template = trim( wp_unslash( $request['searchcraft_result_template'] ) );
			// Additional sanitization for JavaScript callback - remove dangerous patterns.
			$result_template = preg_replace( '/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi', '', $result_template );
			// Remove potential XSS vectors while preserving template literal HTML.
			$result_template = preg_replace( '/javascript\s*:/i', '', $result_template );
			$result_template = preg_replace( '/on\w+\s*=/i', '', $result_template );
			$result_template = preg_replace( '/eval\s*\(/i', '', $result_template );
			update_option( 'searchcraft_result_template', $result_template );
			$updated_settings['result_template'] = true;
		}

		// Handle search input container ID (always save, even if empty).
		$input_container_id = '';
		if ( isset( $request['searchcraft_search_input_container_id'] ) ) {
			$input_container_id = sanitize_text_field( wp_unslash( $request['searchcraft_search_input_container_id'] ) );
			// Remove any invalid characters for HTML IDs.
			$input_container_id = preg_replace( '/[^a-zA-Z0-9_-]/', '', $input_container_id );
		}
		update_option( 'searchcraft_search_input_container_id', $input_container_id );

		// Handle results container ID setting.
		if ( isset( $request['searchcraft_results_container_id'] ) ) {
			$results_container_id = sanitize_text_field( wp_unslash( $request['searchcraft_results_container_id'] ) );
			// Remove any invalid characters for HTML IDs.
			$results_container_id = preg_replace( '/[^a-zA-Z0-9_-]/', '', $results_container_id );
			update_option( 'searchcraft_results_container_id', $results_container_id );
		}

		// Handle popover container ID setting.
		if ( isset( $request['searchcraft_popover_container_id'] ) ) {
			$popover_container_id = sanitize_text_field( wp_unslash( $request['searchcraft_popover_container_id'] ) );
			$popover_container_id = preg_replace( '/[^a-zA-Z0-9_-]/', '', $popover_container_id );
			update_option( 'searchcraft_popover_container_id', $popover_container_id );
		}

		// Handle popover element behavior setting.
		if ( isset( $request['searchcraft_popover_element_behavior'] ) ) {
			$popover_element_behavior = sanitize_text_field( wp_unslash( $request['searchcraft_popover_element_behavior'] ) );

			// Validate the behavior value.
			$valid_behaviors = array( 'replace', 'insert' );
			if ( ! in_array( $popover_element_behavior, $valid_behaviors, true ) ) {
				$popover_element_behavior = 'replace';
			}

			update_option( 'searchcraft_popover_element_behavior', $popover_element_behavior );
		}

		// Display unified success message.
		add_action(
			'admin_notices',
			function () {
				echo '<div class="notice notice-success is-dismissible">';
				echo '<p><strong>Success:</strong> All layout settings have been saved.</p>';
				echo '</div>';
			}
		);
	}

	/**
	 * Checks if the current theme has a search form.
	 *
	 * @since 1.0.0
	 * @return bool True if theme has search form, false otherwise.
	 */
	public function searchcraft_theme_has_search_form() {
		// Check if theme supports search form.
		if ( current_theme_supports( 'html5', 'search-form' ) || current_theme_supports( 'search-form' ) ) {
			return true;
		}

		// Check common theme files for search form.
		$theme_files = array(
			'searchform.php',
			'header.php',
			'sidebar.php',
			'footer.php',
			'index.php',
		);

		$theme_path = get_template_directory();
		foreach ( $theme_files as $file ) {
			$file_path = $theme_path . '/' . $file;
			if ( file_exists( $file_path ) ) {
				$content = file_get_contents( $file_path );
				// Check for search form indicators.
				if ( strpos( $content, 'get_search_form' ) !== false ||
					strpos( $content, 'search-form' ) !== false ||
					strpos( $content, 'searchform' ) !== false ||
					strpos( $content, 'type="search"' ) !== false ) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Get index statistics including document count.
	 *
	 * @since 1.0.0
	 * @return array|null Index statistics or null if unavailable.
	 */
	public function searchcraft_get_index_stats() {
		// Check if we have a cached version of the stats.
		$stats = get_transient( 'searchcraft_index_stats' );
		if ( false !== $stats ) {
			return $stats;
		}

		// Get the ingest client to fetch stats.
		$ingest_client = $this->searchcraft_get_ingest_client();
		if ( ! $ingest_client ) {
			return null;
		}

		// Get the current index ID from configuration instead of using the constant
		// which may be outdated if configuration was just saved.
		$index_id = Searchcraft_Config::get_index_id();
		if ( empty( $index_id ) ) {
			Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Index ID is not configured.' );
			return null;
		}

		try {
			// Fetch index statistics from the client.
			$response = $ingest_client->index()->getIndexStats( $index_id );
			$stats    = $response['data'] ?? $response;

			// Cache the stats for 5 minutes.
			set_transient( 'searchcraft_index_stats', $stats, MINUTE_IN_SECONDS * 5 );

			return $stats;
		} catch ( \Exception $e ) {
			Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Failed to fetch index stats: ' . $e->getMessage() );
			return null;
		}
	}
	/**
	 * Handles the regeneration of keys by deleting the existing ones.
	 *
	 * @since 1.0.0
	 */
	private function searchcraft_on_keys_request() {
		try {
			// Attempt to delete the current read key.
			$this->searchcraft_get_ingest_client()
				->authentication()
				->deleteKey( $this->searchcraft_read_key );

			// Attempt to delete the current ingest key.
			$this->searchcraft_get_ingest_client()
				->authentication()
				->deleteKey( $this->searchcraft_ingest_key );
		} catch ( \Exception $e ) {
			Searchcraft_Helper_Functions::searchcraft_error_log( $e );
		}

		// Note: New keys will be automatically generated and loaded.
		// when needed by future requests, so no need to fetch them here.
	}

	/**
	 * Update the index schema to include taxonomy fields.
	 *
	 * @since 1.0.0
	 * @param array $taxonomies Array of taxonomy names to add as facet fields.
	 * @return array Result array with 'success', 'error', and 'reindexed' keys.
	 */
	private function searchcraft_update_index_schema( $taxonomies ) {
		$result = array(
			'success'   => false,
			'error'     => '',
			'reindexed' => false,
		);

		// Get the ingest client.
		$ingest_client = $this->searchcraft_get_ingest_client();
		if ( ! $ingest_client ) {
			$result['error'] = 'Unable to get ingest client.';
			return $result;
		}

		// Get the index ID.
		$index_id = Searchcraft_Config::get_index_id();
		if ( empty( $index_id ) ) {
			$result['error'] = 'Index ID is not configured.';
			return $result;
		}

		try {
			// Get the current index configuration.
			$response       = $ingest_client->index()->getIndex( $index_id );
			$current_index  = $response['data'] ?? $response;
			$current_fields = $current_index['fields'] ?? array();

			// Check if documents exist in the index.
			$stats          = $this->searchcraft_get_index_stats();
			$document_count = isset( $stats['document_count'] ) ? (int) $stats['document_count'] : 0;

			// Get all public taxonomies to identify which fields are taxonomy fields.
			$all_taxonomies = get_taxonomies( array( 'public' => true ), 'names' );

			// Build the desired taxonomy fields based on selected taxonomies.
			$desired_taxonomy_fields = array();
			foreach ( $taxonomies as $taxonomy_name ) {
				// Skip category as it should already be in the base schema.
				if ( 'category' === $taxonomy_name ) {
					continue;
				}

				$desired_taxonomy_fields[ $taxonomy_name ] = array(
					'indexed'  => true,
					'multi'    => true,
					'required' => false,
					'stored'   => true,
					'type'     => 'facet',
				);
			}

			// Start with current fields and update taxonomy fields.
			$updated_fields = $current_fields;

			// Remove taxonomy fields that are no longer selected.
			foreach ( $current_fields as $field_name => $field_config ) {
				// Check if this is a taxonomy field that's no longer selected.
				if ( in_array( $field_name, $all_taxonomies, true ) &&
					'category' !== $field_name &&
					! isset( $desired_taxonomy_fields[ $field_name ] ) ) {
					unset( $updated_fields[ $field_name ] );
				}
			}

			// Add or update selected taxonomy fields.
			foreach ( $desired_taxonomy_fields as $taxonomy_name => $field_config ) {
				$updated_fields[ $taxonomy_name ] = $field_config;
			}

			// Check if fields actually changed.
			if ( serialize( $current_fields ) === serialize( $updated_fields ) ) { // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
				$result['success'] = true;
				return $result;
			}

			// Update the index with new fields.
			// Start with the current index configuration and only update the fields.
			// This preserves all other index properties (language, search_fields, weight_multipliers, etc.)
			// without having to explicitly list them, making this future-proof.
			$update_payload           = $current_index;
			$update_payload['fields'] = $updated_fields;

			$ingest_client->index()->updateIndex( $index_id, $update_payload );

			// If documents exist, re-index them to include the new taxonomy data.
			if ( $document_count > 0 ) {
				try {
					$this->searchcraft_add_all_documents();
					$result['reindexed'] = true;
				} catch ( \Exception $e ) {
					// Index schema was updated but re-indexing failed.
					$result['success'] = true;
					$result['error']   = 'Index schema updated, but re-indexing failed: ' . $e->getMessage();
					Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Re-indexing failed after schema update: ' . $e->getMessage() );
					return $result;
				}
			}

			$result['success'] = true;
		} catch ( \Exception $e ) {
			$result['error'] = $e->getMessage();
			Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Failed to update index schema: ' . $e->getMessage() );
		}

		return $result;
	}

	/**
	 * Update the index schema to include custom post type fields.
	 *
	 * This function:
	 * 1. Adds a 'type' text field to the schema
	 * 2. For each custom post type with fields enabled, adds custom field definitions
	 * 3. Updates the index schema via updateIndex()
	 * 4. Re-indexes all documents if any exist
	 *
	 * @since 1.0.0
	 * @param array $selected_custom_post_types Array of selected custom post type names.
	 * @param array $custom_post_types_with_fields Array of custom post types with custom fields enabled.
	 * @param array $previous_custom_post_types_with_fields Array of previously selected custom post types with custom fields enabled.
	 * @return array Result array with 'success', 'error', and 'reindexed' keys.
	 */
	private function searchcraft_update_index_schema_for_custom_post_types( $selected_custom_post_types, $custom_post_types_with_fields, $previous_custom_post_types_with_fields = array() ) {
		$result = array(
			'success'   => false,
			'error'     => '',
			'reindexed' => false,
		);

		// Get the ingest client.
		$ingest_client = $this->searchcraft_get_ingest_client();
		if ( ! $ingest_client ) {
			$result['error'] = 'Unable to get ingest client.';
			return $result;
		}

		// Get the index ID.
		$index_id = Searchcraft_Config::get_index_id();
		if ( empty( $index_id ) ) {
			$result['error'] = 'Index ID is not configured.';
			return $result;
		}

		try {
			// Get the current index configuration.
			$response       = $ingest_client->index()->getIndex( $index_id );
			$current_index  = $response['data'] ?? $response;
			$current_fields = $current_index['fields'] ?? array();

			// Check if documents exist in the index.
			$stats          = $this->searchcraft_get_index_stats();
			$document_count = isset( $stats['document_count'] ) ? (int) $stats['document_count'] : 0;

			// Start with current fields.
			$updated_fields = $current_fields;

			// Add 'type' field if custom post types are selected.
			if ( ! empty( $selected_custom_post_types ) ) {
				$updated_fields['type'] = array(
					'type'     => 'facet',
					'stored'   => true,
					'indexed'  => true,
					'required' => false,
					'multi'    => false,
				);
			} else {
				// Remove 'type' field if no custom post types are selected.
				unset( $updated_fields['type'] );
			}

			// Get all custom field names that are currently in the schema.
			// We'll track these to remove fields that are no longer needed.
			$all_custom_field_names = array();

			// Add custom fields for each post type with fields enabled.
			foreach ( $custom_post_types_with_fields as $post_type ) {
				$meta_keys = Searchcraft_Helper_Functions::searchcraft_get_meta_keys_for_post_type( $post_type );

				foreach ( $meta_keys as $meta_key => $meta_info ) {
					$sample_value = $meta_info['sample'] ?? '';
					$field_type   = Searchcraft_Helper_Functions::searchcraft_detect_field_type( $sample_value );

					// Get default field options for this type.
					$field_options = Searchcraft_Helper_Functions::searchcraft_get_default_field_options( $field_type );

					// Add the field to the schema.
					$updated_fields[ $meta_key ] = array_merge(
						array( 'type' => $field_type ),
						$field_options
					);

					// Track this custom field name.
					$all_custom_field_names[] = $meta_key;
				}
			}

			// Remove custom fields that are no longer in any selected post type.
			// We need to identify fields that were previously added as custom fields but are no longer needed.
			// Use the previous values passed as parameter (from before the options were updated).
			if ( ! is_array( $previous_custom_post_types_with_fields ) ) {
				$previous_custom_post_types_with_fields = array();
			}

			$previous_custom_field_names = array();
			foreach ( $previous_custom_post_types_with_fields as $post_type ) {
				$meta_keys = Searchcraft_Helper_Functions::searchcraft_get_meta_keys_for_post_type( $post_type );
				foreach ( $meta_keys as $meta_key => $meta_info ) {
					$previous_custom_field_names[] = $meta_key;
				}
			}

			// Remove fields that were in previous selection but not in current selection.
			$fields_to_remove = array_diff( $previous_custom_field_names, $all_custom_field_names );
			foreach ( $fields_to_remove as $field_name ) {
				unset( $updated_fields[ $field_name ] );
			}

			// Check if fields actually changed.
			if ( serialize( $current_fields ) === serialize( $updated_fields ) ) { // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
				$result['success'] = true;
				return $result;
			}

			// Update the index with new fields.
			// Start with the current index configuration and only update the fields.
			// This preserves all other index properties (language, search_fields, weight_multipliers, etc.)
			// without having to explicitly list them, making this future-proof.
			$update_payload           = $current_index;
			$update_payload['fields'] = $updated_fields;

			$ingest_client->index()->updateIndex( $index_id, $update_payload );

			// If documents exist, re-index them to include the new custom post type data.
			if ( $document_count > 0 ) {
				try {
					$this->searchcraft_add_all_documents();
					$result['reindexed'] = true;
				} catch ( \Exception $e ) {
					// Index schema was updated but re-indexing failed.
					$result['success'] = true;
					$result['error']   = 'Index schema updated, but re-indexing failed: ' . $e->getMessage();
					Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Re-indexing failed after schema update: ' . $e->getMessage() );
					return $result;
				}
			}

			$result['success'] = true;
		} catch ( \Exception $e ) {
			$result['error'] = $e->getMessage();
			Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Failed to update index schema for custom post types: ' . $e->getMessage() );
		}

		return $result;
	}

	/**
	 * Retrieves the read and ingest API keys from the client.
	 *
	 * @since 1.0.0
	 */
	public function searchcraft_get_keys() {
		// First, try to get existing stored keys.
		$stored_read_key   = Searchcraft_Config::get_read_key();
		$stored_ingest_key = Searchcraft_Config::get_ingest_key();

		$keys = array(
			'read'   => ! empty( $stored_read_key ) ? $stored_read_key : null,
			'ingest' => ! empty( $stored_ingest_key ) ? $stored_ingest_key : null,
		);

		return $keys;
	}

	/**
	 * Add documents to the index.
	 *
	 * Unified function that can handle both single WP_Post objects and arrays of WP_Post objects.
	 * Processes posts by creating properly formatted documents and submitting them to Searchcraft.
	 *
	 * @since 1.0.0
	 * @param WP_Post|array $posts A single WP_Post object or an array of WP_Post objects.
	 * @throws \Exception If the API request fails or document validation fails.
	 */
	public function searchcraft_add_documents( $posts ) {
		// Normalize input to always be an array.
		if ( ! is_array( $posts ) ) {
			$posts = array( $posts );
		}

		if ( empty( $posts ) ) {
			return;
		}

		$documents = array();

		// Build documents array.
		foreach ( $posts as $post ) {
			// Skip invalid posts.
			if ( ! is_object( $post ) || ! isset( $post->ID ) ) {
				continue;
			}

			// Skip posts that are excluded from indexing.
			$exclude_from_index = get_post_meta( $post->ID, '_searchcraft_exclude_from_index', true );
			if ( '1' === $exclude_from_index ) {
				continue;
			}

			// Get the featured image URL.
			$featured_image_url = '';
			$featured_image_id  = get_post_thumbnail_id( $post->ID );
			if ( $featured_image_id ) {
				$featured_image_url = wp_get_attachment_image_url( $featured_image_id, 'full' );
			}

			// Clean the post content by removing HTML tags, comments, shortcodes, and newlines.
			$clean_content = $post->post_content;
			$clean_content = preg_replace( '/<!--.*?-->/s', '', $clean_content ); // Remove HTML comments.
			$clean_content = wp_strip_all_tags( $clean_content ); // Remove all HTML tags.
			$clean_content = strip_shortcodes( $clean_content ); // Remove all shortcodes.
			$clean_content = preg_replace( '/\r\n|\r|\n/', ' ', $clean_content ); // Remove newline characters.
			$clean_content = preg_replace( '/\s+/', ' ', $clean_content ); // Collapse multiple spaces into single spaces.
			$clean_content = trim( $clean_content ); // Remove extra whitespace.

			// Get categories as RESTful paths.
			$categories      = array();
			$post_categories = get_the_category( $post->ID );
			if ( ! empty( $post_categories ) ) {
				foreach ( $post_categories as $category ) {
					// Build category path including parent categories.
					$category_path = $this->searchcraft_get_term_path( $category, 'category' );
					if ( ! empty( $category_path ) ) {
						$categories[] = $category_path;
					}
				}
			}

			// Get tags as tag names.
			$tags      = array();
			$post_tags = get_the_tags( $post->ID );
			if ( ! empty( $post_tags ) ) {
				foreach ( $post_tags as $tag ) {
					$tags[] = $tag->name;
				}
			}

			// Get selected filter taxonomies.
			$selected_taxonomies = get_option( 'searchcraft_filter_taxonomies', array( 'category' ) );
			if ( ! is_array( $selected_taxonomies ) ) {
				$selected_taxonomies = array( 'category' );
			}

			// Build taxonomy data for selected taxonomies as RESTful paths.
			$taxonomy_data = array();
			foreach ( $selected_taxonomies as $taxonomy_name ) {
				// Skip category as it's already handled above.
				if ( 'category' === $taxonomy_name ) {
					continue;
				}

				$terms = get_the_terms( $post->ID, $taxonomy_name );
				if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
					$taxonomy_data[ $taxonomy_name ] = array();
					foreach ( $terms as $term ) {
						// Build term path including parent terms.
						$term_path = $this->searchcraft_get_term_path( $term, $taxonomy_name );
						if ( ! empty( $term_path ) ) {
							$taxonomy_data[ $taxonomy_name ][] = $term_path;
						}
					}
				}
			}

			// Get author ID and name.
			$author_ids   = array( (string) $post->post_author );
			$author_names = array( get_the_author_meta( 'display_name', $post->post_author ) );

			// Check if PublishPress Authors is enabled and available.
			$use_publishpress_authors = (bool) get_option( 'searchcraft_use_publishpress_authors', false );
			if ( true === $use_publishpress_authors && defined( 'PP_AUTHORS_VERSION' ) ) {
				$authors = get_multiple_authors( $post );
				if ( ! empty( $authors ) && is_array( $authors ) ) {
					// Use all authors from PublishPress Authors.
					$author_ids   = array();
					$author_names = array();
					foreach ( $authors as $author ) {
						if ( isset( $author->term_id ) && isset( $author->display_name ) ) {
							$author_ids[]   = (string) $author->term_id;
							$author_names[] = $author->display_name;
						}
					}
				}
			}

			// Get primary category name (the one used in permalinks).
			$primary_category_name = '';
			$primary_category      = null;

			// Check if Yoast SEO primary category is set.
			if ( class_exists( 'WPSEO_Primary_Term' ) ) {
				$wpseo_primary_term = new WPSEO_Primary_Term( 'category', $post->ID );
				$primary_term_id    = $wpseo_primary_term->get_primary_term();
				if ( $primary_term_id ) {
					$primary_category = get_term( $primary_term_id );
				}
			}

			// Fallback to WordPress default (first category by term order).
			if ( ! $primary_category ) {
				$categories_wp = get_the_category( $post->ID );
				if ( ! empty( $categories_wp ) ) {
					$primary_category = $categories_wp[0];
				}
			}

			if ( $primary_category && ! is_wp_error( $primary_category ) ) {
				$primary_category_name = $primary_category->name;
			}

			// Get Yoast SEO keyphrase if available.
			$yoast_keyphrase = '';
			if ( class_exists( 'WPSEO_Meta' ) ) {
				$yoast_keyphrase = WPSEO_Meta::get_value( 'focuskw', $post->ID );
			}

			// Create document.
			$document = array(
				'id'                    => (string) $post->ID,
				'type'                  => '/' . $post->post_type,
				'post_title'            => $post->post_title,
				'post_excerpt'          => get_the_excerpt( $post ),
				'post_content'          => $clean_content,
				'post_author_id'        => $author_ids,
				'post_author_name'      => $author_names,
				'post_date'             => gmdate( 'c', strtotime( $post->post_date ) ), // Convert to ISO 8601 format.
				'primary_category_name' => $primary_category_name,
				'keyphrase'             => $yoast_keyphrase,
				'permalink'             => get_permalink( $post->ID ),
				'featured_image_url'    => $featured_image_url,
				'categories'            => $categories,
				'tags'                  => $tags,
			);

			// Add custom taxonomy data to the document.
			if ( ! empty( $taxonomy_data ) ) {
				foreach ( $taxonomy_data as $taxonomy_name => $terms ) {
					$document[ $taxonomy_name ] = $terms;
				}
			}

			// Add custom fields if this post type has custom fields enabled.
			$custom_post_types_with_fields = get_option( 'searchcraft_custom_post_types_with_fields', array() );
			if ( ! is_array( $custom_post_types_with_fields ) ) {
				$custom_post_types_with_fields = array();
			}

			if ( in_array( $post->post_type, $custom_post_types_with_fields, true ) ) {
				// Get custom field definitions for this post type.
				$meta_keys = Searchcraft_Helper_Functions::searchcraft_get_meta_keys_for_post_type( $post->post_type );

				foreach ( $meta_keys as $meta_key => $meta_info ) {
					// Get the custom field value for this post.
					$meta_value = get_post_meta( $post->ID, $meta_key, true );

					// Skip if value is an array or object (we only handle scalar values).
					if ( is_array( $meta_value ) || is_object( $meta_value ) ) {
						continue;
					}

					// Only add the field if it has a value (omit if empty/null).
					if ( ! empty( $meta_value ) || '0' === $meta_value || 0 === $meta_value ) {
						// Detect the field type based on the sample value.
						$sample_value = $meta_info['sample'] ?? '';
						$field_type   = Searchcraft_Helper_Functions::searchcraft_detect_field_type( $sample_value );

						// Convert the actual meta value to the appropriate type.
						switch ( $field_type ) {
							case 'bool':
								// Convert to boolean.
								$truthy_vals = array( 'true', '1', 'yes', 'on' );
								$falsy_vals  = array( 'false', '0', 'no', 'off' );
								$lower_value = strtolower( trim( (string) $meta_value ) );

								if ( in_array( $lower_value, $truthy_vals, true ) ) {
									$document[ $meta_key ] = true;
								} elseif ( in_array( $lower_value, $falsy_vals, true ) ) {
									$document[ $meta_key ] = false;
								}
								break;

							case 'i64':
							case 'u64':
								// Convert to integer.
								if ( is_numeric( $meta_value ) ) {
									$document[ $meta_key ] = (int) $meta_value;
								} else {
									// Log warning if value is not numeric but field type is integer.
									Searchcraft_Helper_Functions::searchcraft_error_log(
										sprintf(
											'Searchcraft: Custom field "%s" for post ID %d has non-numeric value "%s" but is expected to be %s. Skipping field.',
											$meta_key,
											$post->ID,
											$meta_value,
											$field_type
										)
									);
								}
								break;

							case 'f64':
								// Convert to float.
								if ( is_numeric( $meta_value ) ) {
									$document[ $meta_key ] = (float) $meta_value;
								} else {
									// Log warning if value is not numeric but field type is f64.
									Searchcraft_Helper_Functions::searchcraft_error_log(
										sprintf(
											'Searchcraft: Custom field "%s" for post ID %d has non-numeric value "%s" but is expected to be f64. Skipping field.',
											$meta_key,
											$post->ID,
											$meta_value
										)
									);
								}
								break;

							case 'datetime':
								// Keep as string in ISO 8601 format.
								// If it's already a valid datetime, use it; otherwise try to convert.
								if ( Searchcraft_Helper_Functions::searchcraft_is_valid_date_format( $meta_value ) ) {
									$document[ $meta_key ] = gmdate( 'c', strtotime( $meta_value ) );
								}
								break;

							default:
								// For text and other types, keep as string.
								$document[ $meta_key ] = (string) $meta_value;
								break;
						}
					}
				}
			}

			$documents[] = $document;
		}

		// Submit documents to the client if any are ready.
		if ( ! empty( $documents ) ) {
			$ingest_client = $this->searchcraft_get_ingest_client();
			if ( ! $ingest_client ) {
				Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Unable to get ingest client for adding documents.' );
				return;
			}

			try {
				$ingest_client->documents()->addDocuments( SEARCHCRAFT_INDEX_ID, $documents );
				$ingest_client->documents()->commitTransaction( SEARCHCRAFT_INDEX_ID );

				// Clear the index stats cache since document count has changed.
				delete_transient( 'searchcraft_index_stats' );

				// Log success with appropriate message.
				$count = count( $documents );
				if ( 1 === $count ) {
					$post_id = $documents[0]['id'];
					Searchcraft_Helper_Functions::searchcraft_error_log( "Searchcraft: Successfully added document with ID {$post_id} to index." );
				} else {
					Searchcraft_Helper_Functions::searchcraft_error_log( "Searchcraft: Successfully added {$count} documents to index." );
				}
			} catch ( \Exception $e ) {
				$count = count( $documents );
				if ( 1 === $count ) {
					$post_id = $documents[0]['id'];
					Searchcraft_Helper_Functions::searchcraft_error_log( "Searchcraft: Failed to add document with ID {$post_id}: " . $e->getMessage() );
				} else {
					Searchcraft_Helper_Functions::searchcraft_error_log( "Searchcraft: Failed to add {$count} documents: " . $e->getMessage() );
				}
				// Re-throw the exception so it can be caught by calling code.
				throw $e;
			} finally {
				// Free memory: unset large variables to help garbage collection.
				unset( $documents, $ingest_client );
			}
		}
	}

	/**
	 * Delete documents from the index based on specific field criteria.
	 *
	 * @since 1.0.0
	 * @param array $fields An array of field-based deletion filters.
	 */
	public function searchcraft_delete_documents_by_field( $fields ) {
		$ingest_client = $this->searchcraft_get_ingest_client();
		if ( ! $ingest_client ) {
			return;
		}

		$deleted_any = false;
		foreach ( $fields as $field ) {
			try {
				// Attempt to delete documents that match the field condition.
				$ingest_client->documents()->deleteDocumentsByField( SEARCHCRAFT_INDEX_ID, $field );
				$deleted_any = true;
			} catch ( \Exception $e ) {
				Searchcraft_Helper_Functions::searchcraft_error_log( $e );
			}
		}

		// Commit the transaction if any deletions were performed.
		if ( $deleted_any ) {
			try {
				$ingest_client->documents()->commitTransaction( SEARCHCRAFT_INDEX_ID );

				// Clear the index stats cache since document count has changed.
				delete_transient( 'searchcraft_index_stats' );
			} catch ( \Exception $e ) {
				Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Failed to commit deletion transaction: ' . $e->getMessage() );
			}
		}
	}

	/**
	 * Delete all documents from the index.
	 *
	 * @since 1.0.0
	 */
	public function searchcraft_delete_all_documents() {
		$ingest_client = $this->searchcraft_get_ingest_client();
		if ( ! $ingest_client ) {
			return;
		}

		try {
			// Attempt to delete all documents in the index.
			$ingest_client->documents()->deleteAllDocuments( SEARCHCRAFT_INDEX_ID );

			// Commit the transaction to make the changes visible.
			$ingest_client->documents()->commitTransaction( SEARCHCRAFT_INDEX_ID );

			// Clear the index stats cache since document count has changed.
			delete_transient( 'searchcraft_index_stats' );
		} catch ( \Exception $e ) {
			Searchcraft_Helper_Functions::searchcraft_error_log( $e );
		}
	}

	/**
	 * Add all eligible posts and pages to the index.
	 *
	 * Performs a full fetch of all published post types and filters
	 * out any that are marked with the `_searchcraft_exclude_from_index` meta field.
	 * It first removes existing documents from the index, then adds the refreshed ones
	 * in batches to handle large numbers of posts efficiently.
	 *
	 * Uses cursor-based pagination for optimal performance on large datasets.
	 *
	 * @since 1.0.0
	 */
	public function searchcraft_add_all_documents() {
		global $wpdb;

		// Get count of eligible posts using direct SQL for better performance.
		// This counts posts that are either not excluded or don't have the exclusion meta key.
		// Note, we replaced the previous WP_Query approach because this direct query is more efficient.
		$total_posts = $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			"SELECT COUNT(DISTINCT p.ID)
			 FROM {$wpdb->posts} p
			 LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
			     AND pm.meta_key = '_searchcraft_exclude_from_index'
			 WHERE p.post_status = 'publish'
			 AND (pm.meta_value != '1' OR pm.meta_value IS NULL)"
		);

		if ( 0 === $total_posts ) {
			return;
		}

		// Remove all existing documents from the index first.
		$this->searchcraft_delete_all_documents();

		// Define batch size.
		$batch_size = 4000;
		$batches    = ceil( $total_posts / $batch_size );
		$last_id    = 0;

		// Get selected custom post types.
		$selected_custom_post_types = get_option( 'searchcraft_custom_post_types', array() );
		if ( ! is_array( $selected_custom_post_types ) ) {
			$selected_custom_post_types = array();
		}

		// Build list of post types to index: default types + selected custom types.
		$post_types_to_index = array( 'post', 'page' );
		if ( ! empty( $selected_custom_post_types ) ) {
			$post_types_to_index = array_merge( $post_types_to_index, $selected_custom_post_types );
		}

		// Process posts in batches using cursor-based pagination.
		for ( $batch = 0; $batch < $batches; $batch++ ) {
			// Build query args for this batch.
			$query_args = array(
				'post_type'              => $post_types_to_index,
				'posts_per_page'         => $batch_size,
				'post_status'            => 'publish',
				'orderby'                => 'ID',
				'order'                  => 'ASC',
				'no_found_rows'          => true,  // Don't calculate total rows (performance optimization).
				'update_post_meta_cache' => false, // Don't prime meta cache (memory optimization).
				'update_post_term_cache' => false, // Don't prime term cache (memory optimization).
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'meta_query'             => array(
					'relation' => 'OR',
					// Include posts where the exclusion flag is not set to '1'.
					array(
						'key'     => '_searchcraft_exclude_from_index',
						'value'   => '1',
						'compare' => '!=',
					),
					// Or where the exclusion flag doesn't exist at all.
					array(
						'key'     => '_searchcraft_exclude_from_index',
						'compare' => 'NOT EXISTS',
					),
				),
			);

			// Use cursor-based pagination: only fetch posts with ID greater than the last processed ID.
			if ( $last_id > 0 ) {
				$query_args['post__not_in'] = range( 1, $last_id );
			}

			// Query posts for this batch.
			$batch_query = new WP_Query( $query_args );

			if ( $batch_query->have_posts() ) {
				$posts = $batch_query->posts;

				// Remember the last ID for cursor-based pagination.
				$last_id = end( $posts )->ID;

				// Add this batch of documents to the index.
				$this->searchcraft_add_documents( $posts );

				// Log progress.
				$processed = min( ( $batch + 1 ) * $batch_size, $total_posts );
				Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Processed batch ' . ( $batch + 1 ) . " of {$batches} ({$processed}/{$total_posts} posts)" );
			}

			// Aggressive memory cleanup between batches.
			wp_reset_postdata();
			unset( $batch_query, $posts, $query_args );

			// Flush WordPress object cache to prevent memory buildup.
			wp_cache_flush();

			// Force garbage collection to free memory immediately.
			if ( function_exists( 'gc_collect_cycles' ) ) {
				gc_collect_cycles();
			}
		}

		// Log completion.
		Searchcraft_Helper_Functions::searchcraft_error_log( "Searchcraft: Re-indexing completed. Processed {$total_posts} posts in {$batches} batch(es)." );
	}

	/**
	 * Handles the publishing of a post and adds the documents to the index.
	 *
	 * This is triggered after a post is inserted/updated, ensuring all meta data
	 * (including Yoast SEO) has been saved before indexing.
	 *
	 * @since 1.0.0
	 * @param int     $post_id    Post ID.
	 * @param WP_Post $post       Post object.
	 * @param bool    $update     Whether this is an existing post being updated.
	 * @param WP_Post $post_before Post object before the update.
	 */
	public function searchcraft_on_publish_post( $post_id, $post, $update, $post_before ) {
		// Only proceed if the post is published.
		if ( 'publish' !== $post->post_status ) {
			return;
		}

		// Only index public post types.
		$public_post_types = get_post_types( array( 'public' => true ) );

		if ( ! in_array( $post->post_type, $public_post_types, true ) ) {
			return;
		}

		// Check if the post is excluded from indexing.
		$exclude_from_index = get_post_meta( $post->ID, '_searchcraft_exclude_from_index', true );

		// If this is an update to an already published post, remove the existing document first.
		if ( $update && $post_before && 'publish' === $post_before->post_status ) {
			$this->searchcraft_remove_single_document( $post );
		}

		// If the post is excluded from indexing, don't add it back to the index.
		if ( '1' === $exclude_from_index ) {
			return;
		}

		// Add the document to Searchcraft index.
		$this->searchcraft_add_documents( $post );

		// Clear documents from the transient cache so they're re-fetched on the next request.
		delete_transient( 'searchcraft_documents' );
	}



	/**
	 * Handles the "un-publishing" of posts by removing them from the index.
	 *
	 * Triggered when a post transitions from 'publish' to any non-published status
	 * (e.g., draft, trash, private).
	 *
	 * @since 1.0.0
	 * @param string  $new_status The new status of the post (e.g., 'publish').
	 * @param string  $old_status The old status of the post (e.g., 'draft').
	 * @param WP_Post $post       The post object.
	 */
	public function searchcraft_on_unpublish_post( $new_status, $old_status, $post ) {
		// Only proceed if the post is being transitioned from 'publish'.
		if ( 'publish' === $new_status ) {
			return;
		}

		// Only proceed if the post was previously published.
		if ( 'publish' !== $old_status ) {
			return;
		}

		// Only handle public post types.
		$public_post_types = get_post_types( array( 'public' => true ) );
		if ( ! in_array( $post->post_type, $public_post_types, true ) ) {
			Searchcraft_Helper_Functions::searchcraft_error_log( "Searchcraft: Skipping - post type '{$post->post_type}' is not public (ID: {$post->ID})" );
			return;
		}

		// Remove the document from Searchcraft index.
		Searchcraft_Helper_Functions::searchcraft_error_log( "Searchcraft: Attempting to remove document from index (ID: {$post->ID})" );
		$this->searchcraft_remove_single_document( $post );
	}

	/**
	 * Remove a single document from the Searchcraft index.
	 *
	 * Removes the document with the specified post ID from the Searchcraft index.
	 *
	 * @since 1.0.0
	 * @param WP_Post $post The post object to remove from the index.
	 */
	public function searchcraft_remove_single_document( $post ) {
		// Get the ingest client.
		$ingest_client = $this->searchcraft_get_ingest_client();
		if ( ! $ingest_client ) {
			Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Unable to get ingest client for removing single document.' );
			return;
		}

		try {
			// Remove the document from the Searchcraft index by ID.
			$criteria = array(
				'id' => (string) $post->ID,
			);

			$ingest_client->documents()->deleteDocumentsByField( SEARCHCRAFT_INDEX_ID, $criteria );

			// Commit the transaction to make the changes visible.
			$ingest_client->documents()->commitTransaction( SEARCHCRAFT_INDEX_ID );

			// Clear the index stats cache since document count has changed.
			delete_transient( 'searchcraft_index_stats' );

			// Log successful removal.
			Searchcraft_Helper_Functions::searchcraft_error_log( "Searchcraft: Successfully removed document with ID {$post->ID} from index." );
		} catch ( \Exception $e ) {
			Searchcraft_Helper_Functions::searchcraft_error_log( "Searchcraft: Failed to remove document with ID {$post->ID}: " . $e->getMessage() );
		}
	}

	/**
	 * Handles saving of a post's custom Searchcraft-related meta..
	 *
	 * This runs after `transition_post_status`, and is responsible for updating
	 * the post meta.
	 *
	 * @since 1.0.0
	 * @param int $post_id The ID of the post being saved.
	 */
	public function searchcraft_on_save_post( $post_id ) {
		// Verify the nonce for security to prevent CSRF attacks.
		$nonce = isset( $_POST['searchcraft_exclude_from_searchcraft_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['searchcraft_exclude_from_searchcraft_nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'searchcraft_custom_meta_boxes' ) ) {
			return; // Return if the nonce is invalid or missing.
		}

		// Return if this is an autosave.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Return if we're saving a revision instead of the actual post.
		if ( wp_is_post_revision( $post_id ) ) {
			return;
		}

		// Update the exclusion flag based on checkbox value.
		// If the checkbox is checked, set to '1', else '0'.
		$exclude_from_index = isset( $_POST['searchcraft_exclude_from_index'] ) ? '1' : '0';
		update_post_meta( $post_id, '_searchcraft_exclude_from_index', $exclude_from_index );
	}

	/**
	 * Build a RESTful path for a given taxonomy term.
	 *
	 * Creates a path like "/parent/child" by traversing up the term hierarchy.
	 *
	 * @since 1.0.0
	 * @param WP_Term $term     The taxonomy term object.
	 * @param string  $taxonomy The taxonomy name (e.g., 'category', 'post_tag', custom taxonomies).
	 * @return string The RESTful term path.
	 */
	private function searchcraft_get_term_path( $term, $taxonomy ) {
		$path_parts   = array();
		$current_term = $term;

		// Traverse up the term hierarchy.
		while ( $current_term ) {
			// Add current term slug to the beginning of the path.
			array_unshift( $path_parts, $current_term->slug );

			// Get parent term if it exists.
			if ( $current_term->parent ) {
				$current_term = get_term( $current_term->parent, $taxonomy );
				// Check if get_term returned an error.
				if ( is_wp_error( $current_term ) ) {
					break;
				}
			} else {
				$current_term = null;
			}
		}

		// Build the RESTful path.
		return '/' . implode( '/', $path_parts );
	}
}
