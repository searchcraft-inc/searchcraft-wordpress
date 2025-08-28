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
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
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
	 * The SDK integration instance.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      Searchcraft_SDK_Integration    $sdk_integration    The SDK integration instance.
	 */
	private $sdk_integration;

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

		// Initialize SDK integration.
		$this->sdk_integration = new Searchcraft_SDK_Integration( $plugin_name, $version );
		$this->sdk_integration->init_hooks();

		// Load search header template after the first header element.
		add_action( 'wp_footer', array( $this, 'inject_search_header_script' ), 1 );

		// Intercept search results page and load blank template.
		add_filter( 'template_include', array( $this, 'override_search_template' ) );
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/searchcraft-public.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/searchcraft-public.js', array( 'jquery' ), $this->version, false );
	}

	/**
	 * Inject JavaScript to position search header after first header element.
	 *
	 * @since 1.0.0
	 */
	public function inject_search_header_script() {
		$header_template_path = plugin_dir_path( __FILE__ ) . 'templates/search-header.php';
		$results_template_path = plugin_dir_path( __FILE__ ) . 'templates/search-results.php';

		if ( file_exists( $header_template_path ) && file_exists( $results_template_path ) ) {
			$search_experience = get_option( 'searchcraft_search_experience', 'full' );
			ob_start();
			include $header_template_path;
			$header_template_content = ob_get_clean();

			ob_start();
			include $results_template_path;
			$results_template_content = ob_get_clean();

			// Escape the content for JavaScript.
			$escaped_header_content  = wp_json_encode( $header_template_content );
			$escaped_results_content = wp_json_encode( $results_template_content );

			// Get the results container ID option.
			$results_container_id = get_option( 'searchcraft_results_container_id', '' );
			$escaped_container_id = wp_json_encode( $results_container_id );
			// Popover options.
			$popover_container_id         = get_option( 'searchcraft_popover_container_id', '' );
			$escaped_popover_container_id = wp_json_encode( $popover_container_id );
			$popover_insert_behavior      = get_option( 'searchcraft_popover_element_behavior', 'replace' );

			if ( 'full' === $search_experience || ( 'popover' === $search_experience && empty( $popover_container_id ) ) ) {
				// Output JavaScript to inject the template after the first header.
				echo '<script type="text/javascript">
					document.addEventListener("DOMContentLoaded", function() {
						const firstHeader = document.querySelector("header") || document.querySelector(`[id="header"]`);
						const searchHeaderDiv = document.createElement("div");
				';
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is properly escaped via wp_json_encode() above
				echo 'searchHeaderDiv.innerHTML = ' . $escaped_header_content . ';
						if (firstHeader) {
							// Insert after the header element.
							if (firstHeader.nextSibling) {
								firstHeader.parentNode.insertBefore(searchHeaderDiv, firstHeader.nextSibling);
							} else {
								firstHeader.parentNode.appendChild(searchHeaderDiv);
							}
						} else {
							// Fallback: if no header found, append to body.
							document.body.insertBefore(searchHeaderDiv, document.body.firstChild);
						}
					});
					</script>';
				if ( 'full' === $search_experience ) {
					echo '<script type="text/javascript">
								document.addEventListener("DOMContentLoaded", function() {
					';
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is properly escaped via wp_json_encode() above
					echo 'const resultsContainerId = ' . $escaped_container_id . ';';
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is properly escaped via wp_json_encode() above
					echo 'const resultsContent = ' . $escaped_results_content . ';
							const searchInputContainer = document.querySelector(".searchcraft-input-container");
							if (resultsContainerId) {
								const customContainer = document.getElementById(resultsContainerId);
								if (customContainer) {
									customContainer.insertAdjacentHTML("afterbegin", resultsContent);
								} else {
									searchInputContainer.insertAdjacentHTML("afterend", resultsContent);
								}
							} else {
								searchInputContainer.insertAdjacentHTML("afterend", resultsContent);
							}
						});
					</script>';
				}
			} else {
				// Popover injection. "Default behavior" is handled already above, this logic is for if the WP user choose a place for the popover to appear.
				echo '<script type="text/javascript">
							document.addEventListener("DOMContentLoaded", function() {
				';
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is properly escaped via wp_json_encode() above
				echo 'const popoverContainerId = ' . $escaped_popover_container_id . ';
				';
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is pre-selected, no user input
				echo 'const popoverInsertBehavior = "' . $popover_insert_behavior . '";
				';
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Content is properly escaped via wp_json_encode() above
				echo 'const popoverContent = ' . $escaped_header_content . ';
						const searchInputContainer = document.querySelector(".searchcraft-input-container");
						if (popoverContainerId) {
							const customPopoverContainerById = document.getElementById(popoverContainerId);
							//const customPopoverContainerByClass = document.querySelector(`[class="${popoverContainerId}"]`);
							const customPopoverContainerByClass = document.querySelector(`[class="${popoverContainerId}"]`);
							let targetElement = null;
							if (customPopoverContainerById) {
								targetElement = customPopoverContainerById;
							}
							if (!customPopoverContainerById && customPopoverContainerByClass) {
								targetElement = customPopoverContainerByClass;
							}
							if (targetElement) {
								if ("replace" === popoverInsertBehavior) {
									targetElement.innerHTML = popoverContent;
								} else {
									targetElement.insertAdjacentHTML("afterbegin", popoverContent);
								}
							} else {
								console.log("Searchcraft: unable to find popover container element.");
							}
						}
					});
				</script>';
			}
		}
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
}
