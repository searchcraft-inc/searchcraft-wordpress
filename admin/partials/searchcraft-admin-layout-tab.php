<?php
/**
 * The layout tab for Searchcraft settings.
 *
 * This file contains the search form display and search results display settings.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/admin/partials
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$is_configured = Searchcraft_Config::is_configured();

// Get layout settings if configured.
$search_experience         = 'full';
$include_filter_panel      = false;
$results_per_page          = 10;
$enable_most_recent_toggle = true;
$enable_exact_match_toggle = true;
$enable_date_range         = true;
$enable_facets             = true;
$hide_uncategorized        = false;
$enable_post_type_filter   = false;

if ( $is_configured ) {
	$search_experience         = get_option( 'searchcraft_search_experience', 'full' );
	$include_filter_panel      = get_option( 'searchcraft_include_filter_panel', false );
	$results_per_page          = get_option( 'searchcraft_results_per_page', 10 );
	$enable_most_recent_toggle = get_option( 'searchcraft_enable_most_recent_toggle', '1' );
	$enable_exact_match_toggle = get_option( 'searchcraft_enable_exact_match_toggle', '1' );
	$enable_date_range         = get_option( 'searchcraft_enable_date_range', '1' );
	$enable_facets             = get_option( 'searchcraft_enable_facets', '1' );
	$hide_uncategorized        = get_option( 'searchcraft_hide_uncategorized', false );
	$enable_post_type_filter   = get_option( 'searchcraft_enable_post_type_filter', false );
}

// Check if custom post types are enabled.
$selected_custom_post_types = get_option( 'searchcraft_custom_post_types', array() );
$has_custom_post_types = ! empty( $selected_custom_post_types );
?>
<div class="searchcraft-layout">
	<?php if ( ! $is_configured ) : ?>
		<div class="notice notice-warning">
			<p><strong>Configuration Required:</strong> Please configure your Searchcraft settings to enable the plugin's functionality. You can do this on the <a href="admin.php?page=searchcraft&tab=config">configuration page</a>.</p>
		</div>
	<?php endif; ?>

	<?php if ( $is_configured ) : ?>
		<form method="post" class="searchcraft-form">
			<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
			<input type="hidden" name="searchcraft_action" value="layout_settings_config" />

		<div class="searchcraft-header-with-button">
			<h2 class="searchcraft-section-heading">Search Form Settings</h2>
			<div class="searchcraft-save-buttons-top">
				<?php submit_button( 'Save All Settings', 'primary', 'searchcraft_save_layout_settings', false ); ?>
			</div>
		</div>
		<div class="searchcraft-overview-search-experience-config">

				<table class="form-table">
					<tbody>
						<tr>
							<th scope="row">
								<label>Search Experience Type</label>
							</th>
							<td>
								<?php
								$search_experience = get_option( 'searchcraft_search_experience', 'full' );
								?>
								<fieldset>
									<legend class="screen-reader-text"><span>Search Experience Type</span></legend>
									<label>
										<input type="radio" name="searchcraft_search_experience" value="full" <?php checked( $search_experience, 'full' ); ?> />
										<strong>Full Experience</strong> - Complete search page with results, filters, and AI summary (if enabled)
									</label>
									<br><br>
									<label>
										<input type="radio" name="searchcraft_search_experience" value="popover" <?php checked( $search_experience, 'popover' ); ?> />
										<strong>Popover</strong> - Compact search overlay that appears on demand
									</label>
								</fieldset>
								<p class="description">
									Choose how you want search to be presented to your users. The full experience provides deep filtering controls while the popover offers a simple, single input experience.
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="searchcraft_search_placeholder">Search Placeholder Text</label>
							</th>
							<td>
								<?php
								$search_placeholder = get_option( 'searchcraft_search_placeholder', 'Search...' );
								?>
								<input type="text" name="searchcraft_search_placeholder" id="searchcraft_search_placeholder" value="<?php echo esc_attr( $search_placeholder ); ?>" class="regular-text" />
								<p class="description">
									The placeholder text that appears in the search input field.
								</p>
							</td>
						</tr>
						<tr class="searchcraft-full-only">
							<th scope="row">
								<label>Search Behavior</label>
							</th>
							<td>
								<?php
								$search_behavior = get_option( 'searchcraft_search_behavior', 'on_page' );
								?>
								<fieldset>
									<legend class="screen-reader-text"><span>Search Behavior</span></legend>
									<label>
										<input type="radio" name="searchcraft_search_behavior" value="on_page" <?php checked( $search_behavior, 'on_page' ); ?> />
										<strong>On Page</strong> - Loads results on any page with the search form. Pushes down the existing layout while displaying search results.
									</label>
									<br><br>
									<label>
										<input type="radio" name="searchcraft_search_behavior" value="stand_alone" <?php checked( $search_behavior, 'stand_alone' ); ?> />
										<strong>Submit to Search Page</strong> - Submits the first search query to the stand-alone search page. From there you can make additional searches.
									</label>
								</fieldset>
							</td>
						</tr>
						<tr class="searchcraft-full-only">
							<th scope="row">
								<label for="searchcraft_input_padding">Input Component Horizontal Padding</label>
							</th>
							<td>
								<?php
								$input_padding = get_option( 'searchcraft_input_padding', '0' );
								?>
								<input type="number" name="searchcraft_input_padding" id="searchcraft_input_padding" value="<?php echo esc_attr( $input_padding ); ?>" class="small-text" min="0" max="200" />
								<span>px</span>
								<p class="description">
									The horizontal (left/right) padding around the search input component (0-200px).
								</p>
							</td>
						</tr>
						<tr class="searchcraft-full-only">
							<th scope="row">
								<label for="searchcraft_input_vertical_padding">Input Component Vertical Padding</label>
							</th>
							<td>
								<?php
								$input_vertical_padding = get_option( 'searchcraft_input_vertical_padding', '0' );
								?>
								<input type="number" name="searchcraft_input_vertical_padding" id="searchcraft_input_vertical_padding" value="<?php echo esc_attr( $input_vertical_padding ); ?>" class="small-text" min="0" max="100" />
								<span>px</span>
								<p class="description">
									The vertical (top/bottom) padding around the search input component (0-100px).
								</p>
							</td>
						</tr>
						<tr class="searchcraft-full-only">
							<th scope="row">
								<label for="searchcraft_input_border_radius">Input Border Radius</label>
							</th>
							<td>
								<?php
								$input_border_radius = get_option( 'searchcraft_input_border_radius', '' );
								?>
								<input type="number" name="searchcraft_input_border_radius" id="searchcraft_input_border_radius" value="<?php echo esc_attr( $input_border_radius ); ?>" class="small-text" min="0" max="1000" />
								<span>px</span>
								<p class="description">
									The border radius for the search input field (0-1000px). Leave empty for default styling.
								</p>
							</td>
						</tr>
						<tr class="searchcraft-full-only">
							<th scope="row">
								<label for="searchcraft_search_icon_color">Search Icon Color</label>
							</th>
							<td>
								<?php
								$search_icon_color = get_option( 'searchcraft_search_icon_color', '#000000' );
								?>
								<input type="color" name="searchcraft_search_icon_color" id="searchcraft_search_icon_color" value="<?php echo esc_attr( $search_icon_color ); ?>" class="searchcraft-color-picker" />
								<input type="text" name="searchcraft_search_icon_color_hex" id="searchcraft_search_icon_color_hex" value="<?php echo esc_attr( $search_icon_color ); ?>" class="regular-text searchcraft-hex-input" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#000000" />
								<p class="description">
									Choose the color for the search icon. You can use the color picker or enter a hex color code directly (e.g., #000000).
								</p>
							</td>
						</tr>
						<tr class="searchcraft-full-only">
							<th scope="row">
								<label for="searchcraft_clear_icon_color">Clear Search Button Color</label>
							</th>
							<td>
								<?php
								$clear_icon_color = get_option( 'searchcraft_clear_icon_color', '#000000' );
								?>
								<input type="color" name="searchcraft_clear_icon_color" id="searchcraft_clear_icon_color" value="<?php echo esc_attr( $clear_icon_color ); ?>" class="searchcraft-color-picker" />
								<input type="text" name="searchcraft_clear_icon_color_hex" id="searchcraft_clear_icon_color_hex" value="<?php echo esc_attr( $clear_icon_color ); ?>" class="regular-text searchcraft-hex-input" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#000000" />
								<p class="description">
									Choose the color for the clear search button icon. You can use the color picker or enter a hex color code directly (e.g., #000000).
								</p>
							</td>
						</tr>
						<tr class="searchcraft-popover-only">
							<th scope="row">
								<label for="searchcraft_input_width">Input Width</label>
							</th>
							<td>
								<?php
								$input_width = get_option( 'searchcraft_input_width', '100' );
								?>
								<input type="number" name="searchcraft_input_width" id="searchcraft_input_width" value="<?php echo esc_attr( $input_width ); ?>" class="small-text" min="1" max="100" />
								<span>%</span>
								<p class="description">
									The width of the search input field as a percentage (1-100%).
								</p>
							</td>
						</tr>
					</tbody>
				</table>
		</div>

		<h2 class="searchcraft-section-heading">Search Results Settings</h2>
		<div class="searchcraft-overview-search-results-config">
			<p class="results-description">
				These settings only apply to the full search experience. Popover is only customizable via CSS in the advanced settings below.
			</p>

				<table class="form-table">
					<tbody>
						<tr>
							<th scope="row">
								<label for="searchcraft_enable_ai_summary">Enable AI summary</label>
							</th>
							<td>
								<label for="searchcraft_enable_ai_summary">
									<input
										type="checkbox"
										name="searchcraft_enable_ai_summary"
										id="searchcraft_enable_ai_summary"
										value="1"
										<?php checked( get_option( 'searchcraft_enable_ai_summary', false ), true ); ?>
									/>
									Summarize search results with AI.
								</label>
								<p class="description">
									Reach out to <a href="mailto:support@searchcraft.io">support@searchcraft.io</a> Searchcraft support to enable this feature.
								</p>
							</td>
						</tr>
						<tr class="searchcraft-ai-summary-row">
							<th scope="row">
								<label for="searchcraft_ai_summary_banner">AI Summary Banner Text</label>
							</th>
							<td>
								<?php
								$ai_summary_banner = get_option( 'searchcraft_ai_summary_banner', '' );
								?>
								<input type="text" name="searchcraft_ai_summary_banner" id="searchcraft_ai_summary_banner" value="<?php echo esc_attr( $ai_summary_banner ); ?>" class="regular-text" />
								<p class="description">
									The text that appears in the AI summary header banner. If one is not provided, the banner will default to the site name.
								</p>
							</td>
						</tr>
						<tr class="searchcraft-ai-summary-row">
							<th scope="row">
								<label for="searchcraft_summary_box_border_radius">Summary Box Border Radius</label>
							</th>
							<td>
								<?php
								$summary_box_border_radius = get_option( 'searchcraft_summary_box_border_radius', '' );
								?>
								<input type="number" name="searchcraft_summary_box_border_radius" id="searchcraft_summary_box_border_radius" value="<?php echo esc_attr( $summary_box_border_radius ); ?>" class="small-text" min="0" max="1000" />
								<span>px</span>
								<p class="description">
									The border radius for the AI summary box (0-1000px). Leave empty for default styling.
								</p>
							</td>
						</tr>
						<tr class="searchcraft-ai-summary-row">
							<th scope="row">
								<label for="searchcraft_summary_background_color">Summary Box Background</label>
							</th>
							<td>
								<?php
								$summary_background_color = get_option( 'searchcraft_summary_background_color', '#F5F5F5' );
								?>
								<input type="color" name="searchcraft_summary_background_color" id="searchcraft_summary_background_color" value="<?php echo esc_attr( $summary_background_color ); ?>" class="searchcraft-color-picker" />
								<input type="text" name="searchcraft_summary_background_color_hex" id="searchcraft_summary_background_color_hex" value="<?php echo esc_attr( $summary_background_color ); ?>" class="regular-text searchcraft-hex-input" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#F5F5F5" />
								<p class="description">
									Choose the background color for the AI summary box. You can use the color picker or enter a hex color code directly (e.g., #F5F5F5).
								</p>
							</td>
						</tr>
						<tr class="searchcraft-ai-summary-row">
							<th scope="row">
								<label for="searchcraft_summary_border_color">Summary Box Border</label>
							</th>
							<td>
								<?php
								$summary_border_color = get_option( 'searchcraft_summary_border_color', '#E0E0E0' );
								?>
								<input type="color" name="searchcraft_summary_border_color" id="searchcraft_summary_border_color" value="<?php echo esc_attr( $summary_border_color ); ?>" class="searchcraft-color-picker" />
								<input type="text" name="searchcraft_summary_border_color_hex" id="searchcraft_summary_border_color_hex" value="<?php echo esc_attr( $summary_border_color ); ?>" class="regular-text searchcraft-hex-input" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#E0E0E0" />
								<p class="description">
									Choose the border color for the AI summary box. You can use the color picker or enter a hex color code directly (e.g., #E0E0E0).
								</p>
							</td>
						</tr>
						<tr class="searchcraft-ai-summary-row">
							<th scope="row">
								<label for="searchcraft_summary_title_color">Summary Box Title Color</label>
							</th>
							<td>
								<?php
								$summary_title_color = get_option( 'searchcraft_summary_title_color', '#000000' );
								?>
								<input type="color" name="searchcraft_summary_title_color" id="searchcraft_summary_title_color" value="<?php echo esc_attr( $summary_title_color ); ?>" class="searchcraft-color-picker" />
								<input type="text" name="searchcraft_summary_title_color_hex" id="searchcraft_summary_title_color_hex" value="<?php echo esc_attr( $summary_title_color ); ?>" class="regular-text searchcraft-hex-input" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#000000" />
								<p class="description">
									Choose the color for the AI summary box title/headings. You can use the color picker or enter a hex color code directly (e.g., #000000).
								</p>
							</td>
						</tr>
						<tr class="searchcraft-ai-summary-row">
							<th scope="row">
								<label for="searchcraft_summary_text_color">Summary Box Text Color</label>
							</th>
							<td>
								<?php
								$summary_text_color = get_option( 'searchcraft_summary_text_color', '#4C6876' );
								?>
								<input type="color" name="searchcraft_summary_text_color" id="searchcraft_summary_text_color" value="<?php echo esc_attr( $summary_text_color ); ?>" class="searchcraft-color-picker" />
								<input type="text" name="searchcraft_summary_text_color_hex" id="searchcraft_summary_text_color_hex" value="<?php echo esc_attr( $summary_text_color ); ?>" class="regular-text searchcraft-hex-input" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#4C6876" />
								<p class="description">
									Choose the color for the AI summary box text content. You can use the color picker or enter a hex color code directly (e.g., #4C6876).
								</p>
							</td>
						</tr>
						<tr class="searchcraft-section-divider">
							<td colspan="2" style="padding: 1.5rem 1rem 1rem;">
								<div style="border-top: 2px solid var(--scwp-gray-10); padding-top: 1rem;">
									<strong style="color: var(--scwp-gray-50); font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px;">Result Layout Options</strong>
								</div>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label>Result Orientation</label>
							</th>
							<td>
								<?php
								$result_orientation = get_option( 'searchcraft_result_orientation', 'column' );
								?>
								<fieldset>
									<legend class="screen-reader-text"><span>Result Orientation</span></legend>
									<label>
										<input type="radio" name="searchcraft_result_orientation" value="column" <?php checked( $result_orientation, 'column' ); ?> />
										<strong>Column</strong> - Display search results in a single column layout
									</label>
									<br><br>
									<label>
										<input type="radio" name="searchcraft_result_orientation" value="grid" <?php checked( $result_orientation, 'grid' ); ?> />
										<strong>Grid</strong> - Display search results in a multi-column grid layout
									</label>
								</fieldset>
								<p class="description">
									Choose how search results should be displayed. Column layout shows results stacked vertically, while grid layout displays results in a responsive multi-column format.
								</p>
							</td>
						</tr>
						<tr class="searchcraft-column-orientation-option">
							<th scope="row">
								<label>Image Alignment</label>
							</th>
							<td>
								<?php
								$image_alignment = get_option( 'searchcraft_image_alignment', 'left' );
								?>
								<fieldset>
									<legend class="screen-reader-text"><span>Image Alignment</span></legend>
									<label>
										<input type="radio" name="searchcraft_image_alignment" value="left" <?php checked( $image_alignment, 'left' ); ?> />
										<strong>Left</strong> - Images appear on the left side of search results
									</label>
									<br><br>
									<label>
										<input type="radio" name="searchcraft_image_alignment" value="right" <?php checked( $image_alignment, 'right' ); ?> />
										<strong>Right</strong> - Images appear on the right side of search results
									</label>
								</fieldset>
								<p class="description">
									Choose whether images in search results should be aligned to the left or right of the content. Applies to the default template only, if you are using a custom template, you will need to implement this yourself.
								</p>
							</td>
						</tr>
						<tr">
							<th scope="row">
								<label for="searchcraft_display_post_date">Display Post Date</label>
							</th>
							<td>
								<label for="searchcraft_display_post_date">
									<input
										type="checkbox"
										name="searchcraft_display_post_date"
										id="searchcraft_display_post_date"
										value="1"
										<?php checked( get_option( 'searchcraft_display_post_date', false ) ); ?>
									/>
									Show the post date in search results.
								</label>
								<p class="description">
									When enabled, the publication date will be displayed for each search result. Applies to the default template only.
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="searchcraft_display_primary_category">Display Primary Category</label>
							</th>
							<td>
								<label for="searchcraft_display_primary_category">
									<input
										type="checkbox"
										name="searchcraft_display_primary_category"
										id="searchcraft_display_primary_category"
										value="1"
										<?php checked( get_option( 'searchcraft_display_primary_category', true ) ); ?>
									/>
									Show the primary category in search results.
								</label>
								<p class="description">
									When enabled, the primary category will be displayed for each search result. Applies to the default template only.
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="searchcraft_results_per_page">Results Per Page</label>
							</th>
							<td>
								<select name="searchcraft_results_per_page" id="searchcraft_results_per_page" class="regular-text">
									<?php for ( $i = 1; $i <= 100; $i++ ) : ?>
										<option value="<?php echo esc_attr( $i ); ?>" <?php selected( $results_per_page, $i ); ?>><?php echo esc_html( $i ); ?></option>
									<?php endfor; ?>
								</select>
								<p class="description">
									Number of search results to display per page. Default is 10 results per page.
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="searchcraft_brand_color">Brand Color</label>
							</th>
							<td>
								<?php
								$brand_color = get_option( 'searchcraft_brand_color', '#000000' );
								?>
								<input type="color" name="searchcraft_brand_color" id="searchcraft_brand_color" value="<?php echo esc_attr( $brand_color ); ?>" class="searchcraft-color-picker" />
								<input type="text" name="searchcraft_brand_color_hex" id="searchcraft_brand_color_hex" value="<?php echo esc_attr( $brand_color ); ?>" class="regular-text searchcraft-hex-input" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#000000" />
								<p class="description">
									Choose your brand color for search result styling. You can use the color picker or enter a hex color code directly (e.g., #FF5733). This color will be used for filter panel elements and other accent elements in the search results.
								</p>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<label for="searchcraft_result_info_text_color">Result Info Text Color</label>
							</th>
							<td>
								<?php
								$result_info_text_color = get_option( 'searchcraft_result_info_text_color', '#6C757D' );
								?>
								<input type="color" name="searchcraft_result_info_text_color" id="searchcraft_result_info_text_color" value="<?php echo esc_attr( $result_info_text_color ); ?>" class="searchcraft-color-picker" />
								<input type="text" name="searchcraft_result_info_text_color_hex" id="searchcraft_result_info_text_color_hex" value="<?php echo esc_attr( $result_info_text_color ); ?>" class="regular-text searchcraft-hex-input" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#6C757D" />
								<p class="description">
									Choose the text color for the search results info (e.g., "X results found in Yms"). You can use the color picker or enter a hex color code directly (e.g., #6C757D).
								</p>
							</td>
						</tr>
												<tr>
							<th scope="row">
								<label for="searchcraft_include_filter_panel">Include Filter Panel</label>
							</th>
							<td>
								<label for="searchcraft_include_filter_panel">
									<input
										type="checkbox"
										name="searchcraft_include_filter_panel"
										id="searchcraft_include_filter_panel"
										value="1"
										<?php checked( $include_filter_panel, true ); ?>
									/>
									Include advanced filter panel on the search page.
								</label>
								<p class="description">
									When enabled, the search form will include additional filtering options
									such as category filters, date ranges, and other advanced search criteria.
								</p>
							</td>
						</tr>
						<tr class="searchcraft-filter-panel-options" style="<?php echo $include_filter_panel ? '' : 'display:none;'; ?>">
							<th scope="row"></th>
							<td style="padding-left: 2em;">
								<fieldset style="border-left: 3px solid #ddd; padding-left: 1em; margin-left: 0;">
									<legend style="font-weight: 600; margin-bottom: 0.5em;">Filter Panel Options</legend>

									<label for="searchcraft_enable_most_recent_toggle" style="display: block; margin-bottom: 1em;">
										<input
											type="checkbox"
											name="searchcraft_enable_most_recent_toggle"
											id="searchcraft_enable_most_recent_toggle"
											value="1"
											<?php checked( $enable_most_recent_toggle, true ); ?>
										/>
										<strong>Enable Most Recent Filter</strong>
										<p class="description" style="margin: 0.25em 0 0 1.5em;">
											Show the "Most Recent" toggle in the filter panel.
										</p>
									</label>

									<label for="searchcraft_enable_exact_match_toggle" style="display: block; margin-bottom: 1em;">
										<input
											type="checkbox"
											name="searchcraft_enable_exact_match_toggle"
											id="searchcraft_enable_exact_match_toggle"
											value="1"
											<?php checked( $enable_exact_match_toggle, true ); ?>
										/>
										<strong>Enable Exact Match Filter</strong>
										<p class="description" style="margin: 0.25em 0 0 1.5em;">
											Show the "Exact Match" toggle in the filter panel.
										</p>
									</label>

									<label for="searchcraft_enable_date_range" style="display: block; margin-bottom: 1em;">
										<input
											type="checkbox"
											name="searchcraft_enable_date_range"
											id="searchcraft_enable_date_range"
											value="1"
											<?php checked( $enable_date_range, true ); ?>
										/>
										<strong>Enable Date Range Filter</strong>
										<p class="description" style="margin: 0.25em 0 0 1.5em;">
											Show the date range filter in the filter panel.
										</p>
									</label>

									<?php if ( $has_custom_post_types ) : ?>
										<label for="searchcraft_enable_post_type_filter" style="display: block; margin-bottom: 1em;">
											<input
												type="checkbox"
												name="searchcraft_enable_post_type_filter"
												id="searchcraft_enable_post_type_filter"
												value="1"
												<?php checked( $enable_post_type_filter, true ); ?>
											/>
											<strong>Enable Content Type Filter</strong>
											<p class="description" style="margin: 0.25em 0 0 1.5em;">
												Show a content type filter in the filter panel to allow filtering by post type.
											</p>
										</label>
									<?php endif; ?>

									<label for="searchcraft_enable_facets" style="display: block; margin-bottom: 1em;">
										<input
											type="checkbox"
											name="searchcraft_enable_facets"
											id="searchcraft_enable_facets"
											value="1"
											<?php checked( $enable_facets, true ); ?>
										/>
										<strong>Enable Facets</strong>
										<p class="description" style="margin: 0.25em 0 0 1.5em;">
											Show category/taxonomy facets in the filter panel.
										</p>
									</label>

									<div class="searchcraft-facets-options" style="<?php echo $enable_facets ? '' : 'display:none;'; ?> padding-left: 2em; margin-bottom: 1em;">
										<label for="searchcraft_hide_uncategorized" style="display: block;">
											<input
												type="checkbox"
												name="searchcraft_hide_uncategorized"
												id="searchcraft_hide_uncategorized"
												value="1"
												<?php checked( $hide_uncategorized, true ); ?>
											/>
											<strong>Hide Uncategorized</strong>
											<p class="description" style="margin: 0.25em 0 0 1.5em;">
												Hide the "Uncategorized" option from category facets.
											</p>
										</label>
									</div>

									<div style="margin-top: 1em;">
										<label for="searchcraft_toggle_button_disabled_color" style="display: block; margin-bottom: 0.5em;">
											<strong>Toggle Button Disabled State Color</strong>
										</label>
										<?php
										$toggle_button_disabled_color = get_option( 'searchcraft_toggle_button_disabled_color', '#E0E0E0' );
										?>
										<input type="color" name="searchcraft_toggle_button_disabled_color" id="searchcraft_toggle_button_disabled_color" value="<?php echo esc_attr( $toggle_button_disabled_color ); ?>" class="searchcraft-color-picker" />
										<input type="text" name="searchcraft_toggle_button_disabled_color_hex" id="searchcraft_toggle_button_disabled_color_hex" value="<?php echo esc_attr( $toggle_button_disabled_color ); ?>" class="regular-text searchcraft-hex-input" pattern="^#[0-9A-Fa-f]{6}$" placeholder="#E0E0E0" />
										<p class="description" style="margin: 0.25em 0 0 0;">
											Choose the background color for toggle buttons in their disabled state. Enabled state uses the brand color by default.
										</p>
									</div>
								</fieldset>
							</td>
						</tr>
					</tbody>
				</table>
		</div>

		<h2 class="searchcraft-section-heading">Advanced</h2>
		<div class="searchcraft-advanced-accordion">
			<details class="searchcraft-accordion-item">
				<summary class="searchcraft-accordion-header">
					<span>Advanced Customization</span>
					<span class="searchcraft-accordion-icon">▼</span>
				</summary>
				<div class="searchcraft-accordion-content">
					<table class="form-table">
							<tbody>
								<tr>
									<th scope="row">
										<label for="searchcraft_custom_css">Custom CSS</label>
									</th>
									<td>
										<textarea
											name="searchcraft_custom_css"
											id="searchcraft_custom_css"
											class="large-text code searchcraft-css-editor"
											rows="30"
											placeholder="/* Enter your custom CSS here */&#10;.searchcraft-results {&#10;    /* Your styles */&#10;}"
										><?php echo esc_textarea( get_option( 'searchcraft_custom_css', '' ) ); ?></textarea>
										<p class="description">
											Add custom CSS to style your search results and form. This CSS will be applied to the Searchraft SDK components.
										</p>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label for="searchcraft_result_template">Result Template Callback Function</label>
									</th>
									<td>
										<textarea
											name="searchcraft_result_template"
											id="searchcraft_result_template"
											class="large-text code searchcraft-template-editor"
											rows="15"
											placeholder="// Enter your custom result template callback function here&#10;(item, index, { html }) => {&#10;    const postDate = item.post_date ? new Date(item.post_date).toLocaleDateString() : '';&#10;    return html`&#10;        &lt;a class=&quot;searchcraft-result-item&quot; href=&quot;${item.permalink}&quot;&gt;&#10;            &lt;h3&gt;${item.post_title}&lt;/h3&gt;&#10;            &lt;p&gt;${item.post_excerpt}&lt;/p&gt;&#10;            ${postDate ? html`&lt;p&gt;${postDate}&lt;/p&gt;` : ''}&#10;        &lt;/a&gt;&#10;    `;&#10;}"
										><?php echo esc_textarea( get_option( 'searchcraft_result_template', '' ) ); ?></textarea>
										<p class="description">
											Write a JavaScript callback function to customize how search results are displayed. The function receives <code>(item, index, { html })</code> parameters and should return a template literal using the <code>html</code> tagged template function. Available item properties include: <code>post_title</code>, <code>post_excerpt</code>, <code>permalink</code>, <code>post_date</code>, <code>featured_image_url</code>, etc.
											<br/>
											For more details on custom templates refer to <a href="https://docs.searchcraft.io/sdks/javascript/working-with-templates/" target="_blank">the documentation</a>.
										</p>
									</td>
								</tr>
								<tr class="searchcraft-popover-only">
									<th scope="row">
										<label for="searchcraft_popover_container_id">Popover Container Element ID</label>
									</th>
									<td>
										<?php
										$popover_container_id = get_option( 'searchcraft_popover_container_id', '' );
										?>
										<input type="text" name="searchcraft_popover_container_id" id="searchcraft_popover_container_id" value="<?php echo esc_attr( $popover_container_id ); ?>" class="regular-text" />
										<p class="description">
											The identifier of the HTML element where popover trigger should reside. Can either be an <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/id" target="_blank">ID</a> or a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/classList" target="_blank">class</a>. If a class is used, the first element with this class will be used. Leave empty to use the default behavior.
										</p>
									</td>
								</tr>
								<tr class="searchcraft-popover-only">
									<th scope="row">
										<label for="searchcraft_popover_element_behavior">Popover Element Behavior</label>
									</th>
									<td>
										<?php
										$popover_element_behavior = get_option( 'searchcraft_popover_element_behavior', 'replace' );
										?>
										<fieldset>
											<label>
												<input type="radio" name="searchcraft_popover_element_behavior" value="replace" <?php checked( $popover_element_behavior, 'replace' ); ?> />
												Replace
											</label>
											<br>
											<label>
												<input type="radio" name="searchcraft_popover_element_behavior" value="insert" <?php checked( $popover_element_behavior, 'insert' ); ?> />
												Insert
											</label>
										</fieldset>
										<p class="description">
											When a custom element ID is chosen, choose whether to replace the contents of this element or insert next to other elements in this container.
										</p>
									</td>
								</tr>
								<tr class="searchcraft-full-only">
									<th scope="row">
										<label for="searchcraft_search_input_container_id">Search Box Container Element ID</label>
									</th>
									<td>
										<?php
										$input_container_id = get_option( 'searchcraft_search_input_container_id', '' );
										?>
										<input type="text" name="searchcraft_search_input_container_id" id="searchcraft_search_input_container_id" value="<?php echo esc_attr( $input_container_id ); ?>" class="regular-text" placeholder="my-search-input-container" />
										<p class="description">
											If specified, the search box input form will load as the first element inside of the HTML element that matches this <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/id" target="_blank">ID</a>. Note: this element must be present on every page you want the search input to appear on. Leave empty to use the default auto-detection behavior.
										</p>
									</td>
								</tr>
								<tr class="searchcraft-full-only">
									<th scope="row">
										<label for="searchcraft_results_container_id">Results Container Element ID</label>
									</th>
									<td>
										<?php
										$results_container_id = get_option( 'searchcraft_results_container_id', '' );
										?>
										<input type="text" name="searchcraft_results_container_id" id="searchcraft_results_container_id" value="<?php echo esc_attr( $results_container_id ); ?>" class="regular-text" placeholder="my-results-container" />
										<p class="description">
											If specified, the search results will load as the first element inside of the HTML element that matches this <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/id" target="_blank">ID</a>. Leave empty to use the default behavior.
										</p>
									</td>
								</tr>
							</tbody>
						</table>
				</div>
			</details>
		</div>

		<div class="searchcraft-save-buttons-bottom" style="margin-top: 20px;">
			<?php submit_button( 'Save All Settings', 'primary', 'searchcraft_save_layout_settings', false ); ?>
		</div>

	</form>
	<?php endif; ?>
</div>
<?php
