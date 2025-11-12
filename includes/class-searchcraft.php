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
 * This is used to load dependencies and initialize the admin and public-facing
 * functionality of the plugin.
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
	 * Load the dependencies and initialize the admin and public-facing functionality.
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
		$this->init_components();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Searchcraft_Config. Manages plugin configuration.
	 * - Searchcraft_Helper_Functions. Provides helper functions.
	 * - Searchcraft_Admin. Defines all hooks for the admin area.
	 * - Searchcraft_Public. Defines all hooks for the public side of the site.
	 *
	 * @since 1.0.0
	 */
	private function load_dependencies() {
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
		 * side of the site, including SDK integration.
		 */
		require_once plugin_dir_path( __DIR__ ) . 'public/class-searchcraft-public.php';
	}

	/**
	 * Initialize the admin and public-facing components.
	 *
	 * Creates instances of the admin and public classes, which register
	 * their own hooks in their constructors.
	 *
	 * @since 1.0.0
	 */
	private function init_components() {
		// Initialize admin functionality.
		new Searchcraft_Admin( $this->get_plugin_name(), $this->get_plugin_version() );

		// Initialize public-facing functionality.
		new Searchcraft_Public( $this->get_plugin_name(), $this->get_plugin_version() );
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
}
