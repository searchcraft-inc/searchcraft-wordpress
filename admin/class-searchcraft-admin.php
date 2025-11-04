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

		// Only run setup if we're in the admin area and not during plugin activation.
		if ( is_admin() && ! ( defined( 'WP_INSTALLING' ) && WP_INSTALLING ) ) {
			// Defer setup to avoid memory issues during activation.
			add_action( 'admin_init', array( $this, 'searchcraft_setup' ) );
		}

		// Clear oldest post year transient when posts are published/updated.
		add_action( 'publish_post', array( $this, 'clear_oldest_post_year_transient' ) );
		add_action( 'delete_post', array( $this, 'clear_oldest_post_year_transient' ) );
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
				case 'search_experience_config':
					$this->searchcraft_on_search_experience_config_request( $_POST ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					break;
				case 'search_results_config':
					$this->searchcraft_on_search_results_config_request( $_POST ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
					break;
				case 'advanced_config':
					$this->searchcraft_on_advanced_config_request( $_POST ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
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

				// Save taxonomy filter selections.
				$filter_taxonomies = isset( $_POST['searchcraft_filter_taxonomies'] ) && is_array( $_POST['searchcraft_filter_taxonomies'] ) // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified in searchcraft_request_handler().
					? array_map( 'sanitize_text_field', wp_unslash( $_POST['searchcraft_filter_taxonomies'] ) ) // phpcs:ignore WordPress.Security.NonceVerification.Missing
					: array();

				// Always include category in the filter taxonomies.
				if ( ! in_array( 'category', $filter_taxonomies, true ) ) {
					$filter_taxonomies[] = 'category';
				}

				update_option( 'searchcraft_filter_taxonomies', $filter_taxonomies );

				// Check if taxonomies have changed and need index update.
				// We need to update if taxonomies changed, regardless of whether we're adding or removing them.
				$taxonomies_changed = ( serialize( $previous_taxonomies ) !== serialize( $filter_taxonomies ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
				$needs_index_update = $taxonomies_changed;

				if ( $success ) {
					// Clear cached data since configuration has changed.
					delete_transient( 'searchcraft_index_stats' );
					delete_transient( 'searchcraft_index' );
					// Update index schema if taxonomies changed.
					if ( $needs_index_update ) {
						$index_update_result = $this->searchcraft_update_index_schema( $filter_taxonomies );

						if ( $index_update_result['success'] ) {
							$message = 'Configuration saved successfully.';
							if ( $index_update_result['reindexed'] ) {
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
							$error_message = $index_update_result['error'];
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
	 * Handles the search experience configuration request.
	 *
	 * @since 1.0.0
	 * @param array $request The $_POST request from the form submission.
	 */
	private function searchcraft_on_search_experience_config_request( $request ) {
		// Ensure request is an array.
		if ( ! is_array( $request ) ) {
			return;
		}

		$updated_settings = array();

		// Handle search experience type.
		if ( isset( $request['searchcraft_search_experience'] ) ) {
			$experience = sanitize_text_field( wp_unslash( $request['searchcraft_search_experience'] ) );

			// Validate the experience value.
			$valid_experiences = array( 'full', 'popover' );
			if ( ! in_array( $experience, $valid_experiences, true ) ) {
				$experience = 'full';
			}

			// Save the setting.
			update_option( 'searchcraft_search_experience', $experience );
			$updated_settings['experience'] = $experience;
		}

		// Handle search placeholder text.
		if ( isset( $request['searchcraft_search_placeholder'] ) ) {
			$placeholder = sanitize_text_field( wp_unslash( $request['searchcraft_search_placeholder'] ) );

			// Use default if empty.
			if ( empty( $placeholder ) ) {
				$placeholder = 'Search...';
			}

			// Save the setting.
			update_option( 'searchcraft_search_placeholder', $placeholder );
			$updated_settings['placeholder'] = $placeholder;
		}

		// Handle popover container ID.
		if ( isset( $request['searchcraft_popover_container_id'] ) ) {
			$container_id = sanitize_text_field( wp_unslash( $request['searchcraft_popover_container_id'] ) );

			// Remove any invalid characters for HTML IDs.
			$container_id = preg_replace( '/[^a-zA-Z0-9_-]/', '', $container_id );

			// Save the setting.
			update_option( 'searchcraft_popover_container_id', $container_id );
			$updated_settings['popover_container_id'] = $container_id;
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

			// Use default if zero or empty.
			if ( 0 === $padding && empty( $request['searchcraft_input_padding'] ) ) {
				$padding = 50;
			}

			// Save the setting.
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

			// Default is 0, so no need to override empty values.

			// Save the setting.
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

		// Handle input width.
		if ( isset( $request['searchcraft_input_width'] ) ) {
			$input_width = absint( wp_unslash( $request['searchcraft_input_width'] ) );

			// Validate range (1-100%).
			if ( $input_width < 1 ) {
				$input_width = 1;
			} elseif ( $input_width > 100 ) {
				$input_width = 100;
			}

			// Save the setting.
			update_option( 'searchcraft_input_width', $input_width );
			$updated_settings['input_width'] = $input_width;
		}

		// Show success message.
		add_action(
			'admin_notices',
			function () use ( $updated_settings ) {
				$messages = array();

				if ( isset( $updated_settings['experience'] ) ) {
					$experience_labels = array(
						'full'    => 'Full Experience',
						'popover' => 'Popover',
					);
					$label             = $experience_labels[ $updated_settings['experience'] ] ?? $updated_settings['experience'];
					$messages[]        = 'Search experience: ' . $label;
				}

				if ( isset( $updated_settings['placeholder'] ) ) {
					$messages[] = 'Search placeholder: ' . $updated_settings['placeholder'];
				}

				if ( isset( $updated_settings['padding'] ) ) {
					$messages[] = 'Input component horizontal padding: ' . $updated_settings['padding'] . 'px';
				}

				if ( isset( $updated_settings['vertical_padding'] ) ) {
					$messages[] = 'Input component vertical padding: ' . $updated_settings['vertical_padding'] . 'px';
				}

				if ( isset( $updated_settings['border_radius'] ) ) {
					$messages[] = 'Input border radius: ' . $updated_settings['border_radius'];
				}

				if ( isset( $updated_settings['input_width'] ) ) {
					$messages[] = 'Input width: ' . $updated_settings['input_width'] . '%';
				}

				if ( ! empty( $messages ) ) {
					echo '<div class="notice notice-success is-dismissible">';
					echo '<p><strong>Success:</strong> Search experience settings updated.</p>';
					echo '<ul>';
					foreach ( $messages as $message ) {
						echo '<li>' . esc_html( $message ) . '</li>';
					}
					echo '</ul>';
					echo '</div>';
				}
			}
		);
	}

	/**
	 * Handles the search results configuration request.
	 *
	 * @since 1.0.0
	 * @param array $request The $_POST request from the form submission.
	 */
	private function searchcraft_on_search_results_config_request( $request ) {
		// Ensure request is an array.
		if ( ! is_array( $request ) ) {
			return;
		}

		$updated_settings = array();

		// Handle AI summary setting.
		$enable_ai_summary = isset( $request['searchcraft_enable_ai_summary'] ) ? true : false;
		update_option( 'searchcraft_enable_ai_summary', $enable_ai_summary );
		$updated_settings['ai_summary'] = $enable_ai_summary ? 'enabled' : 'disabled';

		// Handle AI summary banner text.
		if ( isset( $request['searchcraft_ai_summary_banner'] ) ) {
			$ai_summary_banner = sanitize_text_field( wp_unslash( $request['searchcraft_ai_summary_banner'] ) );
			update_option( 'searchcraft_ai_summary_banner', $ai_summary_banner );
			$updated_settings['ai_summary_banner'] = $ai_summary_banner;
		}

		// Handle filter panel setting.
		$include_filter_panel = isset( $request['searchcraft_include_filter_panel'] ) ? true : false;
		update_option( 'searchcraft_include_filter_panel', $include_filter_panel );
		$updated_settings['filter_panel'] = $include_filter_panel ? 'enabled' : 'disabled';

		// Handle filter panel toggle settings.
		$enable_most_recent_toggle = isset( $request['searchcraft_enable_most_recent_toggle'] ) ? '1' : '0';
		update_option( 'searchcraft_enable_most_recent_toggle', $enable_most_recent_toggle );
		$updated_settings['enable_most_recent_toggle'] = '1' === $enable_most_recent_toggle ? 'enabled' : 'disabled';

		$enable_exact_match_toggle = isset( $request['searchcraft_enable_exact_match_toggle'] ) ? '1' : '0';
		update_option( 'searchcraft_enable_exact_match_toggle', $enable_exact_match_toggle );
		$updated_settings['enable_exact_match_toggle'] = '1' === $enable_exact_match_toggle ? 'enabled' : 'disabled';

		$enable_date_range = isset( $request['searchcraft_enable_date_range'] ) ? '1' : '0';
		update_option( 'searchcraft_enable_date_range', $enable_date_range );
		$updated_settings['enable_date_range'] = '1' === $enable_date_range ? 'enabled' : 'disabled';

		$enable_facets = isset( $request['searchcraft_enable_facets'] ) ? '1' : '0';
		update_option( 'searchcraft_enable_facets', $enable_facets );
		$updated_settings['enable_facets'] = '1' === $enable_facets ? 'enabled' : 'disabled';

		// Handle results per page setting.
		if ( isset( $request['searchcraft_results_per_page'] ) ) {
			$results_per_page = absint( wp_unslash( $request['searchcraft_results_per_page'] ) );

			// Validate the results per page value (between 1 and 100).
			if ( $results_per_page < 1 ) {
				$results_per_page = 1;
			} elseif ( $results_per_page > 100 ) {
				$results_per_page = 100;
			}

			// Save the setting.
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

			// Save the setting.
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

			// Save the setting.
			update_option( 'searchcraft_image_alignment', $image_alignment );
			$updated_settings['image_alignment'] = $image_alignment;
		}

		// Handle display post date setting.
		$display_post_date = isset( $request['searchcraft_display_post_date'] ) ? true : false;
		update_option( 'searchcraft_display_post_date', $display_post_date );
		$updated_settings['display_post_date'] = $display_post_date ? 'enabled' : 'disabled';

		// Handle display primary category setting.
		$display_primary_category = isset( $request['searchcraft_display_primary_category'] ) ? '1' : '0';
		update_option( 'searchcraft_display_primary_category', $display_primary_category );
		$updated_settings['display_primary_category'] = '1' === $display_primary_category ? 'enabled' : 'disabled';

		// Handle brand color setting.
		if ( isset( $request['searchcraft_brand_color'] ) ) {
			$brand_color = sanitize_text_field( wp_unslash( $request['searchcraft_brand_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $brand_color ) ) {
				$brand_color = '#000000'; // Default to black if invalid.
			}

			// Save the setting.
			update_option( 'searchcraft_brand_color', $brand_color );
			$updated_settings['brand_color'] = $brand_color;
		}

		// Handle summary background color setting.
		if ( isset( $request['searchcraft_summary_background_color'] ) ) {
			$summary_background_color = sanitize_text_field( wp_unslash( $request['searchcraft_summary_background_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $summary_background_color ) ) {
				$summary_background_color = '#F5F5F5'; // Default to light grey if invalid.
			}

			// Save the setting.
			update_option( 'searchcraft_summary_background_color', $summary_background_color );
			$updated_settings['summary_background_color'] = $summary_background_color;
		}

		// Handle summary border color setting.
		if ( isset( $request['searchcraft_summary_border_color'] ) ) {
			$summary_border_color = sanitize_text_field( wp_unslash( $request['searchcraft_summary_border_color'] ) );

			// Validate hex color format.
			if ( ! preg_match( '/^#[a-fA-F0-9]{6}$/', $summary_border_color ) ) {
				$summary_border_color = '#E0E0E0'; // Default to light grey if invalid.
			}

			// Save the setting.
			update_option( 'searchcraft_summary_border_color', $summary_border_color );
			$updated_settings['summary_border_color'] = $summary_border_color;
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

			// Save the setting.
			update_option( 'searchcraft_summary_box_border_radius', $summary_box_border_radius );
			$updated_settings['summary_box_border_radius'] = $summary_box_border_radius;
		}

		// Display success message.
		add_action(
			'admin_notices',
			function () use ( $updated_settings ) {
				$messages = array();

				if ( isset( $updated_settings['ai_summary'] ) ) {
					$messages[] = sprintf( 'AI summary %s', $updated_settings['ai_summary'] );
				}

				if ( isset( $updated_settings['filter_panel'] ) ) {
					$messages[] = sprintf( 'Filter panel %s', $updated_settings['filter_panel'] );
				}

				if ( isset( $updated_settings['results_per_page'] ) ) {
					$messages[] = sprintf( 'Results per page set to %d', $updated_settings['results_per_page'] );
				}

				if ( isset( $updated_settings['result_orientation'] ) ) {
					$messages[] = sprintf( 'Result orientation set to %s', $updated_settings['result_orientation'] );
				}

				if ( isset( $updated_settings['image_alignment'] ) ) {
					$messages[] = sprintf( 'Image alignment set to %s', $updated_settings['image_alignment'] );
				}

				if ( isset( $updated_settings['display_post_date'] ) ) {
					$messages[] = sprintf( 'Display post date %s', $updated_settings['display_post_date'] );
				}

				if ( isset( $updated_settings['display_primary_category'] ) ) {
					$messages[] = sprintf( 'Display primary category %s', $updated_settings['display_primary_category'] );
				}

				if ( isset( $updated_settings['brand_color'] ) ) {
					$messages[] = sprintf( 'Brand color set to %s', $updated_settings['brand_color'] );
				}

				if ( isset( $updated_settings['summary_background_color'] ) ) {
					$messages[] = sprintf( 'Summary background color set to %s', $updated_settings['summary_background_color'] );
				}

				if ( isset( $updated_settings['summary_border_color'] ) ) {
					$messages[] = sprintf( 'Summary border color set to %s', $updated_settings['summary_border_color'] );
				}

				if ( ! empty( $messages ) ) {
					echo '<div class="notice notice-success is-dismissible">';
					echo '<p><strong>Success:</strong> Search results settings updated.</p>';
					echo '<ul>';
					foreach ( $messages as $message ) {
						echo '<li>' . esc_html( $message ) . '</li>';
					}
					echo '</ul>';
					echo '</div>';
				}
			}
		);
	}

	/**
	 * Handles the advanced configuration request.
	 *
	 * @since 1.0.0
	 * @param array $request The $_POST request from the form submission.
	 */
	private function searchcraft_on_advanced_config_request( $request ) {
		// Ensure request is an array.
		if ( ! is_array( $request ) ) {
			return;
		}

		$updated_settings = array();

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

		// Handle results container ID setting.
		if ( isset( $request['searchcraft_results_container_id'] ) ) {
			$results_container_id = sanitize_text_field( wp_unslash( $request['searchcraft_results_container_id'] ) );
			// Remove any invalid characters for HTML IDs.
			$results_container_id = preg_replace( '/[^a-zA-Z0-9_-]/', '', $results_container_id );
			update_option( 'searchcraft_results_container_id', $results_container_id );
			$updated_settings['results_container_id'] = true;
		}

		// Handle popover container ID setting.
		if ( isset( $request['searchcraft_popover_container_id'] ) ) {
			$popover_container_id = sanitize_text_field( wp_unslash( $request['searchcraft_popover_container_id'] ) );

			$popover_container_id = preg_replace( '/[^a-zA-Z0-9_-]/', '', $popover_container_id );
			update_option( 'searchcraft_popover_container_id', $popover_container_id );
			$updated_settings['popover_container_id'] = true;
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
			$updated_settings['popover_element_behavior'] = true;
		}

		// Display success message.
		add_action(
			'admin_notices',
			function () use ( $updated_settings ) {
				$messages = array();

				if ( isset( $updated_settings['custom_css'] ) ) {
					$messages[] = 'Custom CSS updated';
				}

				if ( isset( $updated_settings['result_template'] ) ) {
					$messages[] = 'Result template callback function updated';
				}

				if ( isset( $updated_settings['results_container_id'] ) ) {
					$messages[] = 'Results container element ID updated';
				}

				if ( isset( $updated_settings['popover_container_id'] ) ) {
					$messages[] = 'Popover container element ID updated';
				}

				if ( ! empty( $messages ) ) {
					echo '<div class="notice notice-success is-dismissible">';
					echo '<p><strong>Success:</strong> Advanced settings updated.</p>';
					echo '<ul>';
					foreach ( $messages as $message ) {
						echo '<li>' . esc_html( $message ) .'</li>';
					}
					echo '</ul>';
					echo '</div>';
				}
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
				if ( isset( $all_taxonomies[ $field_name ] ) &&
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
			$update_payload = array(
				'fields' => $updated_fields,
			);

			// Preserve other important index settings.
			if ( isset( $current_index['language'] ) ) {
				$update_payload['language'] = $current_index['language'];
			}
			if ( isset( $current_index['search_fields'] ) ) {
				$update_payload['search_fields'] = $current_index['search_fields'];
			}
			if ( isset( $current_index['weight_multipliers'] ) ) {
				$update_payload['weight_multipliers'] = $current_index['weight_multipliers'];
			}

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

			// Get author name.
			$author_name = get_the_author_meta( 'display_name', $post->post_author );

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
				'post_title'            => $post->post_title,
				'post_excerpt'          => get_the_excerpt( $post ),
				'post_content'          => $clean_content,
				'post_author_id'        => (string) $post->post_author,
				'post_author_name'      => $author_name,
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
	 * @since 1.0.0
	 */
	public function searchcraft_add_all_documents() {
		// First, get a count of all eligible posts to determine if batching is needed.
		$count_query = new WP_Query(
			array(
				'post_type'      => 'any',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'meta_query'     => array(
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
			)
		);

		$total_posts = $count_query->found_posts;

		if ( 0 === $total_posts ) {
			return;
		}

		// Remove all existing documents from the index first.
		$this->searchcraft_delete_all_documents();

		// Define batch size.
		$batch_size = 50000;
		$batches    = ceil( $total_posts / $batch_size );

		// Process posts in batches.
		for ( $batch = 0; $batch < $batches; $batch++ ) {
			$offset = $batch * $batch_size;

			// Query posts for this batch.
			$batch_query = new WP_Query(
				array(
					'post_type'      => 'any',
					'posts_per_page' => $batch_size,
					'offset'         => $offset,
					'post_status'    => 'publish',
					// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'meta_query'     => array(
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
				)
			);

			if ( $batch_query->have_posts() ) {
				// Add this batch of documents to the index.
				$this->searchcraft_add_documents( $batch_query->posts );

				// Log progress.
				$processed = min( ( $batch + 1 ) * $batch_size, $total_posts );
				Searchcraft_Helper_Functions::searchcraft_error_log( 'Searchcraft: Processed batch ' . ( $batch + 1 ) . " of {$batches} ({$processed}/{$total_posts} posts)" );
			}

			// Clean up memory.
			wp_reset_postdata();
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
