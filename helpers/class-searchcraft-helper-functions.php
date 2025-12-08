<?php
/**
 * The file that defines helper functions for the plugin
 *
 * A class definition that includes various helper functions used
 * throughout the plugin for common operations.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/helpers
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared

/**
 * Helper functions
 *
 * This class defines various helper functions used throughout the plugin
 * for common operations and utilities.
 *
 * @since      1.0.0
 * @package    Searchcraft
 * @subpackage Searchcraft/helpers
 * @author     Searchcraft <support@searchcraft.io>
 */
class Searchcraft_Helper_Functions {

	/**
	 * Get the default field options for a given field type.
	 *
	 * @since 1.0.0
	 * @param string $field_type The type of the field (e.g. 'text', 'facet', 'datetime').
	 * @return array The default configuration options for the field.
	 */
	public static function searchcraft_get_default_field_options( $field_type ) {
		switch ( $field_type ) {
			case 'facet':
				return array(
					'stored' => true,
					'multi'  => false,
				);
			case 'multi-text':
				// Internal special case for flat taxonomies (e.g., post tags)
				// Treated as a multi-valued searchable text field on the client.
				return array(
					'type'    => 'text',
					'stored'  => true,
					'indexed' => true,
					'multi'   => true,
				);
			case 'bool':
			case 'datetime':
			case 'i64':
			case 'u64':
			case 'f64':
				return array(
					'stored'   => true,
					'indexed'  => true,
					'fast'     => true,
					'required' => false,
				);
			default:
				// Default for all other types, including 'text' and unknowns.
				return array(
					'stored'  => true,
					'indexed' => true,
					'multi'   => false,
				);

		}
	}

	/**
	 * Determine if a given value is a valid date.
	 *
	 * Checks if a string can be interpreted as a valid date,
	 *
	 * @param string $value The value to check.
	 * supporting both `YYYYMMDD` format and common parsable date formats
	 * using `strtotime()`. It also ensures round-trip conversion integrity.
	 *
	 * @since 1.0.0
	 * @var mixed $value The value to check.
	 * @return bool True if the value is a valid date, false otherwise.
	 */
	public static function searchcraft_is_valid_date_format( $value ) {
		// Check if the value matches the strict YYYYMMDD format.
		if ( preg_match( '/^\d{8}$/', $value ) ) {
			// Create a DateTime object from the value and ensure the round trip matches.
			$d = DateTime::createFromFormat( 'Ymd', $value );
			return $d && $d->format( 'Ymd' ) === $value;
		}

		// Attempt to parse the value using strtotime (handles various common formats).
		$timestamp = strtotime( $value );

		if ( false === $timestamp ) {
			return false; // Not a valid date format, return.
		}

		// Convert back to a date string and re-parse to confirm consistency.
		$check = gmdate( 'Y-m-d', $timestamp );

		return strtotime( $check ) !== false;
	}

	/**
	 * Detect the appropriate field type based on a sample value.
	 *
	 * Infers the type of data (e.g., boolean, datetime, number, or text)
	 * from a given string input.
	 * This is useful when auto-generating index schemas.
	 *
	 * @since 1.0.0
	 * @param mixed $sample_value A string value representing a typical value for the field.
	 * @return string The detected field type: 'bool', 'datetime', 'f64', 'u64', 'i64', or 'text'.
	 */
	public static function searchcraft_detect_field_type( $sample_value ) {
		$sample_value = trim( $sample_value );
		$lower        = strtolower( $sample_value );

		// Check if the value matches common truthy or falsy keywords.
		$truthy_vals = array( 'true', '1', 'yes', 'on' );
		$falsy_vals  = array( 'false', '0', 'no', 'off' );

		if ( in_array( $lower, $truthy_vals, true ) || in_array( $lower, $falsy_vals, true ) ) {
			return 'bool';
		}

		// Check if the value is a recognizable date format.
		if ( self::searchcraft_is_valid_date_format( $sample_value ) ) {
			return 'datetime';
		}

		// Check if the value is numeric.
		if ( is_numeric( $sample_value ) ) {
			// If it contains a decimal point or exponential notation, it's a float.
			if ( strpos( $sample_value, '.' ) !== false || stripos( $sample_value, 'e' ) !== false ) {
				return 'f64';
			}

			// Otherwise, determine "signedness" using bccomp for arbitrary precision comparison.
			if ( bccomp( $sample_value, '0' ) >= 0 ) {
				return 'u64'; // Unsigned integer.
			} else {
				return 'i64'; // Signed integer.
			}
		}

		// Fallback to text.
		return 'text';
	}

	/**
	 * Get the associated meta keys and a sample value for a given post type.
	 *
	 * Retrieves all distinct custom meta keys for the most recent posts
	 * of a given post type.
	 * It excludes private meta keys (those prefixed with an underscore), and only
	 * includes those with non-empty, non-null values.
	 * A sample value is also fetched for each key to assist with field type detection.
	 *
	 * @since 1.0.0
	 * @param string $post_type The post type to retrieve meta keys for.
	 * @return array An associative array of meta keys with sample values.
	 */
	public static function searchcraft_get_meta_keys_for_post_type( $post_type ) {
		// Create a transient key to store/retrieve the meta keys from transient cache.
		$transient_key = '_searchcraft_meta_keys_for_' . $post_type;
		$meta_keys     = get_transient( $transient_key );

		if ( $meta_keys ) {
			if ( ! is_array( $meta_keys ) ) {
				// If the cached data is not an array, reset the transient.
				delete_transient( 'searchcraft_index' );
				$meta_keys = null; // Re-fetch index from the client.
			} else {
				return $meta_keys;
			}
		}

		global $wpdb;

		// Get the IDs of the most recent 10 posts of the given post type.
		// Include publish, draft, pending, and private statuses to ensure we find custom fields.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$post_ids = $wpdb->get_col(
			$wpdb->prepare(
				"
                SELECT ID FROM $wpdb->posts
                WHERE post_type = %s
                AND post_status IN ('publish', 'draft', 'pending', 'private')
                ORDER BY post_date DESC
                LIMIT 10
            ",
				$post_type
			)
		);

		// If no posts are found, return an empty array.
		if ( empty( $post_ids ) ) {
			return array();
		}

		// Sanitize post IDs to ensure they are integers.
		$post_ids = array_map( 'absint', $post_ids );
		$post_ids = array_filter( $post_ids ); // Remove any zero values.

		if ( empty( $post_ids ) ) {
			return array();
		}

		// Create placeholders for the IN clause.
		$placeholders = implode( ', ', array_fill( 0, count( $post_ids ), '%d' ) );

		/**
		 * Query to fetch meta keys from the wp_postmeta table.
		 *
		 * Meta keys should fit these criteria:
		 * - Be distinct
		 * - Not start with an underscore
		 * - Have non-null, non-empty meta values
		 */
		$sql = "
            SELECT DISTINCT meta_key FROM $wpdb->postmeta
            WHERE post_id IN ($placeholders)
                AND meta_key NOT LIKE '\\_%'
                AND meta_value IS NOT NULL
                AND meta_value != ''
        ";

		// Use wpdb->prepare with the spread operator for safer parameter binding.
		$prepared_sql = $wpdb->prepare( $sql, ...$post_ids ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
		$meta_keys = $wpdb->get_col( $prepared_sql );

		$meta_keys_with_sample_values = array();

		// For each meta_key, fetch a sample value to detect its type.
		// The meta value must not be NULL or an empty string.
		foreach ( $meta_keys as $meta_key ) {
			$sql_sample = "
                SELECT meta_value
                FROM $wpdb->postmeta
                WHERE meta_key = %s
                    AND post_id IN ($placeholders)
                    AND meta_value IS NOT NULL
                    AND meta_value != ''
                LIMIT 1
            ";

			// Prepare parameters: meta_key first, then all post_ids.
			$prepare_params = array_merge( array( $meta_key ), $post_ids );

			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$sample_value = $wpdb->get_var(
				$wpdb->prepare( $sql_sample, ...$prepare_params ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			);

			// Store the meta key and its sample value.
			$meta_keys_with_sample_values[ $meta_key ] = array(
				'sample' => $sample_value,
			);
		}

		// Cache the meta keys for a day.
		set_transient( $transient_key, $meta_keys_with_sample_values, DAY_IN_SECONDS );

		return $meta_keys_with_sample_values;
	}

	/**
	 * Format and log errors from client requests.
	 *
	 * Example log output:
	 * [2025-06-19 12:30:00] [Searchcraft error]: Something went wrong in the client request.
	 * [2025-06-19 12:30:00] [Searchcraft error details]: {
	 *   "code": 400,
	 *   "message": "Bad Request",
	 *   "details": "Invalid input parameters."
	 * }
	 * [2025-06-19 12:30:00] [Searchcraft custom error message]: Custom error information here.
	 *
	 * @since 1.0.0
	 * @param \Exception|string $e              The exception object or error message to log.
	 * @param string            $custom_message A custom error message to be logged alongside the exception.
	 */
	public static function searchcraft_error_log( $e, $custom_message = '' ) {
		// Add a timestamp for when the error occurred.
		$timestamp = gmdate( 'Y-m-d H:i:s' );

		// Handle both Exception objects and string messages.
		if ( is_string( $e ) ) {
			// If it's a string, log it directly.
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			error_log( "[{$timestamp}] [Searchcraft log]: " . $e . "\n" );
		} elseif ( $e instanceof \Exception ) {
			// Log the main exception message.
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			error_log( "[{$timestamp}] [Searchcraft log]: " . $e->getMessage() . "\n" );

			// Log additional error data if available and the method exists.
			if ( method_exists( $e, 'getErrorData' ) ) {
				$e_data = $e->getErrorData();
				if ( ! empty( $e_data ) ) {
					// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
					error_log( "[{$timestamp}] [Searchcraft log details]: " . wp_json_encode( $e_data, JSON_PRETTY_PRINT ) . "\n" );
				}
			}
		} else {
			// Fallback for other types.
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log, WordPress.PHP.DevelopmentFunctions.error_log_print_r
			error_log( "[{$timestamp}] [Searchcraft log]: " . print_r( $e, true ) . "\n" );
		}

		// Log the custom message if provided.
		if ( ! empty( $custom_message ) ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			error_log( "[{$timestamp}] [Searchcraft custom message]: " . $custom_message . "\n" );
		}
	}

	/**
	 * Attempts to extract or infer two-way synonyms from a given synonyms list.
	 *
	 * This checks:
	 * - If a value is a single-item array (e.g., ['car' => ['automobile']]), it assumes it's two-way.
	 * - If a value is a string (e.g., ['car' => 'automobile']), it avoids mirrored duplicates
	 *   like ['car' => 'automobile', 'automobile' => 'car'] by keeping only one direction.
	 *
	 * @since 1.0.0
	 * @param array $synonyms The list of base word => synonym(s) pairs.
	 * @return array The filtered list of suggested two-way synonyms.
	 */
	public static function searchcraft_suggest_two_way_synonyms( $synonyms ) {
		$two_way_synonyms = array();

		foreach ( $synonyms as $key => $value ) {
			if ( is_array( $value ) && count( $value ) === 1 ) {
				// Consider single-item arrays as two-way candidates.
				$two_way_synonyms[ $key ] = $value;
			} elseif ( is_string( $value ) ) {
				// Avoid mirrored duplicates like array( 'a' => 'b', 'b' => 'a' ).
				if ( ! isset( $synonyms[ $value ] ) || $synonyms[ $value ] !== $key ) {
					$two_way_synonyms[ $key ] = $value;
				}
			}
		}

		return $two_way_synonyms;
	}
}
