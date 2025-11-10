<?php
/**
 * Search Header Template
 *
 * This template is loaded after the theme header to provide search functionality.
 * It will be displayed on all pages to provide consistent search access.
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

require_once 'common-template-values.php';

// NOTE: The styles in this file need to stay here and not move into searchcraft-sdk.css.
?>

<style>
:root {
	--sc-color-brand: <?php echo esc_attr( $searchcraft_brand_color ); ?>;
	--sc-input-form-border-radius: <?php echo esc_attr( $searchcraft_input_border_radius ); ?>px;
}

.searchcraft-input-form-input {
	padding: 12px 44px !important;
}

.searchcraft-full-search-experience .searchcraft-input-form-input {
	border-radius: var(--sc-input-form-border-radius) !important;
}

.searchcraft-header-container {
	width: 100%;
}

.searchcraft-input-container {
	padding-bottom: 20px;
}
.searchcraft-input-form-inline {
	flex: 1;
	width: 100%;
	min-width: 0;
}

.searchcraft-input-form-inline-container {
	align-items: center;
	display: flex;
	flex-direction: row;
	gap: 8px;
	margin-bottom: -40px;
	width: 100%;
}

/* Make the grid container flex to align input and button horizontally */
.searchcraft-input-form-inline .searchcraft-input-form-grid-inline {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
}

/* Input wrapper takes remaining space */
.searchcraft-input-form-inline .searchcraft-input-form-input-wrapper-inline {
	flex: 1;
	min-width: 0;
}

/* Button stays at its natural width */
.searchcraft-inline-submit {
	align-items: center;
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	text-align: center;
	min-width: 20%;
}
.searchcraft-popover-container {
	max-width: var(--wp--style--global--wide-size, 1200px);
	min-width: 260px;
	margin: 0 auto;
	width: <?php echo esc_attr( $searchcraft_input_width ); ?>%;
}
.searchcraft-full-search-experience {
	max-width: var(--wp--style--global--wide-size, 1200px);
	margin: 0 auto;
	padding: <?php echo esc_attr( $input_vertical_padding ); ?>px <?php echo esc_attr( $input_horizontal_padding ); ?>px;
}

.searchcraft-toggle-button-label {
	font-weight: bold;
}

<?php if ( 'grid' === $searchcraft_result_orientation ) : ?>
/* Grid layout for search results */
.searchcraft-search-results {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 24px;
	padding: 0;
}

/* Individual search result card */
.searchcraft-result-item {
	display: block;
	height: 100%;
}
.searchcraft-result-item a {
	display: flex;
	flex-direction: column;
	height: 100%;
}

/* Image container */
.searchcraft-result-image {
	aspect-ratio: 4/3;
	margin-bottom: 16px;
	overflow: hidden;
	max-width: 100%;
	width: 100%;
}

.searchcraft-result-image img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}
.searchcraft-result-content {
	display: flex;
	flex-direction: column;
	flex: 1;
}

/* Responsive breakpoints */
@media (max-width: 1024px) {
	.searchcraft-search-results {
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}
}
@media (max-width: 640px) {
	.searchcraft-search-results {
		grid-template-columns: 1fr;
		gap: 24px;
	}

	.search-result-content-title {
		font-size: 20px;
	}
}
<?php endif // End of grid layout styles. ?>


/* Filter panel positioning */
.searchcraft-main-content {
	display: flex;
	gap: 40px;
	align-items: flex-start;
}

#searchcraft-filter-panel-container {
	flex: 0 0 250px;
	margin-top: 16px;
	order: 1;
	padding-top: 20px;
}

.searchcraft-results-content {
	flex: 1;
	order: 2;
	padding-top: 30px;
}
.searchcraft-result-primary-category {
	color: <?php echo esc_attr( $searchcraft_brand_color ); ?>;
	text-transform: uppercase;
	font-size: 0.75rem;
	letter-spacing: 0.05rem;
}
.searchcraft-result-item {
	margin-bottom: 16px;
}

/* Not configured state */
.searchcraft-not-configured-search {
	max-width: var(--wp--style--global--wide-size, 1200px);
	margin: 0 auto;
	padding: 0 20px;
	text-align: center;
}

.searchcraft-summary-container {
	background-color: <?php echo esc_attr( $searchcraft_summary_background_color ); ?>;
	border: 1px solid <?php echo esc_attr( $searchcraft_summary_border_color ); ?>;
	border-radius: <?php echo esc_attr( $searchcraft_summary_box_border_radius ); ?>px;
	margin-bottom: 20px;
	padding: 40px;
	display: none; /* Hide by default to prevent flash */
}

.searchcraft-summary-header-container {
	display: flex;
	flex-direction: row;
	gap: 8px;
	margin-bottom: 16px;
}

.searchcraft-summary-footer-container {
	display: flex;
	flex-direction: row;
	gap: 4px;
	margin-top: 16px;
	align-items: baseline;
}

.searchcraft-pagination-container {
	display: flex;
	text-align: center;
	padding-top: 20px;
	flex-direction: column;
	gap: 1rem;
	justify-content: center;
	align-items: center;
	margin-top: 1.5rem;
	margin-bottom: 2.25rem;
}

.searchcraft-summary-box-header {
	color: <?php echo esc_attr( $searchcraft_brand_color ); ?>;
	font-size: 18px;
	line-height: 20px;
}

.searchcraft-summary-box-footer {
	font-size: 12px;
	line-height: 14px;
	margin: 0;
}

.searchcraft-powered-by {
	margin-left: auto;
}

.searchcraft-logo-image {
	text-decoration: none !important;
	vertical-align: middle;
}

.searchcraft-results-info-container {
	margin-top: 16px;
	align-items: baseline;
	display: none;
	flex-direction: row;
	gap: 4px;
	padding-bottom: 10px;
	padding-top: 20px;
}

/* Mobile styles */
@media (max-width: 768px) {
	.searchcraft-main-content {
		flex-direction: column;
	}

	#searchcraft-filter-panel-container {
		flex: none;
		width: 100%;
		order: 1; /* Above summary on mobile */
	}

	.searchcraft-results-content {
		order: 2; /* Below filter panel on mobile */
	}
	body:has(#wpadminbar) .searchcraft-popover-form-modal {
		margin-top: 44px;
	}
	.searchcraft-header-container {
		padding: 15px 0;
	}

	.searchcraft-full-search-experience,
	.searchcraft-popover-container,
	.searchcraft-not-configured-search {
		padding: 0 15px;
	}

	.searchcraft-popover-container {
		/*text-align: center;*/
	}
}

@media (min-width: 1024px) {
	.searchcraft-pagination-container {
		flex-direction: row;
		justify-content: space-between;
	}
}

searchcraft-summary-box {
	background-color: <?php echo esc_attr( $searchcraft_summary_background_color ); ?>;
	border-radius: <?php echo esc_attr( $searchcraft_summary_box_border_radius ); ?>px;
}
searchcraft-summary-box, .searchcraft-summary-box {
	background-color: <?php echo esc_attr( $searchcraft_summary_background_color ); ?>;
}
.searchcraft-summary-box-content {
	display: flex;
	flex-direction: column;
	gap: 16px;

	& * {
		margin: 0 !important;
		padding: 0 !important;
	}

	& h1, h2, h3, h4, h5 {
		font-weight: bold;
	}

	& a {
		color: <?php echo esc_attr( $searchcraft_brand_color ); ?>;
	}
}
.searchcraft-filter-panel-header {
	display: none;
	border-bottom: 1px solid #e9ecef;
	font-size: 1rem;
	font-weight: 700;
	margin-bottom: 10px;
	padding-bottom: 10px;
}
.searchcraft-toggle-button-label, .searchcraft-filter-panel-label {
	font-size: 1rem;
}
.searchcraft-toggle-button {
	border-bottom: 1px solid #e9ecef;
	margin-bottom: 10px;
	padding-bottom: 10px;
}
.searchcraft-pagination-item {
	color: #000000;
}
/* Hide results container when it contains empty state */
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:placeholder-shown) .searchcraft-results-container:has(.searchcraft-search-results-empty-state),
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:placeholder-shown) .searchcraft-pagination-container {
	display: none;
}
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:not(:placeholder-shown)) .searchcraft-results-container,
.searchcraft-results-container:has(searchcraft-search-results:not(:empty)) {
	border-top: 1px solid #e9ecef;
	padding-top: 20px;
	margin-bottom: 20px;
	min-height: 200px;
}
/* Show summary containers only when there are search results */
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:not(:placeholder-shown)) .searchcraft-summary-container,
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:not(:placeholder-shown)) .searchcraft-filter-panel-header {
	display: block;
}

body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:not(:placeholder-shown)) .searchcraft-summary-header-container,
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:not(:placeholder-shown)) .searchcraft-results-info-container,
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:not(:placeholder-shown)) .searchcraft-summary-footer-container {
	display: flex;
}

/* Hide summary containers when search results are empty */
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:placeholder-shown):has(.searchcraft-search-results-empty-state) .searchcraft-summary-header-container,
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:placeholder-shown):has(.searchcraft-search-results-empty-state) .searchcraft-summary-footer-container {
	display: none;
}

/* Hide filter panel when input is empty and no results */
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:placeholder-shown):has(.searchcraft-search-results-empty-state) #searchcraft-filter-panel-container,
body:has(.searchcraft-full-search-experience searchcraft-input-form input:placeholder-shown):has(.searchcraft-search-results-empty-state) #searchcraft-filter-panel-container {
	display: none;
}

/* Hide summary containers when input is empty and no results */
body:has(.searchcraft-full-search-experience .searchcraft-input-form-input:placeholder-shown):has(.searchcraft-search-results-empty-state) .searchcraft-summary-container,
body:has(.searchcraft-full-search-experience searchcraft-input-form input:placeholder-shown):has(.searchcraft-search-results-empty-state) .searchcraft-summary-container {
	display: none;
}

/* Custom CSS from plugin configuration */
<?php
$custom_css = get_option( 'searchcraft_custom_css', '' );
if ( ! empty( $custom_css ) ) {
	// CSS is already sanitized on save (tags stripped, XSS patterns removed).
	// Output directly without additional escaping to preserve CSS syntax.
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS is sanitized on save.
	echo $custom_css;
}
?>
</style>
<div class="searchcraft-header-container">
	<?php if ( $is_configured ) : ?>
		<?php if ( 'popover' === $search_experience ) : ?>
			<div class="searchcraft-popover-container">
				<searchcraft-popover-button type="skeuomorphic"></searchcraft-popover-button>
				<searchcraft-popover-form type="modal" placeholder-value="<?php echo esc_attr( $search_placeholder ); ?>"></searchcraft-popover-form>
			</div>
		<?php else : ?>
			<div class="searchcraft-full-search-experience">
				<?php if ( 'stand_alone' === $search_behavior && ! is_search() ) : ?>
					<div class="searchcraft-input-container searchcraft-input-form-inline-container">
						<form class="searchcraft-input-form searchcraft-input-form-inline" role="search" method="get" action="<?php echo site_url(); ?>">
							<div class="searchcraft-input-form-grid searchcraft-input-form-grid-button-none searchcraft-input-form-grid-inline" style="gap: 0px 8px;">
								<div class="searchcraft-input-form-input-wrapper searchcraft-input-form-input-wrapper-inline">
									<input autocomplete="off" class="searchcraft-input-form-input" placeholder="<?php echo esc_attr( $search_placeholder ); ?>" type="search" name="s">
										<div class="searchcraft-input-form-input-icon">
											<svg class="searchcraft-input-form-input-search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="searchcraft-title"><title>Search icon</title><path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
										</div>
								</div>
								<button aria-label="Search" class="searchcraft-button searchcraft-button-primary searchcraft-inline-submit" type="submit">
									<span>Search</span>
								</button>
							</div>
						</form>
				</div>
				<?php else : ?>
				<div class="searchcraft-input-container">
						<searchcraft-input-form <?php echo esc_attr( $value_attr ); ?> placeholder-value="<?php echo esc_attr( $search_placeholder ); ?>" auto-search></searchcraft-input-form>
				</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	<?php else : ?>
		<!-- When not configured, show a simple search input -->
		<div class="searchcraft-not-configured-search">
			<searchcraft-input-form placeholder-value="<?php echo esc_attr( $search_placeholder ); ?>"></searchcraft-input-form>
			<p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=searchcraft' ) ); ?>">Configure Searchcraft</a> for enhanced search features
			</p>
		</div>
	<?php endif; ?>
</div>

