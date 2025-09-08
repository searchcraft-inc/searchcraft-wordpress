<?php
/**
 * Test file to demonstrate search query integration with Searchcraft SDK
 *
 * This file demonstrates how the get_search_query() value is now available
 * in the Searchcraft SDK configuration.
 *
 * Usage: Place this file in your WordPress root and access it via:
 * http://yoursite.com/test-search-query-integration.php?s=your+search+term
 *
 * @package Searchcraft
 */

// Load WordPress - adjust path since we're in the plugin directory.
$wp_root_paths = array(
	'../../../wp-config.php',  // Standard plugin location.
	'../../../../wp-config.php', // In case of nested structure.
	__DIR__ . '/../../../wp-config.php',
);

$wp_loaded = false;
foreach ( $wp_root_paths as $wp_config_path ) {
	if ( file_exists( $wp_config_path ) ) {
		require_once $wp_config_path;
		$wp_load_path = dirname( $wp_config_path ) . '/wp-load.php';
		if ( file_exists( $wp_load_path ) ) {
			require_once $wp_load_path;
			$wp_loaded = true;
			break;
		}
	}
}

if ( ! $wp_loaded ) {
	die( 'Error: Could not load WordPress. Please make sure this file is in the correct location.' );
}

// Simulate being on a search page.
global $wp_query;
if ( isset( $_GET['s'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$wp_query->set( 's', sanitize_text_field( wp_unslash( $_GET['s'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
}

// Load the Searchcraft classes.
require_once 'wp-content/plugins/searchcraft/includes/class-searchcraft-config.php';
require_once 'wp-content/plugins/searchcraft/public/class-searchcraft-public.php';

?>
<!DOCTYPE html>
<html>
<head>
    <title>Searchcraft Search Query Integration Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .test-section { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .success { color: green; }
        .warning { color: orange; }
        .error { color: red; }
        pre { background: #eee; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .search-form { margin: 20px 0; }
        .search-form input[type="text"] { padding: 8px; width: 300px; }
        .search-form input[type="submit"] { padding: 8px 16px; }
    </style>
</head>
<body>
    <h1>Searchcraft Search Query Integration Test</h1>

    <div class="search-form">
        <form method="GET">
            <label for="search">Test Search Query:</label><br>
            <input type="text" id="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="Enter a search term">
            <input type="submit" value="Test">
        </form>
    </div>

    <div class="test-section">
        <h2>Current Search Query</h2>
        <?php
        $search_query = get_search_query( false );
        if ( ! empty( $search_query ) ) {
            echo "<p class='success'>✓ Search query found: <strong>" . esc_html( $search_query ) . '</strong></p>';
        } else {
            echo "<p class='warning'>⚠ No search query found. Add ?s=your+search+term to the URL to test.</p>";
        }
        ?>
    </div>

    <div class="test-section">
        <h2>Plugin Status Test</h2>
        <?php
        // Check if plugin is active.
        if ( function_exists( 'is_plugin_active' ) ) {
            $plugin_file = 'searchcraft-wordpress-lite/searchcraft.php';
            $is_active   = is_plugin_active( $plugin_file );
            echo "<p class='" . ( $is_active ? 'success' : 'error' ) . "'>" .
                 ( $is_active ? '✓' : '✗' ) . ' Plugin active status: ' .
                 ( $is_active ? 'Active' : 'Inactive' ) . '</p>';
        }

        // Check if main plugin class exists.
        if ( class_exists( 'Searchcraft' ) ) {
            echo "<p class='success'>✓ Main Searchcraft class found</p>";
        } else {
            echo "<p class='error'>✗ Main Searchcraft class not found</p>";
        }

        // Check if public class exists.
        if ( class_exists( 'Searchcraft_Public' ) ) {
            echo "<p class='success'>✓ Searchcraft_Public class found</p>";
        } else {
            echo "<p class='error'>✗ Searchcraft_Public class not found</p>";
        }
        ?>
    </div>

    <div class="test-section">
        <h2>Searchcraft Configuration Test</h2>
        <?php
        // Test if Searchcraft is configured.
        if ( class_exists( 'Searchcraft_Config' ) ) {
            $is_configured = Searchcraft_Config::is_configured();
            if ( $is_configured ) {
                echo "<p class='success'>✓ Searchcraft is configured</p>";
            } else {
                echo "<p class='warning'>⚠ Searchcraft is not configured. Please configure it in WordPress admin.</p>";
            }
        } else {
            echo "<p class='error'>✗ Searchcraft Config class not found</p>";
        }
        ?>
    </div>

    <div class="test-section">
        <h2>Search Form Configuration</h2>
        <?php
        // Check search form location setting.
        $search_form_location = get_option( 'searchcraft_search_form_location', 'header' );
        echo "<p class='success'>✓ Search form location setting: <strong>" . esc_html( $search_form_location ) . '</strong></p>';

        // Check if SDK is ready.
        if ( class_exists( 'Searchcraft_SDK_Integration' ) ) {
            $sdk          = new Searchcraft_SDK_Integration( 'test', '1.0.0' );
            $is_sdk_ready = $sdk->is_sdk_ready();

            if ( $is_sdk_ready ) {
                echo "<p class='success'>✓ SDK is ready - search form replacement should be active</p>";
            } else {
                echo "<p class='warning'>⚠ SDK is not ready - fallback search form display should be active</p>";

                // Check configuration details.
                if ( class_exists( 'Searchcraft_Config' ) ) {
                    $config = Searchcraft_Config::get_all();
                    echo '<h3>Configuration Details:</h3>';
                    echo '<ul>';
                    echo '<li>Endpoint URL: ' . ( empty( $config['endpoint_url'] ) ? '<span style="color: red;">Missing</span>' : '<span style="color: green;">Set</span>' ) . '</li>';
                    echo '<li>Index ID: ' . ( empty( $config['index_id'] ) ? '<span style="color: red;">Missing</span>' : '<span style="color: green;">Set</span>' ) . '</li>';
                    echo '<li>Read Key: ' . ( empty( $config['read_key'] ) ? '<span style="color: red;">Missing</span>' : '<span style="color: green;">Set</span>' ) . '</li>';
                    echo '<li>Ingest Key: ' . ( empty( $config['ingest_key'] ) ? '<span style="color: red;">Missing</span>' : '<span style="color: green;">Set</span>' ) . '</li>';
                    echo '</ul>';
                }
            }
        } else {
            echo "<p class='error'>✗ Searchcraft SDK Integration class not found</p>";
        }

        // Test if the admin class method would be called.
        echo '<h3>Debug Information:</h3>';
        echo '<ul>';
        echo '<li>is_admin(): ' . ( is_admin() ? 'true' : 'false' ) . '</li>';
        echo '<li>Current action: ' . esc_html( current_action() ) . '</li>';
        echo '<li>Current filter: ' . esc_html( current_filter() ) . '</li>';

        // Check if the admin class exists and test the method.
        if ( class_exists( 'Searchcraft_Admin' ) ) {
            echo "<li>Searchcraft_Admin class: <span style='color: green;'>Found</span></li>";

            // Check if hooks are registered.
            global $wp_filter;
            $init_hooks = isset( $wp_filter['init'] ) ? count( $wp_filter['init']->callbacks ) : 0;
            echo '<li>Init hooks registered: ' . esc_html( $init_hooks ) . '</li>';

            // Check if our specific hook is there.
            $has_our_hook = false;
            if ( isset( $wp_filter['init'] ) ) {
                foreach ( $wp_filter['init']->callbacks as $priority => $callbacks ) {
                    foreach ( $callbacks as $callback ) {
                        if ( is_array( $callback['function'] ) &&
                            is_object( $callback['function'][0] ) &&
                            get_class( $callback['function'][0] ) === 'Searchcraft_Admin' &&
                            $callback['function'][1] === 'searchcraft_init_search_form_display' ) {
                            $has_our_hook = true;
                            break 2;
                        }
                    }
                }
            }
            echo '<li>Our init hook registered: ' . ( $has_our_hook ? '<span style="color: green;">Yes</span>' : '<span style="color: red;">No</span>' ) . '</li>';
        } else {
            echo "<li>Searchcraft_Admin class: <span style='color: red;'>Not found</span></li>";
        }
        echo '</ul>';
        ?>
    </div>

    <div class="test-section">
        <h2>Debug Log Check</h2>
        <?php
        // Try to read recent debug log entries.
        $debug_log_paths = array(
            '../../../debug.log',
            '../../../../debug.log',
            '/tmp/wordpress-debug.log',
            ini_get( 'error_log' ),
        );

        $found_log = false;
        foreach ( $debug_log_paths as $log_path ) {
            if ( $log_path && file_exists( $log_path ) ) {
                $found_log = true;
                echo "<p class='success'>✓ Found debug log at: " . esc_html( $log_path ) . '</p>';

                // Read last 20 lines.
                $lines = file( $log_path );
                if ( $lines ) {
                    $recent_lines      = array_slice( $lines, -20 );
                    $searchcraft_lines = array_filter(
                        $recent_lines,
                        function ( $line ) {
                            return strpos( $line, 'Searchcraft' ) !== false;
                        }
                    );

                    if ( ! empty( $searchcraft_lines ) ) {
                        echo '<h3>Recent Searchcraft Debug Messages:</h3>';
                        echo "<pre style='background: #f0f0f0; padding: 10px; max-height: 200px; overflow-y: auto;'>";
                        foreach ( $searchcraft_lines as $line ) {
                            echo esc_html( $line );
                        }
                        echo '</pre>';
                    } else {
                        echo "<p class='warning'>⚠ No recent Searchcraft debug messages found</p>";
                    }
                }
                break;
            }
        }

        if ( ! $found_log ) {
            echo "<p class='warning'>⚠ Debug log not found. Make sure WP_DEBUG_LOG is enabled.</p>";
        }
        ?>
    </div>

    <div class="test-section">
        <h2>Manual Search Form Test</h2>
        <?php
        // Let's manually test if we can add a search form.
        echo '<p>Testing manual search form addition:</p>';

        // Test the admin class method directly.
        if ( class_exists( 'Searchcraft_Admin' ) ) {
            $admin = new Searchcraft_Admin( 'searchcraft', '1.0.0' );

            echo "<div style='border: 2px solid #0073aa; padding: 10px; margin: 10px 0;'>";
            echo '<h4>Manual Admin Header Search Form:</h4>';

            // Call the method directly.
            ob_start();
            $admin->searchcraft_add_header_search_form();
            $output = ob_get_clean();

            if ( ! empty( $output ) ) {
                echo "<p class='success'>✓ Admin header search form method produces output</p>";
                echo wp_kses_post( $output );
            } else {
                echo "<p class='error'>✗ Admin header search form method produces no output</p>";
            }
            echo '</div>';
        }

        // Test the public class method directly.
        if ( class_exists( 'Searchcraft_Public' ) ) {
            $public = new Searchcraft_Public( 'searchcraft', '1.0.0' );

            echo "<div style='border: 2px solid #28a745; padding: 10px; margin: 10px 0;'>";
            echo '<h4>Manual Public Header Search Form:</h4>';

            // Call the method directly.
            ob_start();
            $public->add_header_search_form();
            $output = ob_get_clean();

            if ( ! empty( $output ) ) {
                echo "<p class='success'>✓ Public header search form method produces output</p>";
                echo wp_kses_post( $output );
            } else {
                echo "<p class='error'>✗ Public header search form method produces no output</p>";
            }
            echo '</div>';
        }
        ?>
    </div>

    <div class="test-section">
        <h2>JavaScript Configuration</h2>
        <?php
        if ( class_exists( 'Searchcraft_Public' ) ) {
            $public    = new Searchcraft_Public( 'test', '1.0.0' );
            $js_config = $public->get_js_config();

            if ( ! empty( $js_config ) ) {
                echo "<p class='success'>✓ JavaScript configuration generated successfully</p>";
                echo '<h3>Configuration Contents:</h3>';
                echo '<pre>' . esc_html( wp_json_encode( $js_config, JSON_PRETTY_PRINT ) ) . '</pre>';

                if ( isset( $js_config['searchQuery'] ) ) {
                    echo "<p class='success'>✓ Search query is included in the configuration: <strong>" . esc_html( $js_config['searchQuery'] ) . '</strong></p>';
                } elseif ( ! empty( $search_query ) ) {
                    echo "<p class='warning'>⚠ Search query exists but not included in config (check if Searchcraft is properly configured)</p>";
                } else {
                    echo "<p class='warning'>⚠ No search query to include (this is expected when no search term is provided)</p>";
                }
            } else {
                echo "<p class='warning'>⚠ JavaScript configuration is empty (Searchcraft may not be configured)</p>";
            }
        } else {
            echo "<p class='error'>✗ Searchcraft SDK Integration class not found</p>";
        }
        ?>
    </div>

    <div class="test-section">
        <h2>How It Works</h2>
        <p>This integration allows the Searchcraft JavaScript SDK to access the current WordPress search query through the configuration object. Here's how:</p>
        <ol>
            <li><strong>PHP Side:</strong> The <code>get_js_config()</code> method in <code>Searchcraft_Public</code> now calls <code>get_search_query(false)</code> to get the current search term.</li>
            <li><strong>JavaScript Side:</strong> The search query is passed to the Searchcraft SDK configuration object as <code>config.searchQuery</code>.</li>
            <li><strong>Usage:</strong> The Searchcraft SDK can now use this initial search query for initialization, pre-filling search forms, or other search-related functionality.</li>
        </ol>

        <h3>Code Changes Made:</h3>
        <p><strong>In PHP (includes/class-searchcraft-sdk-integration.php):</strong></p>
        <pre>// Include search query if available
$search_query = get_search_query( false ); // Get unescaped query
if ( ! empty( $search_query ) ) {
    $js_config['searchQuery'] = $search_query;
}</pre>

        <p><strong>In JavaScript (public/js/searchcraft-sdk-integration.js):</strong></p>
        <pre>// Include search query if available from PHP
if (searchcraft_config.searchQuery) {
    config.searchQuery = searchcraft_config.searchQuery;
}</pre>
    </div>

    <div class="test-section">
        <h2>Testing Instructions</h2>
        <ol>
            <li>Make sure Searchcraft is properly configured in your WordPress admin</li>
            <li>Add a search term to the URL: <code>?s=your+search+term</code></li>
            <li>Check that the search query appears in the JavaScript configuration above</li>
            <li>The Searchcraft SDK will now have access to this search query for initialization</li>
        </ol>
    </div>
</body>
</html>
