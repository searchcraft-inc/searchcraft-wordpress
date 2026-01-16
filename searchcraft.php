<?php
/**
 * The plugin bootstrap file
 *
 * @link              https://searchcraft.io
 * @since             1.0.0
 * @package           Searchcraft
 *
 * @wordpress-plugin
 * Plugin Name:       Searchcraft
 * Plugin URI:        https://github.com/searchcraft-inc/searchcraft-wordpress
 * Description:       Bring fast, relevant search to your site. Searchcraft replaces the default search with a customizable, tunable, highly relevant search experience.
 * Version:           1.3.2
 * Author:            Searchcraft, Inc.
 * Author URI:        https://searchcraft.io/
 * License:           Apache 2.0
 * License URI:       LICENSE.txt
 * Text Domain:       searchcraft
 * Domain Path:       /languages
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
if ( ! defined( 'SEARCHCRAFT_VERSION' ) ) {
	define( 'SEARCHCRAFT_VERSION', '1.3.2' );
}

if ( ! defined( 'SEARCHCRAFT_PLUGIN_FILE' ) ) {
	define( 'SEARCHCRAFT_PLUGIN_FILE', __FILE__ );
}

if ( ! defined( 'SEARCHCRAFT_PLUGIN_DIR' ) ) {
	define( 'SEARCHCRAFT_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'SEARCHCRAFT_PLUGIN_URL' ) ) {
	define( 'SEARCHCRAFT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

// Load Composer autoloader for dependencies.
if ( file_exists( SEARCHCRAFT_PLUGIN_DIR . 'vendor/autoload.php' ) ) {
	require_once SEARCHCRAFT_PLUGIN_DIR . 'vendor/autoload.php';
}

// Load the configuration class.
require_once SEARCHCRAFT_PLUGIN_DIR . 'includes/class-searchcraft-config.php';

// Load the main plugin class.
require_once SEARCHCRAFT_PLUGIN_DIR . 'includes/class-searchcraft.php';

// Define dynamic constants based on configuration.
if ( ! defined( 'SEARCHCRAFT_INDEX_ID' ) ) {
	define( 'SEARCHCRAFT_INDEX_ID', Searchcraft_Config::get_index_id() );
}

/**
 * Plugin activation hook.
 *
 * Performs necessary setup tasks when the plugin is activated.
 *
 * @since 1.0.0
 */
function activate_searchcraft() {
	// Migrate existing plaintext keys to encrypted format.
	Searchcraft_Config::migrate_keys_to_encrypted();

	// Set default search experience if not already set.
	if ( false === get_option( 'searchcraft_search_experience' ) ) {
		update_option( 'searchcraft_search_experience', 'full' );
	}

	// Set default search placeholder if not already set.
	if ( false === get_option( 'searchcraft_search_placeholder' ) ) {
		update_option( 'searchcraft_search_placeholder', 'Search...' );
	}

	// Set default input padding if not already set.
	if ( false === get_option( 'searchcraft_input_padding' ) ) {
		update_option( 'searchcraft_input_padding', '50' );
	}

	// Set default input vertical padding if not already set.
	if ( false === get_option( 'searchcraft_input_vertical_padding' ) ) {
		update_option( 'searchcraft_input_vertical_padding', '0' );
	}

	// Set default image alignment if not already set.
	if ( false === get_option( 'searchcraft_image_alignment' ) ) {
		update_option( 'searchcraft_image_alignment', 'left' );
	}

	// Set default AI summary setting if not already set.
	if ( false === get_option( 'searchcraft_enable_ai_summary' ) ) {
		update_option( 'searchcraft_enable_ai_summary', false );
	}

	// Set default brand color if not already set.
	if ( false === get_option( 'searchcraft_brand_color' ) ) {
		update_option( 'searchcraft_brand_color', '#000000' );
	}

	// Set default summary background color if not already set.
	if ( false === get_option( 'searchcraft_summary_background_color' ) ) {
		update_option( 'searchcraft_summary_background_color', '#F5F5F5' );
	}

	// Set default summary border color if not already set.
	if ( false === get_option( 'searchcraft_summary_border_color' ) ) {
		update_option( 'searchcraft_summary_border_color', '#E0E0E0' );
	}

	// Set default filter panel setting if not already set.
	if ( false === get_option( 'searchcraft_include_filter_panel' ) ) {
		update_option( 'searchcraft_include_filter_panel', false );
	}

	// Set default filter label color if not already set.
	if ( false === get_option( 'searchcraft_filter_label_color' ) ) {
		update_option( 'searchcraft_filter_label_color', '#000000' );
	}

	// Set a transient to show the activation notice.
	set_transient( 'searchcraft_activation_notice', true, 60 );
}
register_activation_hook( __FILE__, 'activate_searchcraft' );

/**
 * Display admin notice after plugin activation.
 *
 * @since 1.0.0
 */
function searchcraft_activation_notice() {
	// Check if the activation notice transient exists.
	if ( get_transient( 'searchcraft_activation_notice' ) ) {
		?>
		<div class="notice notice-success is-dismissible">
			<p>
				<strong>Searchcraft activated!</strong>
				Please <a href="<?php echo esc_url( admin_url( 'admin.php?page=searchcraft' ) ); ?>">configure the plugin</a> to get started.
			</p>
		</div>
		<?php
		// Delete the transient so the notice only shows once.
		delete_transient( 'searchcraft_activation_notice' );
	}
}
add_action( 'admin_notices', 'searchcraft_activation_notice' );

/**
 * Initialize the Searchcraft plugin.
 *
 * Creates an instance of the main plugin class, which loads dependencies
 * and initializes the admin and public-facing components.
 *
 * @since 1.0.0
 */
function run_searchcraft() {
	new Searchcraft();
}
run_searchcraft();
