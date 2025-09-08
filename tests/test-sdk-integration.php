<?php
/**
 * Searchcraft SDK Integration Tests
 *
 * Basic tests to validate the Searchcraft JavaScript SDK integration.
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
 * Test Searchcraft SDK Integration functionality
 */
class Searchcraft_SDK_Integration_Test {

	/**
	 * Run all tests
	 */
	public static function run_tests() {
		echo "<h2>Searchcraft SDK Integration Tests</h2>\n";

		self::test_class_exists();
		self::test_configuration_validation();
		self::test_js_config_generation();
		self::test_asset_enqueuing();
		self::test_search_form_replacement();
		self::test_hooks_integration();
		self::test_output_filtering();

		echo "<p><strong>All tests completed.</strong></p>\n";
	}

	/**
	 * Test if the SDK integration class exists
	 */
	private static function test_class_exists() {
		echo "<h3>Testing Class Existence</h3>\n";

		if ( class_exists( 'Searchcraft_Public' ) ) {
			echo "<p style='color: green;'>✓ Searchcraft_Public class exists</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Searchcraft_Public class not found</p>\n";
			return;
		}

		$public = new Searchcraft_Public( 'test', '1.0.0' );
		if ( is_object( $public ) ) {
			echo "<p style='color: green;'>✓ Public class instance created successfully</p>\n";

			// Check if SDK integration methods exist.
			if ( method_exists( $public, 'is_sdk_ready' ) ) {
				echo "<p style='color: green;'>✓ SDK integration methods available</p>\n";
			} else {
				echo "<p style='color: red;'>✗ SDK integration methods missing</p>\n";
			}
		} else {
			echo "<p style='color: red;'>✗ Failed to create Public class instance</p>\n";
		}
	}

	/**
	 * Test configuration validation
	 */
	private static function test_configuration_validation() {
		echo "<h3>Testing Configuration Validation</h3>\n";

		$public = new Searchcraft_Public( 'test', '1.0.0' );

		// Test with empty configuration.
		$is_ready = $public->is_sdk_ready();
		if ( ! $is_ready ) {
			echo "<p style='color: green;'>✓ Correctly identifies empty configuration as not ready</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Should not be ready with empty configuration</p>\n";
		}

		// Test validation errors.
		$errors = $public->get_config_validation_errors();
		if ( ! empty( $errors ) ) {
			echo "<p style='color: green;'>✓ Configuration validation returns errors for empty config</p>\n";
			echo '<p>Errors found: ' . esc_html( count( $errors ) ) . "</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Should return validation errors for empty config</p>\n";
		}
	}

	/**
	 * Test JavaScript configuration generation
	 */
	private static function test_js_config_generation() {
		echo "<h3>Testing JavaScript Configuration Generation</h3>\n";

		$public = new Searchcraft_Public( 'test', '1.0.0' );

		// Test with empty configuration.
		$js_config = $public->get_js_config();
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

			$js_config = $public->get_js_config();
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

	/**
	 * Test WordPress hooks integration
	 */
	private static function test_hooks_integration() {
		echo "<h3>Testing WordPress Hooks Integration</h3>\n";

		// Test current action and filter detection.
		echo '<p>Current action: ' . esc_html( current_action() ) . "</p>\n";
		echo '<p>Current filter: ' . esc_html( current_filter() ) . "</p>\n";

		// Test initialization hooks.
		$init_hooks = array(
			'init',
			'wp_enqueue_scripts',
			'wp_head',
			'wp_footer',
		);

		echo '<p>Available init hooks: ' . esc_html( implode( ', ', $init_hooks ) ) . "</p>\n";

		// Test hook registration.
		$sdk = new Searchcraft_SDK_Integration( 'test', '1.0.0' );
		if ( method_exists( $sdk, 'define_public_hooks' ) ) {
			echo "<p style='color: green;'>✓ define_public_hooks method exists</p>\n";
		} else {
			echo "<p style='color: orange;'>⚠ define_public_hooks method not found</p>\n";
		}
	}

	/**
	 * Test output buffering and content filtering
	 */
	private static function test_output_filtering() {
		echo "<h3>Testing Output Filtering</h3>\n";

		$sdk = new Searchcraft_SDK_Integration( 'test', '1.0.0' );

		// Test content filtering.
		$test_content = '<p>This is test content for filtering.</p>';
		if ( method_exists( $sdk, 'filter_content' ) ) {
			$filtered_content = $sdk->filter_content( $test_content );
			echo "<p style='color: green;'>✓ Content filtering method exists</p>\n";
		} else {
			$filtered_content = $test_content;
			echo "<p style='color: orange;'>⚠ Content filtering method not found</p>\n";
		}

		// Test output buffering.
		ob_start();
		echo wp_kses_post( $test_content );
		$output = ob_get_clean();

		if ( ! empty( $output ) ) {
			echo "<p style='color: green;'>✓ Output buffering works</p>\n";
			echo '<p>Captured output: ' . esc_html( $output ) . "</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Output buffering failed</p>\n";
		}

		// Test template output.
		ob_start();
		echo '<div class="searchcraft-test">Template output test</div>';
		$output = ob_get_clean();

		if ( strpos( $output, 'searchcraft-test' ) !== false ) {
			echo "<p style='color: green;'>✓ Template output captured</p>\n";
			echo '<p>Template output: ' . esc_html( $output ) . "</p>\n";
		} else {
			echo "<p style='color: red;'>✗ Template output not captured properly</p>\n";
		}
	}
}

// Run tests if accessed directly with proper parameters.
if ( isset( $_GET['run_searchcraft_tests'] ) && isset( $_GET['_wpnonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'run_searchcraft_tests' ) && current_user_can( 'edit_posts' ) ) {
	?>
	<!DOCTYPE html>
	<html>
	<head>
		<title>Searchcraft SDK Integration Tests</title>
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
