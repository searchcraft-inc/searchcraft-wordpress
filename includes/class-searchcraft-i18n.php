<?php
/**
 * The file that defines the internationalization functionality
 *
 * A class definition that includes attributes and functions used for
 * loading and defining the internationalization files for this plugin
 * so that it is ready for translation.
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
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Searchcraft
 * @subpackage Searchcraft/includes
 * @author     Searchcraft, Inc.
 */
class Searchcraft_I18n {

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since 1.0.0
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			'searchcraft',
			false,
			dirname( plugin_basename( __FILE__ ), 2 ) . '/languages/'
		);
	}
}
