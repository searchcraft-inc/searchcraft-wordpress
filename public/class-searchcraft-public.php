<?php
/**
 * The file that defines the public-facing functionality of the plugin
 *
 * A class definition that includes attributes and functions used for
 * defining the public-facing functionality of the plugin.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/public
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The public-facing functionality of the plugin
 *
 * Handles all frontend functionality including SDK integration,
 * template injection, search form replacement, and search template overrides.
 *
 * @since      1.0.0
 * @package    Searchcraft
 * @subpackage Searchcraft/public
 * @author     Searchcraft, Inc.
 */
class Searchcraft_Public {
	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $plugin_name       The name of the plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version     = $version;

		// Initialize all hooks.
		$this->init_hooks();
	}

	/**
	 * Initialize all WordPress hooks for frontend functionality.
	 *
	 * @since 1.0.0
	 */
	private function init_hooks() {
		// Only initialize frontend features if SDK is ready.
		if ( ! $this->is_sdk_ready() ) {
			return;
		}

		// Enqueue SDK assets early to ensure they're available for other scripts.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_sdk_assets' ), 1 );

		// Enqueue search header injection script after SDK assets.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_sdk_settings' ), 2 );

		// Replace search forms.
		add_filter( 'get_search_form', array( $this, 'replace_search_form' ) );

		// Intercept search results page and load blank template.
		add_filter( 'template_include', array( $this, 'override_search_template' ) );
	}

	/**
	 * Check if Searchcraft is properly configured for SDK integration.
	 *
	 * @since 1.0.0
	 * @return bool True if configured, false otherwise.
	 */
	public function is_sdk_ready() {
		// First check if the basic configuration is available.
		if ( ! Searchcraft_Config::is_configured() ) {
			return false;
		}

		$config = Searchcraft_Config::get_all();

		// Validate all required fields are present and not empty.
		$required_fields = array( 'endpoint_url', 'index_id', 'read_key' );

		foreach ( $required_fields as $field ) {
			if ( empty( $config[ $field ] ) ) {
				return false;
			}
		}

		// Validate endpoint URL format.
		if ( ! filter_var( $config['endpoint_url'], FILTER_VALIDATE_URL ) ) {
			return false;
		}

		// Validate read key format (should be a non-empty string).
		if ( ! is_string( $config['read_key'] ) || strlen( $config['read_key'] ) < 10 ) {
			return false;
		}

		// Validate index ID format (should be a non-empty string).
		if ( ! is_string( $config['index_id'] ) || strlen( $config['index_id'] ) < 1 ) {
			return false;
		}

		return true;
	}

	/**
	 * Get configuration validation errors.
	 *
	 * @since 1.0.0
	 * @return array Array of validation error messages.
	 */
	public function get_config_validation_errors() {
		$errors = array();

		if ( ! Searchcraft_Config::is_configured() ) {
			$errors[] = __( 'Searchcraft is not configured. Please configure your API keys and settings.', 'searchcraft' );
			return $errors;
		}

		$config = Searchcraft_Config::get_all();

		// Check endpoint URL.
		if ( empty( $config['endpoint_url'] ) ) {
			$errors[] = __( 'Endpoint URL is required for SDK integration.', 'searchcraft' );
		} elseif ( ! filter_var( $config['endpoint_url'], FILTER_VALIDATE_URL ) ) {
			$errors[] = __( 'Endpoint URL must be a valid URL.', 'searchcraft' );
		}

		// Check read key.
		if ( empty( $config['read_key'] ) ) {
			$errors[] = __( 'Read key is required for SDK integration.', 'searchcraft' );
		} elseif ( strlen( $config['read_key'] ) < 10 ) {
			$errors[] = __( 'Read key appears to be invalid (too short).', 'searchcraft' );
		}

		// Check index ID.
		if ( empty( $config['index_id'] ) ) {
			$errors[] = __( 'Index ID is required for SDK integration.', 'searchcraft' );
		}

		return $errors;
	}

	/**
	 * Enqueue search scripts and localize data.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_sdk_settings() {
		// Enqueue the search settings script with dependency on SDK integration.
		// This ensures the Searchcraft instance is created before templates are injected.
		wp_enqueue_script(
			'searchcraft-sdk-settings',
			plugin_dir_url( __FILE__ ) . 'js/searchcraft-sdk-settings.js',
			array( $this->plugin_name . '-sdk-integration' ),
			$this->version,
			true
		);

		// Prepare and localize script data.
		$script_data = $this->prepare_script_data();
		if ( $script_data ) {
			wp_localize_script( 'searchcraft-sdk-settings', 'searchcraftSettings', $script_data );
		}
	}

	/**
	 * Get the Searchcraft configuration for JavaScript.
	 *
	 * @since 1.0.0
	 * @return array Configuration array for the JavaScript SDK.
	 */
	public function get_js_config() {
		if ( ! $this->is_sdk_ready() ) {
			return array();
		}

		$config = Searchcraft_Config::get_all();

		$js_config = array(
			'indexName'   => $config['index_id'],
			'readKey'     => $config['read_key'],
			'endpointURL' => $config['endpoint_url'],
		);

		// Include search query if available.
		$search_query = get_search_query( true );
		if ( ! empty( $search_query ) ) {
			$js_config['searchQuery'] = $search_query;
		}

		// AI summary settings.
		$enable_ai_summary            = get_option( 'searchcraft_enable_ai_summary', false );
		$js_config['enableAiSummary'] = (bool) $enable_ai_summary;
		if ( $enable_ai_summary && ! empty( $config['cortex_url'] ) ) {
			$js_config['cortexURL'] = $config['cortex_url'];
		}
		$js_config['summaryBackgroundColor'] = get_option( 'searchcraft_summary_background_color', '#F5F5F5' );
		$js_config['summaryBoxBorderRadius'] = get_option( 'searchcraft_summary_box_border_radius', '' );

		// General result layout options.
		$js_config['brandColor'] = get_option( 'searchcraft_brand_color', '#000000' );
		$result_template         = get_option( 'searchcraft_result_template', '' );
		if ( ! empty( $result_template ) ) {
			$js_config['resultTemplateCallback'] = $result_template;
		}
		$js_config['orientation']            = get_option( 'searchcraft_result_orientation', 'column' );
		$js_config['displayPostDate']        = (bool) get_option( 'searchcraft_display_post_date', true );
		$js_config['displayPrimaryCategory'] = (bool) get_option( 'searchcraft_display_primary_category', true );
		$js_config['imageAlignment']         = get_option( 'searchcraft_image_alignment', 'left' );
		if ( 'grid' === $js_config['orientation'] ) {
			$js_config['imageAlignment'] = 'left';
		}

		// Filter panel settings.
		$js_config['includeFilterPanel']     = (bool) get_option( 'searchcraft_include_filter_panel', false );
		$js_config['enableMostRecentToggle'] = (bool) get_option( 'searchcraft_enable_most_recent_toggle', '1' );
		$js_config['enableExactMatchToggle'] = (bool) get_option( 'searchcraft_enable_exact_match_toggle', '1' );
		$js_config['enableDateRange']        = (bool) get_option( 'searchcraft_enable_date_range', '1' );
		$js_config['enableFacets']           = (bool) get_option( 'searchcraft_enable_facets', '1' );
		$js_config['hideUncategorized']      = (bool) get_option( 'searchcraft_hide_uncategorized', false );

		// Date slider options.
		$admin_instance              = new Searchcraft_Admin( 'searchcraft', SEARCHCRAFT_VERSION );
		$oldest_post_year            = $admin_instance->get_oldest_post_year();
		$js_config['oldestPostYear'] = $oldest_post_year;

		$js_config['resultsPerPage'] = intval( get_option( 'searchcraft_results_per_page', 10 ) );

		// Filter taxonomies.
		$filter_taxonomies = get_option( 'searchcraft_filter_taxonomies', array( 'category' ) );
		if ( ! is_array( $filter_taxonomies ) ) {
			$filter_taxonomies = array( 'category' );
		}
		// Get taxonomy labels for display.
		$taxonomy_config = array();
		foreach ( $filter_taxonomies as $taxonomy_name ) {
			$taxonomy_obj = get_taxonomy( $taxonomy_name );
			if ( $taxonomy_obj ) {
				$taxonomy_config[] = array(
					'name'  => $taxonomy_name,
					'label' => $taxonomy_obj->label,
				);
			}
		}
		// Sort taxonomies alphabetically by label.
		usort(
			$taxonomy_config,
			function ( $a, $b ) {
				return strcmp( $a['label'], $b['label'] );
			}
		);
		$js_config['filterTaxonomies'] = $taxonomy_config;
		$js_config['isWPSearchPage']   = (bool) is_search();
		return $js_config;
	}

	/**
	 * Prepare script data for JavaScript.
	 *
	 * @since 1.0.0
	 * @return array|false Script data array or false if templates not found.
	 */
	private function prepare_script_data() {
		$header_template_path  = plugin_dir_path( __FILE__ ) . 'templates/search-header.php';
		$results_template_path = plugin_dir_path( __FILE__ ) . 'templates/search-results.php';

		if ( ! file_exists( $header_template_path ) || ! file_exists( $results_template_path ) ) {
			return false;
		}

		// Get saved settings.
		$search_experience       = get_option( 'searchcraft_search_experience', 'full' );
		$search_behavior         = get_option( 'searchcraft_search_behavior', 'on_page' );
		$input_container_id      = get_option( 'searchcraft_search_input_container_id', '' );
		$results_container_id    = get_option( 'searchcraft_results_container_id', '' );
		$popover_container_id    = get_option( 'searchcraft_popover_container_id', '' );
		$popover_insert_behavior = get_option( 'searchcraft_popover_element_behavior', 'replace' );

		// Capture header template content.
		ob_start();
		include $header_template_path;
		$header_template_content = ob_get_clean();

		// Capture results template content.
		ob_start();
		include $results_template_path;
		$results_template_content = ob_get_clean();

		// Return all data in a single namespaced object.
		return array(
			'searchExperience'      => $search_experience,
			'searchBehavior'        => $search_behavior,
			'headerContent'         => $header_template_content,
			'resultsContent'        => $results_template_content,
			'inputContainerId'      => $input_container_id,
			'resultsContainerId'    => $results_container_id,
			'popoverContainerId'    => $popover_container_id,
			'popoverInsertBehavior' => $popover_insert_behavior,
		);
	}

	/**
	 * Enqueue Searchcraft SDK assets.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_sdk_assets() {
		if ( ! $this->is_sdk_ready() ) {
			return;
		}

		// Get common theme script dependencies.
		$script_deps = array();
		if ( wp_script_is( 'theme-script', 'registered' ) ) {
			$script_deps[] = 'theme-script';
		}
		if ( wp_script_is( get_template() . '-script', 'registered' ) ) {
			$script_deps[] = get_template() . '-script';
		}
		if ( wp_script_is( get_template() . '-theme', 'registered' ) ) {
			$script_deps[] = get_template() . '-theme';
		}

		wp_enqueue_script(
			$this->plugin_name . '-sdk-components',
			plugin_dir_url( __FILE__ ) . 'sdk/components/index.js?v=0.12.2',
			$script_deps,
			$this->version,
			true
		);

		add_filter( 'script_loader_tag', array( $this, 'add_module_type_to_script' ), 10, 3 );
		$sdk_script_deps = array_merge( $script_deps, array( $this->plugin_name . '-sdk-components' ) );
		wp_enqueue_script(
			$this->plugin_name . '-sdk-integration',
			plugin_dir_url( __FILE__ ) . 'js/searchcraft-sdk-integration.js',
			$sdk_script_deps,
			$this->version,
			true
		);

		$js_data = $this->get_js_config();

		wp_localize_script(
			$this->plugin_name . '-sdk-integration',
			'searchcraft_config',
			$js_data
		);

		// Get common theme style dependencies.
		$style_deps = array();
		if ( wp_style_is( 'theme-style', 'registered' ) ) {
			$style_deps[] = 'theme-style';
		}
		if ( wp_style_is( get_template() . '-style', 'registered' ) ) {
			$style_deps[] = get_template() . '-style';
		}
		if ( wp_style_is( get_stylesheet(), 'registered' ) ) {
			$style_deps[] = get_stylesheet();
		}

		// Add CSS for Searchcraft components.
		wp_enqueue_style(
			$this->plugin_name . '-sdk-hologram-styles',
			plugin_dir_url( __FILE__ ) . 'sdk/themes/hologram.css?v=0.12.2',
			$style_deps,
			$this->version,
			'all'
		);
		wp_enqueue_style(
			$this->plugin_name . '-sdk-styles',
			plugin_dir_url( __FILE__ ) . 'css/searchcraft-sdk.css?v=0.12.2',
			$style_deps,
			$this->version,
			'all'
		);
	}

	/**
	 * Override search template to load blank page when Searchcraft is active.
	 *
	 * @since 1.0.0
	 * @param string $template The path of the template to include.
	 * @return string Modified template path.
	 */
	public function override_search_template( $template ) {
		// Only override on search results pages.
		if ( is_search() ) {
			$blank_template = plugin_dir_path( __FILE__ ) . 'templates/blank-search.php';
			return $blank_template;
		}

		return $template;
	}

	/**
	 * Replace WordPress search forms with Searchcraft popover forms.
	 *
	 * @since 1.0.0
	 * @param string $form The search form HTML.
	 * @return string Modified search form HTML.
	 */
	public function replace_search_form( $form ) {
		if ( ! $this->is_sdk_ready() ) {
			return $form;
		}

		// Get the search form location setting.
		$search_form_location = get_option( 'searchcraft_search_form_location', 'header' );

		// Determine the context based on current location.
		$context = $this->get_search_form_context();

		// Only replace forms in the configured location.
		if ( $search_form_location !== $context && 'all' !== $search_form_location ) {
			return $form;
		}

		// Return empty form to replace with Searchcraft components.
		$searchcraft_form = '';
		return $searchcraft_form;
	}

	/**
	 * Determine the context of the current search form.
	 *
	 * @since 1.0.0
	 * @return string The context (header, sidebar, footer, or unknown).
	 */
	private function get_search_form_context() {
		// This is a simplified context detection.
		// In a real implementation, you might need more sophisticated detection.

		// Check if we're in admin bar.
		if ( is_admin_bar_showing() ) {
			return 'header';
		}

		// Check current action/filter context.
		$current_filter = current_filter();

		// Common header contexts.
		if ( in_array( $current_filter, array( 'wp_nav_menu_items', 'wp_nav_menu' ), true ) ) {
			return 'header';
		}

		// Check for sidebar context.
		if ( is_active_sidebar( 'sidebar-1' ) || is_active_sidebar( 'primary' ) ) {
			return 'sidebar';
		}

		// Default to header for now.
		return 'header';
	}

	/**
	 * Add type="module" attribute to SearchCraft SDK integration script.
	 *
	 * @since 1.0.0
	 * @param string $tag    The script tag.
	 * @param string $handle The script handle.
	 * @param string $src    The script source URL.
	 * @return string Modified script tag.
	 */
	public function add_module_type_to_script( $tag, $handle, $src ) {
		if ( $handle === $this->plugin_name . '-sdk-components' || $handle === $this->plugin_name . '-sdk-integration' ) {
			$tag = str_replace( '<script ', '<script type="module" ', $tag );
		}

		unset( $src );
		return $tag;
	}
}
