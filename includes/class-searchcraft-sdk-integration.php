<?php
/**
 * Searchcraft JavaScript SDK Integration
 *
 * This class handles the integration of the Searchcraft JavaScript SDK
 * into WordPress, including asset loading, configuration management,
 * and component initialization.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/includes
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Searchcraft JavaScript SDK Integration class
 *
 * Handles the integration of Searchcraft JavaScript SDK components
 * including popover forms, search pages, and configuration management.
 *
 * @since      1.0.0
 * @package    Searchcraft
 * @subpackage Searchcraft/includes
 * @author     Searchcraft, Inc.
 */
class Searchcraft_SDK_Integration {

	/**
	 * The plugin name.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The plugin name.
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
		$search_query = get_search_query( false ); // Get unescaped query.
		if ( ! empty( $search_query ) ) {
			$js_config['searchQuery'] = $search_query;
		}

		// Include results per page setting.
		$results_per_page            = get_option( 'searchcraft_results_per_page', 10 );
		$js_config['resultsPerPage'] = intval( $results_per_page );

		// Include custom result template callback function.
		$result_template = get_option( 'searchcraft_result_template', '' );
		if ( ! empty( $result_template ) ) {
			$js_config['resultTemplateCallback'] = $result_template;
		}

		// Include AI summary settings.
		$enable_ai_summary            = get_option( 'searchcraft_enable_ai_summary', false );
		$js_config['enableAiSummary'] = (bool) $enable_ai_summary;

		// Include cortex URL if AI summary is enabled and cortex URL is configured.
		if ( $enable_ai_summary && ! empty( $config['cortex_url'] ) ) {
			$js_config['cortexURL'] = $config['cortex_url'];
		}

		// Include image alignment setting.
		$image_alignment             = get_option( 'searchcraft_image_alignment', 'left' );
		$js_config['imageAlignment'] = $image_alignment;

		// Include brand color setting.
		$brand_color             = get_option( 'searchcraft_brand_color', '#000000' );
		$js_config['brandColor'] = $brand_color;

		// Include summary background color setting.
		$summary_background_color            = get_option( 'searchcraft_summary_background_color', '#F5F5F5' );
		$js_config['summaryBackgroundColor'] = $summary_background_color;

		// Include filter panel setting.
		$include_filter_panel            = get_option( 'searchcraft_include_filter_panel', false );
		$js_config['includeFilterPanel'] = (bool) $include_filter_panel;

		// Include oldest post year.
		$admin_instance              = new Searchcraft_Admin( 'searchcraft', SEARCHCRAFT_VERSION );
		$oldest_post_year            = $admin_instance->get_oldest_post_year();
		$js_config['oldestPostYear'] = $oldest_post_year;

		return $js_config;
	}

	/**
	 * Get the Searchcraft SDK URL from jsDelivr.
	 *
	 * @since 1.0.0
	 * @return string The SDK URL.
	 */
	private function get_sdk_url() {
		// Allow version to be filtered for specific version pinning.
		$sdk_version = apply_filters( 'searchcraft_sdk_version', '0.11.0' );

		// Build the default jsDelivr URL for main SDK.
		$default_url = "https://cdn.jsdelivr.net/npm/@searchcraft/javascript-sdk@{$sdk_version}/dist/components/index.js";

		// Allow the entire URL to be filtered for custom CDNs or self-hosting.
		return apply_filters( 'searchcraft_sdk_url', $default_url );
	}

	/**
	 * Get the theme CSS URL with version and filtering support.
	 *
	 * @since 1.0.0
	 * @return string The theme CSS URL.
	 */
	private function get_theme_css_url() {
		// Allow version to be filtered for specific version pinning.
		$sdk_version = apply_filters( 'searchcraft_sdk_version', '0.11.0' );

		// Build the default jsDelivr URL for Hologram theme.
		$default_url = "https://cdn.jsdelivr.net/npm/@searchcraft/javascript-sdk@{$sdk_version}/dist/themes/hologram.css";

		// Allow the entire URL to be filtered for custom CDNs or self-hosting.
		return apply_filters( 'searchcraft_theme_css_url', $default_url );
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

		// Enqueue our integration script (it will handle SDK loading via dynamic import).
		wp_enqueue_script(
			$this->plugin_name . '-sdk-integration',
			plugin_dir_url( __FILE__ ) . '../public/js/searchcraft-sdk-integration.js',
			$script_deps,
			$this->version,
			true
		);

		// Set integration script as module to support dynamic imports.
		wp_script_add_data( $this->plugin_name . '-sdk-integration', 'type', 'module' );

		// Pass configuration and SDK URL to JavaScript.
		$js_data           = $this->get_js_config();
		$js_data['sdkUrl'] = $this->get_sdk_url();

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
			$this->plugin_name . '-sdk-styles',
			plugin_dir_url( __FILE__ ) . '../public/css/searchcraft-sdk.css',
			$style_deps,
			$this->version,
			'all'
		);

		// Add Searchcraft Hologram theme CSS.
		wp_enqueue_style(
			$this->plugin_name . '-hologram-theme',
			$this->get_theme_css_url(),
			array( $this->plugin_name . '-sdk-styles' ),
			$this->version,
			'all'
		);
		// Custom css is loaded in search-header.php via a style tag.
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

		// $searchcraft_form = '<searchcraft-popover-form type="inline"></searchcraft-popover-form>';
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
	 * Initialize Searchcraft SDK integration hooks.
	 *
	 * @since 1.0.0
	 */
	public function init_hooks() {
		// Only initialize frontend features if SDK is ready.
		if ( ! $this->is_sdk_ready() ) {
			return;
		}

		// Enqueue assets on frontend with higher priority to load after theme assets.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_sdk_assets' ), 20 );

		// Replace search forms.
		add_filter( 'get_search_form', array( $this, 'replace_search_form' ) );
	}
}
