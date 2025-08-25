<?php
/**
 * Template Common Imports
 *
 * Sets values shared by search-header and search-footer templates
 *
 * @link        https://searchcraft.io
 * @since       1.0.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/public/templates
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$is_configured                        = class_exists( 'Searchcraft_Config' ) && Searchcraft_Config::is_configured();
$input_horizontal_padding             = get_option( 'searchcraft_input_padding', '50' );
$input_vertical_padding               = get_option( 'searchcraft_input_vertical_padding', '0' );
$searchcraft_brand_color              = get_option( 'searchcraft_brand_color', '#000000' );
$searchcraft_cortex_url               = Searchcraft_Config::get( 'cortex_url', '' );
$searchcraft_summary_background_color = get_option( 'searchcraft_summary_background_color', '#e0dcdc' );
$searchcraft_summary_border_color     = get_option( 'searchcraft_summary_border_color', '#E0E0E0' );
$searchcraft_enable_ai_summary        = get_option( 'searchcraft_enable_ai_summary', false );
$searchcraft_ai_summary_banner        = get_option( 'searchcraft_ai_summary_banner', get_bloginfo( 'name' ) );
$searchcraft_input_border_radius      = get_option( 'searchcraft_input_border_radius', '' );
$search_experience                    = get_option( 'searchcraft_search_experience', 'full' );
$search_placeholder                   = get_option( 'searchcraft_search_placeholder', 'Search...' );
$searchcraft_include_filter_panel     = get_option( 'searchcraft_include_filter_panel', false );
