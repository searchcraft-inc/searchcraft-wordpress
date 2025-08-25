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
$search_experience    = 'full';
$include_filter_panel = false;
$results_per_page     = 10;

if ( $is_configured ) {
	$search_experience    = get_option( 'searchcraft_search_experience', 'full' );
	$include_filter_panel = get_option( 'searchcraft_include_filter_panel', false );
	$results_per_page     = get_option( 'searchcraft_results_per_page', 10 );
}
?>
<div class="searchcraft-layout">
	<?php if ( ! $is_configured ) : ?>
		<div class="notice notice-warning">
			<p><strong>Configuration Required:</strong> Please configure your Searchcraft settings to enable the plugin's functionality. You can do this on the <a href="admin.php?page=searchcraft&tab=config">configuration page</a>.</p>
		</div>
	<?php endif; ?>

	<?php if ( $is_configured ) : ?>
		<h2 class="searchcraft-section-heading">Search Form Settings</h2>
		<div class="searchcraft-overview-search-experience-config">
			<form method="post" class="searchcraft-form">
				<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
				<input type="hidden" name="searchcraft_action" value="search_experience_config" />

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
									Choose how you want search to be presented to your users. The full experience provides a dedicated search page, while the popover offers a more integrated approach.
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
						<tr>
							<th scope="row">
								<label for="searchcraft_input_padding">Input Component Horizontal Padding</label>
							</th>
							<td>
								<?php
								$input_padding = get_option( 'searchcraft_input_padding', '50' );
								?>
								<input type="number" name="searchcraft_input_padding" id="searchcraft_input_padding" value="<?php echo esc_attr( $input_padding ); ?>" class="small-text" min="0" max="200" />
								<span>px</span>
								<p class="description">
									The horizontal (left/right) padding around the search input component (0-200px).
								</p>
							</td>
						</tr>
						<tr>
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
						<tr>
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
						<tr>
							<td>
								<div class="searchcraft-overview-index-management-buttons">
									<?php submit_button( 'Save Search Form Settings', 'primary', 'searchcraft_save_search_experience_config', false ); ?>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>

		<h2 class="searchcraft-section-heading">Search Results Settings</h2>
		<div class="searchcraft-overview-search-results-config">
			<p class="results-description">
				These settings only apply to the full search experience. Popover is only customizable via CSS in the advanced settings below.
			</p>
			<form method="post" class="searchcraft-form">
				<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
				<input type="hidden" name="searchcraft_action" value="search_results_config" />

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
						<tr>
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
						<tr>
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
						<tr>
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
						<tr>
							<td>
								<div class="searchcraft-overview-index-management-buttons">
									<?php submit_button( 'Save Search Results Settings', 'primary', 'searchcraft_save_search_results_config', false ); ?>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		</div>

		<h2 class="searchcraft-section-heading">Advanced</h2>
		<div class="searchcraft-advanced-accordion">
			<details class="searchcraft-accordion-item">
				<summary class="searchcraft-accordion-header">
					<span>Advanced Customization</span>
					<span class="searchcraft-accordion-icon">▼</span>
				</summary>
				<div class="searchcraft-accordion-content">
					<form method="post" class="searchcraft-form">
						<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
						<input type="hidden" name="searchcraft_action" value="advanced_config" />

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
											rows="10"
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
										</p>
									</td>
								</tr>
								<tr>
									<th scope="row">
										<label for="searchcraft_results_container_id">Results Container Element ID</label>
									</th>
									<td>
										<?php
										$results_container_id = get_option( 'searchcraft_results_container_id', '' );
										?>
										<input type="text" name="searchcraft_results_container_id" id="searchcraft_results_container_id" value="<?php echo esc_attr( $results_container_id ); ?>" class="regular-text" placeholder="my-results-container" />
										<p class="description">
											If specified, the search results will load as the first element inside of the element that matches this ID. Leave empty to use the default behavior.
										</p>
									</td>
								</tr>
								<tr>
									<td>
										<div class="searchcraft-overview-index-management-buttons">
											<?php submit_button( 'Save Advanced Settings', 'primary', 'searchcraft_save_advanced_config', false ); ?>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</form>
				</div>
			</details>
		</div>
	<?php endif; ?>
</div>
<?php
