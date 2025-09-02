<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
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
 * The core plugin class
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Searchcraft
 * @subpackage Searchcraft/includes
 * @author     Searchcraft, Inc.
 */
class Searchcraft {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @var Searchcraft_Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since 1.0.0
	 * @var string $plugin_name The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since 1.0.0
	 * @var string $plugin_version The version of the plugin.
	 */
	protected $plugin_version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		if ( defined( 'SEARCHCRAFT_VERSION' ) ) {
			$this->plugin_version = SEARCHCRAFT_VERSION;
		} else {
			$this->plugin_version = '1.0.0';
		}
		$this->plugin_name = 'searchcraft';

		$this->load_dependencies();
		$this->define_admin_hooks();
		$this->define_public_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Searchcraft_Loader. Orchestrates the hooks of the plugin.
	 * - Searchcraft_Admin. Defines all hooks for the admin area.
	 * - Searchcraft_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since 1.0.0
	 */
	private function load_dependencies() {
		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( __DIR__ ) . 'includes/class-searchcraft-loader.php';

		/**
		 * The class responsible for configuration management.
		 */
		require_once plugin_dir_path( __DIR__ ) . 'includes/class-searchcraft-config.php';

		/**
		 * The class responsible for helper functions.
		 */
		require_once plugin_dir_path( __DIR__ ) . 'helpers/class-searchcraft-helper-functions.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( __DIR__ ) . 'admin/class-searchcraft-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( __DIR__ ) . 'public/class-searchcraft-public.php';

		/**
		 * The class responsible for Searchcraft JavaScript SDK integration.
		 */
		require_once plugin_dir_path( __DIR__ ) . 'includes/class-searchcraft-sdk-integration.php';

		$this->loader = new Searchcraft_Loader();
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since 1.0.0
	 */
	private function define_admin_hooks() {
		$plugin_admin = new Searchcraft_Admin( $this->get_plugin_name(), $this->get_plugin_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		$this->loader->add_action( 'admin_menu', $plugin_admin, 'searchcraft_add_menu_page' );

		$this->loader->add_action( 'admin_init', $plugin_admin, 'searchcraft_request_handler' );

		// Use wp_after_insert_post instead of transition_post_status to ensure Yoast SEO meta data is saved first.
		$this->loader->add_action( 'wp_after_insert_post', $plugin_admin, 'searchcraft_on_publish_post', 10, 4 );
		$this->loader->add_action( 'transition_post_status', $plugin_admin, 'searchcraft_on_unpublish_post', 10, 3 );

		$this->loader->add_action( 'add_meta_boxes', $plugin_admin, 'searchcraft_add_exclude_from_searchcraft_meta_box' );
		// 'save_post' happens before 'transition_post_status' in the execution order
		// So we will have the updated '_searchcraft_exclude_from_index' value before publishing the post
		$this->loader->add_action( 'save_post', $plugin_admin, 'searchcraft_on_save_post' );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since 1.0.0
	 */
	private function define_public_hooks() {
		$plugin_public = new Searchcraft_Public( $this->get_plugin_name(), $this->get_plugin_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since 1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since  1.0.0
	 * @return string The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since 1.0.0
	 * @return string The current version number of the plugin.
	 */
	public function get_plugin_version() {
		return $this->plugin_version;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since 1.0.0
	 * @return Searchcraft_Loader Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}
}
