<?php
/**
 * Script to automatically update WordPress plugin header from readme.txt
 *
 * This script parses the readme.txt file and updates the plugin header
 * in the main plugin file (searchcraft.php) with the information from readme.txt
 *
 * @package Searchcraft
 * @since   1.0.0
 */

/**
 * Class PluginHeaderUpdater
 *
 * Handles updating WordPress plugin headers from readme.txt file data.
 */
class PluginHeaderUpdater {

	/**
	 * Path to the readme.txt file
	 *
	 * @var string
	 */
	private $readme_path;
	/**
	 * Path to the main plugin file
	 *
	 * @var string
	 */
	private $plugin_path;

	/**
	 * Parsed data from the readme.txt file
	 *
	 * @var array
	 */
	private $readme_data = array();

	/**
	 * Constructor for PluginHeaderUpdater
	 *
	 * @param string $readme_path  Path to the readme.txt file.
	 * @param string $plugin_path  Path to the main plugin file.
	 */
	public function __construct( $readme_path = 'readme.txt', $plugin_path = 'searchcraft.php' ) {
		$this->readme_path = $readme_path;
		$this->plugin_path = $plugin_path;
	}

	/**
	 * Parse the readme.txt file and extract plugin information.
	 *
	 * @return array The parsed readme data.
	 * @throws Exception If readme.txt file is not found.
	 */
	public function parse_readme() {
		if ( ! file_exists( $this->readme_path ) ) {
			throw new Exception( 'readme.txt file not found at: ' . htmlspecialchars( $this->readme_path, ENT_QUOTES, 'UTF-8' ) );
		}

		$content = file_get_contents( $this->readme_path );
		$lines   = explode( "\n", $content );

		foreach ( $lines as $line ) {
			$line = trim( $line );

			// Parse plugin name from first line.
			if ( preg_match( '/^=== (.+) ===$/', $line, $matches ) ) {
				$this->readme_data['plugin_name'] = trim( $matches[1] );
			}

			// Parse other fields.
			if ( preg_match( '/^([^:]+):\s*(.+)$/', $line, $matches ) ) {
				$key   = strtolower( trim( $matches[1] ) );
				$value = trim( $matches[2] );

				switch ( $key ) {
					case 'stable tag':
						$this->readme_data['version'] = $value;
						break;
					case 'license':
						$this->readme_data['license'] = $value;
						break;
					case 'license uri':
						$this->readme_data['license_uri'] = $value;
						break;
					case 'requires at least':
						$this->readme_data['requires_at_least'] = $value;
						break;
					case 'tested up to':
						$this->readme_data['tested_up_to'] = $value;
						break;
				}
			}

			// Parse description (first line after plugin name).
			if ( empty( $this->readme_data['description'] ) &&
				! empty( $this->readme_data['plugin_name'] ) &&
				! empty( $line ) &&
				! preg_match( '/^([^:]+):\s*(.+)$/', $line ) &&
				! preg_match( '/^===/', $line ) &&
				! preg_match( '/^==/', $line ) ) {
				$this->readme_data['description'] = $line;
			}
		}

		// Set defaults if not found.
		$this->set_defaults();

		return $this->readme_data;
	}

	/**
	 * Set default values for missing fields.
	 */
	private function set_defaults() {
		$defaults = array(
			'plugin_name' => 'Searchcraft',
			'plugin_uri'  => 'https://github.com/searchcraft-inc/searchcraft-wordpress',
			'description' => 'Bring fast, relevant search to your site. Searchcraft replaces the default search with a customizable, tunable, highly relevant search experience.',
			'version'     => '1.0.0',
			'author'      => 'Searchcraft, Inc.',
			'author_uri'  => 'https://searchcraft.io/',
			'license'     => 'Apache 2.0',
			'license_uri' => 'LICENSE.txt',
			'text_domain' => 'searchcraft',
			'domain_path' => '/languages',
		);

		foreach ( $defaults as $key => $value ) {
			if ( empty( $this->readme_data[ $key ] ) ) {
				$this->readme_data[ $key ] = $value;
			}
		}

		// Keep the original license from readme.txt.
		// Only set default license URI if none is provided.
		if ( empty( $this->readme_data['license_uri'] ) ) {
			// Set appropriate license URI based on the license type.
			if ( 'Apache 2.0' === $this->readme_data['license'] ) {
				$this->readme_data['license_uri'] = 'http://www.apache.org/licenses/LICENSE-2.0.txt';
			} elseif ( false !== strpos( $this->readme_data['license'], 'GPL' ) ) {
				$this->readme_data['license_uri'] = 'http://www.gnu.org/licenses/gpl-2.0.txt';
			} else {
				// Default to GPL if unknown license type.
				$this->readme_data['license_uri'] = 'http://www.gnu.org/licenses/gpl-2.0.txt';
			}
		}

		// Set author URI if not set.
		if ( empty( $this->readme_data['author_uri'] ) ) {
			$this->readme_data['author_uri'] = $this->readme_data['plugin_uri'];
		}
	}

	/**
	 * Update the plugin header in the main plugin file.
	 *
	 * @return bool True on success.
	 * @throws Exception If plugin file is not found or cannot be written.
	 */
	public function update_plugin_header() {
		if ( ! file_exists( $this->plugin_path ) ) {
			throw new Exception( 'Plugin file not found at: ' . htmlspecialchars( $this->plugin_path, ENT_QUOTES, 'UTF-8' ) );
		}

		$content          = file_get_contents( $this->plugin_path );
		$lines            = explode( "\n", $content );
		$updated_lines    = array();
		$in_plugin_header = false;
		$header_updated   = false;

		foreach ( $lines as $line ) {
			// Check if we're starting the plugin header section.
			if ( false !== strpos( $line, '@wordpress-plugin' ) ) {
				$in_plugin_header = true;
				$updated_lines[]  = $line;
				// Add the new header lines.
				$header_lines = $this->build_plugin_header();
				foreach ( $header_lines as $header_line ) {
					$updated_lines[] = $header_line;
				}
				$header_updated = true;
				continue;
			}

			// Skip existing header lines until we reach the closing */.
			if ( $in_plugin_header ) {
				if ( false !== strpos( $line, '*/' ) ) {
					$in_plugin_header = false;
					$updated_lines[]  = $line;
				}
				// Skip the old header lines.
				continue;
			}

			// Keep all other lines.
			$updated_lines[] = $line;
		}

		if ( ! $header_updated ) {
			throw new Exception( 'Could not find @wordpress-plugin header to update' );
		}

		$updated_content = implode( "\n", $updated_lines );

		// Write the updated content back to the file.
		if ( false === file_put_contents( $this->plugin_path, $updated_content ) ) {
			throw new Exception( 'Failed to write updated content to plugin file' );
		}

		return true;
	}

	/**
	 * Build the plugin header string.
	 *
	 * @return array Array of header lines.
	 */
	private function build_plugin_header() {
		$header_lines   = array();
		$header_lines[] = ' * Plugin Name:       ' . $this->readme_data['plugin_name'];
		$header_lines[] = ' * Plugin URI:        ' . $this->readme_data['plugin_uri'];
		$header_lines[] = ' * Description:       ' . $this->readme_data['description'];
		$header_lines[] = ' * Version:           ' . $this->readme_data['version'];
		$header_lines[] = ' * Author:            ' . $this->readme_data['author'];
		$header_lines[] = ' * Author URI:        ' . $this->readme_data['author_uri'];
		$header_lines[] = ' * License:           ' . $this->readme_data['license'];
		$header_lines[] = ' * License URI:       ' . $this->readme_data['license_uri'];
		$header_lines[] = ' * Text Domain:       ' . $this->readme_data['text_domain'];
		$header_lines[] = ' * Domain Path:       ' . $this->readme_data['domain_path'];

		return $header_lines;
	}

	/**
	 * Run the update process.
	 */
	public function run() {
		try {
			echo 'Parsing readme.txt...' . "\n";
			$this->parse_readme();

			echo 'Updating plugin header...' . "\n";
			$this->update_plugin_header();

			echo 'Plugin header updated successfully!' . "\n";
			echo 'Updated with:' . "\n";
			foreach ( $this->readme_data as $key => $value ) {
				echo '  ' . htmlspecialchars( $key, ENT_QUOTES, 'UTF-8' ) . ': ' . htmlspecialchars( $value, ENT_QUOTES, 'UTF-8' ) . "\n";
			}
		} catch ( Exception $e ) {
			echo 'Error: ' . htmlspecialchars( $e->getMessage(), ENT_QUOTES, 'UTF-8' ) . "\n";
			exit( 1 );
		}
	}
}

// Run the updater if this script is called directly.
$script_name = $_SERVER['SCRIPT_NAME'] ?? '';
if ( basename( __FILE__ ) === basename( $script_name ) ) {
	$updater = new PluginHeaderUpdater();
	$updater->run();
}
