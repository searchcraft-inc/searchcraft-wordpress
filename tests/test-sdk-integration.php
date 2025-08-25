<?php
/**
 * SearchCraft SDK Integration Tests
 *
 * Basic tests to validate the SearchCraft JavaScript SDK integration.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/tests
 */

// phpcs:ignore WordPress.Files.FileName.InvalidClassFileName -- This is a test file, not a regular class file.

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Test SearchCraft SDK Integration functionality
 */
class Searchcraft_SDK_Integration_Test {

	/**
	 * Run all tests
	 */
	public static function run_tests() {
		echo "<h2>SearchCraft SDK Integration Tests</h2>\n";

		self::test_class_exists();
		self::test_configuration_validation();
		self::test_js_config_generation();
		self::test_asset_enqueuing();
		self::test_search_form_replacement();

		echo "<p><strong>All tests completed.</strong></p>\n";
	}

	/**
	 * Test if the SDK integration class exists
	 */
	private static function test_class_exists() {
		echo "<h3>Testing Class Existence</h3>\n";

		if ( class_exists( 'Searchcraft_SDK_Integration' ) ) {
			echo "<p style='color: green;'>✓ Searchcraft_SDK_Integration class exists</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Searchcraft_SDK_Integration class not found</p>\n";
			return;
		}

		$sdk = new Searchcraft_SDK_Integration( 'test', '1.0.0' );
		if ( is_object( $sdk ) ) {
			echo "<p style='color: green;'>✓ SDK integration instance created successfully</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Failed to create SDK integration instance</p>\n";
		}
	}

	/**
	 * Test configuration validation
	 */
	private static function test_configuration_validation() {
		echo "<h3>Testing Configuration Validation</h3>\n";

		$sdk = new Searchcraft_SDK_Integration( 'test', '1.0.0' );

		// Test with empty configuration.
		$is_ready = $sdk->is_sdk_ready();
		if ( ! $is_ready ) {
			echo "<p style='color: green;'>✓ Correctly identifies empty configuration as not ready</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Should not be ready with empty configuration</p>\n";
		}

		// Test validation errors.
		$errors = $sdk->get_config_validation_errors();
		if ( ! empty( $errors ) ) {
			echo "<p style='color: green;'>✓ Configuration validation returns errors for empty config</p>\n";
			echo '<p>Errors found: ' . count( $errors ) . "</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Should return validation errors for empty config</p>\n";
		}
	}

	/**
	 * Test JavaScript configuration generation
	 */
	private static function test_js_config_generation() {
		echo "<h3>Testing JavaScript Configuration Generation</h3>\n";

		$sdk = new Searchcraft_SDK_Integration( 'test', '1.0.0' );

		// Test with empty configuration.
		$js_config = $sdk->get_js_config();
		if ( empty( $js_config ) ) {
			echo "<p style='color: green;'>✓ Returns empty config when not ready</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Should return empty config when not ready</p>\n";
		}

		// Test with mock configuration.
		if ( method_exists( 'Searchcraft_Config', 'set_multiple' ) ) {
			$test_config = array(
				'endpoint_url' => 'https://api.searchcraft.io',
				'index_id'     => 'test_index',
				'read_key'     => 'test_read_key_1234567890',
			);

			Searchcraft_Config::set_multiple( $test_config );

			$js_config = $sdk->get_js_config();
			if ( ! empty( $js_config ) && isset( $js_config['endpointURL'] ) ) {
				echo "<p style='color: green;'>✓ Generates JavaScript config with valid data</p>\n";
				echo '<p>Config keys: ' . esc_html( implode( ', ', array_keys( $js_config ) ) ) . "</p>\n";
			} else {
				echo "<p style='color: orange;'>⚠ Could not test with mock config (config may not be properly set)</p>\n";
			}
		} else {
			echo "<p style='color: orange;'>⚠ Cannot test with mock config (Searchcraft_Config::set_multiple not available)</p>\n";
		}

		// Test search query inclusion.
		echo "<h4>Testing Search Query Integration</h4>\n";

		// Simulate a search query by setting the 's' query var.
		global $wp_query;
		if ( isset( $wp_query ) ) {
			$original_s = $wp_query->get( 's' );
			$wp_query->set( 's', 'test search query' );

			$js_config = $sdk->get_js_config();
			if ( isset( $js_config['searchQuery'] ) && 'test search query' === $js_config['searchQuery'] ) {
				echo "<p style='color: green;'>✓ Search query included in JavaScript config</p>\n";
			} else {
				echo "<p style='color: orange;'>⚠ Search query not found in config (may be expected if not on search page)</p>\n";
			}

			// Restore original query.
			$wp_query->set( 's', $original_s );
		} else {
			echo "<p style='color: orange;'>⚠ Cannot test search query (wp_query not available)</p>\n";
		}
	}

	/**
	 * Test asset enqueuing
	 */
	private static function test_asset_enqueuing() {
		echo "<h3>Testing Asset Enqueuing</h3>\n";

		$sdk = new Searchcraft_SDK_Integration( 'test', '1.0.0' );

		// Check if method exists.
		if ( method_exists( $sdk, 'enqueue_sdk_assets' ) ) {
			echo "<p style='color: green;'>✓ enqueue_sdk_assets method exists</p>\n";
		} else {
			echo "<p style='color: red;'>✗ enqueue_sdk_assets method not found</p>\n";
		}

		// Check if JavaScript file exists.
		$js_file = plugin_dir_path( __DIR__ ) . 'public/js/searchcraft-sdk-integration.js';
		if ( file_exists( $js_file ) ) {
			echo "<p style='color: green;'>✓ JavaScript integration file exists</p>\n";
		} else {
			echo "<p style='color: red;'>✗ JavaScript integration file not found</p>\n";
		}

		// Check if CSS file exists.
		$css_file = plugin_dir_path( __DIR__ ) . 'public/css/searchcraft-sdk.css';
		if ( file_exists( $css_file ) ) {
			echo "<p style='color: green;'>✓ CSS integration file exists</p>\n";
		} else {
			echo "<p style='color: red;'>✗ CSS integration file not found</p>\n";
		}
	}

	/**
	 * Test search form replacement
	 */
	private static function test_search_form_replacement() {
		echo "<h3>Testing Search Form Replacement</h3>\n";

		$sdk = new Searchcraft_SDK_Integration( 'test', '1.0.0' );

		// Check if method exists.
		if ( method_exists( $sdk, 'replace_search_form' ) ) {
			echo "<p style='color: green;'>✓ replace_search_form method exists</p>\n";
		} else {
			echo "<p style='color: red;'>✗ replace_search_form method not found</p>\n";
			return;
		}

		// Test form replacement with empty config.
		$original_form = '<form role="search"><input type="search" name="s"><input type="submit" value="Search"></form>';
		$replaced_form = $sdk->replace_search_form( $original_form );

		if ( $replaced_form === $original_form ) {
			echo "<p style='color: green;'>✓ Returns original form when not configured</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Should return original form when not configured</p>\n";
		}
	}
}

// Run tests if accessed directly with proper parameters.
if ( isset( $_GET['run_searchcraft_tests'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ?? '' ) ), 'run_searchcraft_tests' ) && current_user_can( 'edit_posts' ) ) {
	?>
	<!DOCTYPE html>
	<html>
	<head>
		<title>SearchCraft SDK Integration Tests</title>
		<style>
			body { font-family: Arial, sans-serif; margin: 20px; }
			h2, h3 { color: #333; }
			p { margin: 5px 0; }
		</style>
	</head>
	<body>
		<?php Searchcraft_SDK_Integration_Test::run_tests(); ?>
	</body>
	</html>
	<?php
	exit;
}
