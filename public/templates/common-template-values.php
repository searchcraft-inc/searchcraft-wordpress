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

$is_configured                            = class_exists( 'Searchcraft_Config' ) && Searchcraft_Config::is_configured();
$input_horizontal_padding                 = get_option( 'searchcraft_input_padding', '50' );
$input_vertical_padding                   = get_option( 'searchcraft_input_vertical_padding', '0' );
$searchcraft_brand_color                  = get_option( 'searchcraft_brand_color', '#000000' );
$searchcraft_result_info_text_color       = get_option( 'searchcraft_result_info_text_color', '#6C757D' );
$searchcraft_cortex_url                   = Searchcraft_Config::get( 'cortex_url', '' );
$searchcraft_summary_background_color     = get_option( 'searchcraft_summary_background_color', '#e0dcdc' );
$searchcraft_summary_border_color         = get_option( 'searchcraft_summary_border_color', '#E0E0E0' );
$searchcraft_summary_title_color          = get_option( 'searchcraft_summary_title_color', '#000000' );
$searchcraft_summary_text_color           = get_option( 'searchcraft_summary_text_color', '#4C6876' );
$searchcraft_summary_box_border_radius    = get_option( 'searchcraft_summary_box_border_radius', '12' );
$searchcraft_enable_ai_summary            = get_option( 'searchcraft_enable_ai_summary', false );
$searchcraft_ai_summary_banner            = get_option( 'searchcraft_ai_summary_banner', get_bloginfo( 'name' ) );
$searchcraft_input_border_radius          = get_option( 'searchcraft_input_border_radius', '' );
$searchcraft_search_icon_color            = get_option( 'searchcraft_search_icon_color', '#000000' );
$searchcraft_clear_icon_color             = get_option( 'searchcraft_clear_icon_color', '#000000' );
$searchcraft_toggle_button_disabled_color = get_option( 'searchcraft_toggle_button_disabled_color', '#E0E0E0' );
$searchcraft_filter_label_color           = get_option( 'searchcraft_filter_label_color', '#000000' );
$search_experience                        = get_option( 'searchcraft_search_experience', 'full' );
$search_behavior                          = get_option( 'searchcraft_search_behavior', 'on_page' );
$search_placeholder                       = get_option( 'searchcraft_search_placeholder', 'Search...' );
$searchcraft_include_filter_panel         = get_option( 'searchcraft_include_filter_panel', false );
$searchcraft_input_width                  = get_option( 'searchcraft_input_width', '100' );
$searchcraft_result_orientation           = get_option( 'searchcraft_result_orientation', 'column' );
$value_attr                               = '';
if ( is_search() ) {
	$search_query = get_search_query( true );
	if ( ! empty( $search_query ) ) {
		$value_attr = ' value="' . esc_attr( $search_query ) . '"';
	}
}
