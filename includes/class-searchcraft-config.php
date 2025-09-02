<?php
/**
 * The file that defines the Searchcraft configuration management functionality
 *
 * A class definition that includes attributes and functions used for
 * managing Searchcraft configuration values securely.
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
 * Searchcraft configuration management
 *
 * This class handles the secure storage and retrieval of Searchcraft
 * configuration values including API keys, endpoint URL, and index ID.
 *
 * @since      1.0.0
 * @package    Searchcraft
 * @subpackage Searchcraft/includes
 * @author     Searchcraft, Inc.
 */
class Searchcraft_Config {

	/**
	 * Option name for storing Searchcraft configuration.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	const OPTION_NAME = 'searchcraft_config';

	/**
	 * Default configuration values.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	private static $defaults = array(
		'read_key'     => '',
		'ingest_key'   => '',
		'endpoint_url' => '',
		'index_id'     => '',
		'cortex_url'   => '',
	);

	/**
	 * Encryption method for sensitive data.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	const ENCRYPTION_METHOD = 'aes-256-cbc';

	/**
	 * Prefix for encrypted values to identify them.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	const ENCRYPTED_PREFIX = 'sc_encrypted:';

	/**
	 * Generate encryption key based on WordPress salts.
	 *
	 * @since 1.0.0
	 * @return string The encryption key.
	 */
	private static function get_encryption_key() {
		// Check if WordPress functions are available.
		if ( ! function_exists( 'wp_salt' ) ) {
			// Fallback to WordPress constants if wp_salt() isn't available.
			$salt = '';
			if ( defined( 'AUTH_SALT' ) ) {
				$salt .= AUTH_SALT;
			}
			if ( defined( 'SECURE_AUTH_SALT' ) ) {
				$salt .= SECURE_AUTH_SALT;
			}

			// If no salts are available, use a basic fallback.
			if ( empty( $salt ) ) {
				$salt = 'searchcraft_fallback_salt_' . ( defined( 'ABSPATH' ) ? ABSPATH : __DIR__ );
			}
		} else {
			$salt = wp_salt( 'auth' ) . wp_salt( 'secure_auth' );
		}

		return hash( 'sha256', $salt . 'searchcraft_key_encryption' );
	}

	/**
	 * Encrypt sensitive data.
	 *
	 * @since 1.0.0
	 * @param string $data The data to encrypt.
	 * @return string The encrypted data with prefix.
	 */
	private static function encrypt_data( $data ) {
		if ( empty( $data ) || ! function_exists( 'openssl_encrypt' ) ) {
			return $data;
		}

		$key       = self::get_encryption_key();
		$iv        = openssl_random_pseudo_bytes( openssl_cipher_iv_length( self::ENCRYPTION_METHOD ) );
		$encrypted = openssl_encrypt( $data, self::ENCRYPTION_METHOD, $key, 0, $iv );

		if ( false === $encrypted ) {
			return $data; // Return original data if encryption fails.
		}

		return self::ENCRYPTED_PREFIX . base64_encode( $iv . $encrypted );
	}

	/**
	 * Decrypt sensitive data.
	 *
	 * @since 1.0.0
	 * @param string $data The data to decrypt.
	 * @return string The decrypted data.
	 */
	private static function decrypt_data( $data ) {
		if ( empty( $data ) || ! function_exists( 'openssl_decrypt' ) ) {
			return $data;
		}

		// Check if data is encrypted.
		if ( 0 !== strpos( $data, self::ENCRYPTED_PREFIX ) ) {
			return $data; // Not encrypted, return as-is.
		}

		$encrypted_data = base64_decode( substr( $data, strlen( self::ENCRYPTED_PREFIX ) ) );
		if ( false === $encrypted_data ) {
			return $data; // Invalid base64, return original.
		}

		$key       = self::get_encryption_key();
		$iv_length = openssl_cipher_iv_length( self::ENCRYPTION_METHOD );
		$iv        = substr( $encrypted_data, 0, $iv_length );
		$encrypted = substr( $encrypted_data, $iv_length );

		$decrypted = openssl_decrypt( $encrypted, self::ENCRYPTION_METHOD, $key, 0, $iv );

		return false !== $decrypted ? $decrypted : $data;
	}



	/**
	 * Get a specific configuration value.
	 *
	 * @since 1.0.0
	 * @param string $key     The configuration key to retrieve.
	 * @param mixed  $default_value Default value if key doesn't exist.
	 * @return mixed The configuration value.
	 */
	public static function get( $key, $default_value = null ) {
		$config = get_option( self::OPTION_NAME, self::$defaults );

		if ( isset( $config[ $key ] ) ) {
			$value = $config[ $key ];

			// Decrypt sensitive keys.
			if ( in_array( $key, array( 'read_key', 'ingest_key' ), true ) ) {
				$value = self::decrypt_data( $value );
			}

			return $value;
		}

		if ( null !== $default_value ) {
			return $default_value;
		}

		return isset( self::$defaults[ $key ] ) ? self::$defaults[ $key ] : null;
	}

	/**
	 * Set a specific configuration value.
	 *
	 * @since 1.0.0
	 * @param string $key   The configuration key to set.
	 * @param mixed  $value The value to set.
	 * @return bool True on success, false on failure.
	 */
	public static function set( $key, $value ) {
		$config        = get_option( self::OPTION_NAME, self::$defaults );
		$value_to_save = $value;

		// Encrypt sensitive keys.
		if ( in_array( $key, array( 'read_key', 'ingest_key' ), true ) && ! empty( $value ) ) {
			$value_to_save = self::encrypt_data( $value );
		}

		$config[ $key ] = $value_to_save;

		return update_option( self::OPTION_NAME, $config );
	}

	/**
	 * Set multiple configuration values at once.
	 *
	 * @since 1.0.0
	 * @param array $values Associative array of key-value pairs.
	 * @return bool True on success, false on failure.
	 */
	public static function set_multiple( $values ) {
		$config = get_option( self::OPTION_NAME, self::$defaults );

		foreach ( $values as $key => $value ) {
			if ( array_key_exists( $key, self::$defaults ) ) {
				$value_to_save = $value;

				// Encrypt sensitive keys.
				if ( in_array( $key, array( 'read_key', 'ingest_key' ), true ) && ! empty( $value ) ) {
					$value_to_save = self::encrypt_data( $value );
				}

				$config[ $key ] = $value_to_save;
			}
		}

		return update_option( self::OPTION_NAME, $config );
	}

	/**
	 * Get all configuration values.
	 *
	 * @since 1.0.0
	 * @return array All configuration values.
	 */
	public static function get_all() {
		$config = get_option( self::OPTION_NAME, self::$defaults );

		// Decrypt sensitive keys.
		foreach ( array( 'read_key', 'ingest_key' ) as $sensitive_key ) {
			if ( isset( $config[ $sensitive_key ] ) ) {
				$config[ $sensitive_key ] = self::decrypt_data( $config[ $sensitive_key ] );
			}
		}

		return $config;
	}

	/**
	 * Reset configuration to defaults.
	 *
	 * @since 1.0.0
	 * @return bool True on success, false on failure.
	 */
	public static function reset() {
		return update_option( self::OPTION_NAME, self::$defaults );
	}

	/**
	 * Delete all configuration.
	 *
	 * @since 1.0.0
	 * @return bool True on success, false on failure.
	 */
	public static function delete() {
		return delete_option( self::OPTION_NAME );
	}

	/**
	 * Validate configuration values.
	 *
	 * @since 1.0.0
	 * @param array $config Configuration array to validate.
	 * @return array Array of validation errors, empty if valid.
	 */
	public static function validate( $config ) {
		$errors = array();

		if ( isset( $config['endpoint_url'] ) && ! empty( $config['endpoint_url'] ) ) {
			if ( ! filter_var( $config['endpoint_url'], FILTER_VALIDATE_URL ) ) {
				$errors['endpoint_url'] = 'Invalid endpoint URL format.';
			}
		}

		if ( isset( $config['index_id'] ) && ! empty( $config['index_id'] ) ) {
			if ( ! preg_match( '/^[a-zA-Z0-9_-]+$/', $config['index_id'] ) ) {
				$errors['index_id'] = 'Index ID can only contain letters, numbers, underscores, and hyphens.';
			}
		}

		foreach ( array( 'read_key', 'ingest_key' ) as $key_field ) {
			if ( isset( $config[ $key_field ] ) && ! empty( $config[ $key_field ] ) ) {
				if ( strlen( $config[ $key_field ] ) < 10 ) {
					$errors[ $key_field ] = 'API key appears to be too short.';
				}
			}
		}

		return $errors;
	}

	/**
	 * Check if configuration is complete.
	 *
	 * @since 1.0.0
	 * @return bool True if all required values are set.
	 */
	public static function is_configured() {
		$config = self::get_all();

		$required_fields = array( 'endpoint_url', 'index_id', 'read_key', 'ingest_key' );

		foreach ( $required_fields as $field ) {
			if ( empty( $config[ $field ] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Get the read key.
	 *
	 * @since 1.0.0
	 * @return string The read key.
	 */
	public static function get_read_key() {
		return self::get( 'read_key' );
	}

	/**
	 * Get the ingest key.
	 *
	 * @since 1.0.0
	 * @return string The ingest key.
	 */
	public static function get_ingest_key() {
		return self::get( 'ingest_key' );
	}

	/**
	 * Get the endpoint URL.
	 *
	 * @since 1.0.0
	 * @return string The endpoint URL.
	 */
	public static function get_endpoint_url() {
		return self::get( 'endpoint_url' );
	}

	/**
	 * Get the index ID.
	 *
	 * @since 1.0.0
	 * @return string The index ID.
	 */
	public static function get_index_id() {
		return self::get( 'index_id' );
	}

	/**
	 * Set the read key.
	 *
	 * @since 1.0.0
	 * @param string $key The read key.
	 * @return bool True on success, false on failure.
	 */
	public static function set_read_key( $key ) {
		return self::set( 'read_key', sanitize_text_field( $key ) );
	}

	/**
	 * Set the ingest key.
	 *
	 * @since 1.0.0
	 * @param string $key The ingest key.
	 * @return bool True on success, false on failure.
	 */
	public static function set_ingest_key( $key ) {
		return self::set( 'ingest_key', sanitize_text_field( $key ) );
	}

	/**
	 * Set the endpoint URL.
	 *
	 * @since 1.0.0
	 * @param string $url The endpoint URL.
	 * @return bool True on success, false on failure.
	 */
	public static function set_endpoint_url( $url ) {
		return self::set( 'endpoint_url', esc_url_raw( $url ) );
	}

	/**
	 * Set the index ID.
	 *
	 * @since 1.0.0
	 * @param string $id The index ID.
	 * @return bool True on success, false on failure.
	 */
	public static function set_index_id( $id ) {
		return self::set( 'index_id', sanitize_text_field( $id ) );
	}

	/**
	 * Check if encryption is supported on this system.
	 *
	 * @since 1.0.0
	 * @return bool True if encryption is supported, false otherwise.
	 */
	public static function is_encryption_supported() {
		return function_exists( 'openssl_encrypt' ) &&
			function_exists( 'openssl_decrypt' ) &&
			function_exists( 'openssl_random_pseudo_bytes' ) &&
			in_array( self::ENCRYPTION_METHOD, openssl_get_cipher_methods(), true );
	}

	/**
	 * Migrate existing plaintext keys to encrypted format.
	 *
	 * This method checks if keys are stored in plaintext and encrypts them.
	 * Should be called during plugin activation or upgrade.
	 *
	 * @since 1.0.0
	 * @return bool True if migration was performed or not needed, false on failure.
	 */
	public static function migrate_keys_to_encrypted() {
		// Skip migration if encryption is not supported.
		if ( ! self::is_encryption_supported() ) {
			return true;
		}

		$config  = get_option( self::OPTION_NAME, self::$defaults );
		$updated = false;

		foreach ( array( 'read_key', 'ingest_key' ) as $key_name ) {
			if ( isset( $config[ $key_name ] ) && ! empty( $config[ $key_name ] ) ) {
				// Check if the key is already encrypted.
				if ( 0 !== strpos( $config[ $key_name ], self::ENCRYPTED_PREFIX ) ) {
					// Key is in plaintext, encrypt it.
					$config[ $key_name ] = self::encrypt_data( $config[ $key_name ] );
					$updated             = true;
				}
			}
		}

		if ( $updated ) {
			return update_option( self::OPTION_NAME, $config );
		}

		return true; // No migration needed.
	}
}
