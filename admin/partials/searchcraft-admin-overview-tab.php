<?php
/**
 * The overview view.
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
$is_configured   = Searchcraft_Config::is_configured();
$measure_enabled = $is_configured ? Searchcraft_Admin_Analytics::is_measure_enabled() : true;

// Get index statistics if configured.
$index_stats = null;
if ( $is_configured ) {
	$admin_instance = new Searchcraft_Admin( 'searchcraft', '1.0.0' );
	$index_stats    = $admin_instance->searchcraft_get_index_stats();
}

// Derive Total Articles server-side state.
$total_articles_state = 'error';
$total_articles_value = '';
if ( $is_configured && $index_stats && isset( $index_stats['document_count'] ) ) {
	$count = (int) $index_stats['document_count'];
	if ( 0 === $count ) {
		$total_articles_state = 'empty';
		$total_articles_value = '—';
	} else {
		$total_articles_state = 'ready';
		$total_articles_value = number_format_i18n( $count );
	}
}
?>
<div class="searchcraft-overview">
	<?php if ( ! $is_configured ) : ?>
		<div class="notice notice-warning">
			<p><strong>Configuration Required:</strong> Please configure your Searchcraft settings to enable the plugin's functionality. You can do this on the <a href="admin.php?page=searchcraft&tab=config">configuration page</a>.</p>
		</div>
	<?php endif; ?>
	<?php if ( $is_configured ) : ?>
	<div class="sc-welcome">
		<h2 class="searchcraft-section-heading"><?php esc_html_e( 'Welcome aboard, Pilot!', 'searchcraft' ); ?></h2>
		<p class="sc-welcome-text">
			<?php
			printf(
				/* translators: %s: Discord server link */
				esc_html__( 'Congratulations! You are now part of the most advanced and most performant content discovery platform in the universe. New features are added regularly. Check for updates and get help from the Searchcraft crew on our %s.', 'searchcraft' ),
				'<a href="https://discord.com/invite/y3zUHkBk6e">' . esc_html__( 'public Discord server', 'searchcraft' ) . '</a>'
			);
			?>
		</p>
	</div>

	<?php if ( ! $measure_enabled ) : ?>
	<div class="notice notice-warning">
		<p><?php esc_html_e( 'Analytics are not available with your Searchcraft instance.', 'searchcraft' ); ?></p>
	</div>
	<?php endif; ?>

	<?php if ( $index_stats && isset( $index_stats['document_count'] ) && 0 === (int) $index_stats['document_count'] ) : ?>
	<div class="sc-first-sync">
		<p><?php esc_html_e( 'On first activation, we need to sync your existing content.', 'searchcraft' ); ?></p>
		<form method="post" class="searchcraft-form" id="searchcraft-initial-reindex-form">
			<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
			<input type="hidden" name="searchcraft_action" value="reindex_all_documents" />
			<div class="searchcraft-button-with-spinner">
				<?php submit_button( 'Sync All Documents Now', 'primary', 'searchcraft_reindex_all_documents', false, array( 'id' => 'searchcraft-reindex-button' ) ); ?>
				<span class="searchcraft-spinner" id="searchcraft-reindex-spinner" style="display: none;">
					<span class="spinner is-active"></span>
					<span class="searchcraft-spinner-text"><?php esc_html_e( 'Syncing documents...', 'searchcraft' ); ?></span>
				</span>
			</div>
		</form>
	</div>
	<?php endif; ?>

	<?php if ( $measure_enabled ) : ?>

	<div class="sc-analytics-metric-cards" id="sc-analytics-metric-cards">

		<!-- Daily Active Users -->
		<div class="sc-metric-card"
			data-state="loading"
			data-metric="dau"
			id="sc-metric-card-dau">
			<p class="sc-metric-value" aria-live="polite" aria-atomic="true">
				<span class="sc-metric-value-text"></span>
				<span class="sc-skeleton" role="status" aria-hidden="true">
					<span class="screen-reader-text"><?php esc_html_e( 'Loading&hellip;', 'searchcraft' ); ?></span>
				</span>
			</p>
			<p class="sc-metric-label"><?php esc_html_e( 'Daily Active Users', 'searchcraft' ); ?></p>
			<p class="sc-metric-empty-text"><?php esc_html_e( 'Once there are more searches this will update.', 'searchcraft' ); ?></p>
			<p class="sc-metric-error" role="alert">
				<span class="sc-metric-error-text"></span>
				<a href="#" class="sc-metric-retry" data-metric="dau"><?php esc_html_e( 'Retry', 'searchcraft' ); ?></a>
			</p>
		</div>

		<!-- Monthly Active Users -->
		<div class="sc-metric-card"
			data-state="loading"
			data-metric="mau"
			id="sc-metric-card-mau">
			<p class="sc-metric-value" aria-live="polite" aria-atomic="true">
				<span class="sc-metric-value-text"></span>
				<span class="sc-skeleton" role="status" aria-hidden="true">
					<span class="screen-reader-text"><?php esc_html_e( 'Loading&hellip;', 'searchcraft' ); ?></span>
				</span>
			</p>
			<p class="sc-metric-label"><?php esc_html_e( 'Monthly Active Users', 'searchcraft' ); ?></p>
			<p class="sc-metric-empty-text"><?php esc_html_e( 'Once there are more searches this will update.', 'searchcraft' ); ?></p>
			<p class="sc-metric-error" role="alert">
				<span class="sc-metric-error-text"></span>
				<a href="#" class="sc-metric-retry" data-metric="mau"><?php esc_html_e( 'Retry', 'searchcraft' ); ?></a>
			</p>
		</div>

		<!-- Total Articles — server-rendered -->
		<div class="sc-metric-card"
			data-state="<?php echo esc_attr( $total_articles_state ); ?>"
			data-metric="total-articles"
			id="sc-metric-card-total-articles">
			<p class="sc-metric-value" aria-live="polite" aria-atomic="true">
				<span class="sc-metric-value-text"><?php echo esc_html( $total_articles_value ); ?></span>
				<span class="sc-skeleton" role="status" aria-hidden="true">
					<span class="screen-reader-text"><?php esc_html_e( 'Loading&hellip;', 'searchcraft' ); ?></span>
				</span>
			</p>
			<p class="sc-metric-label"><?php esc_html_e( 'Total Articles', 'searchcraft' ); ?></p>
			<p class="sc-metric-empty-text"><?php esc_html_e( 'No articles indexed yet.', 'searchcraft' ); ?></p>
			<p class="sc-metric-error" role="alert">
				<span class="sc-metric-error-text"><?php esc_html_e( 'Could not load article count.', 'searchcraft' ); ?></span>
			</p>
		</div>

	</div>

	<div class="sc-card sc-chart-card" id="sc-chart-card">
		<div class="sc-card-header">
			<p class="sc-card-title"><?php esc_html_e( 'Search Volume', 'searchcraft' ); ?></p>
			<span class="sc-card-header-actions">
				<span class="sc-card-spinner spinner" aria-hidden="true"></span>
				<button
					type="button"
					id="sc-refresh-btn"
					class="sc-refresh-icon-btn"
					title="<?php esc_attr_e( 'Refresh analytics data (cached up to 5 minutes).', 'searchcraft' ); ?>">
					<span class="dashicons dashicons-update" aria-hidden="true"></span>
					<span class="screen-reader-text"><?php esc_html_e( 'Refresh analytics data', 'searchcraft' ); ?></span>
				</button>
			</span>
		</div>
		<div class="sc-card-body">

			<div class="sc-range-tabs" role="tablist" aria-label="<?php esc_attr_e( 'Date range', 'searchcraft' ); ?>">
				<button class="sc-range-tab sc-range-tab-active" data-range="1w" role="tab" aria-selected="true">1w</button>
				<button class="sc-range-tab" data-range="2w" role="tab" aria-selected="false">2w</button>
				<button class="sc-range-tab" data-range="1m" role="tab" aria-selected="false">1m</button>
				<button class="sc-range-tab" data-range="3m" role="tab" aria-selected="false">3m</button>
				<button class="sc-range-tab" data-range="ytd" role="tab" aria-selected="false">YTD</button>
				<button class="sc-range-tab" data-range="all" role="tab" aria-selected="false">ALL</button>
			</div>

			<div class="sc-total-searches" data-state="loading">
				<p class="sc-metric-value" aria-live="polite" aria-atomic="true">
					<span class="sc-metric-value-text" id="sc-total-searches-value"></span>
					<span class="sc-skeleton" aria-hidden="true"></span>
				</p>
				<span class="sc-total-searches-label"><?php esc_html_e( 'Total Searches', 'searchcraft' ); ?></span>
			</div>

			<div class="sc-chart-wrapper" id="sc-chart-wrapper" data-state="loading">
				<canvas
					id="sc-search-volume-chart"
					role="img"
					aria-label="<?php esc_attr_e( 'Search volume line chart', 'searchcraft' ); ?>">
				</canvas>
				<p class="sc-chart-empty"><?php esc_html_e( 'No searches yet. Run a test search from your site to see this fill in.', 'searchcraft' ); ?></p>
				<p class="sc-chart-error" role="alert">
					<span class="sc-chart-error-text"></span>
					<a href="#" class="sc-chart-retry"><?php esc_html_e( 'Retry', 'searchcraft' ); ?></a>
				</p>
			</div>

		</div>
	</div>

	<div class="sc-card" id="sc-popular-terms-card">
		<div class="sc-card-header">
			<p class="sc-card-title"><?php esc_html_e( 'Popular Search Terms', 'searchcraft' ); ?></p>
		</div>
		<div class="sc-popular-terms-wrapper" id="sc-popular-terms-wrapper" data-state="loading">
			<div class="sc-table-skeleton" aria-hidden="true">
				<?php for ( $i = 0; $i < 5; $i++ ) : ?>
				<div class="sc-table-skeleton-row">
					<span class="sc-skeleton sc-skeleton--term"></span>
					<span class="sc-skeleton sc-skeleton--count"></span>
				</div>
				<?php endfor; ?>
			</div>
			<table class="sc-popular-terms-table">
				<thead>
					<tr>
						<th scope="col"><?php esc_html_e( 'Term', 'searchcraft' ); ?></th>
						<th scope="col" class="sc-terms-col-count"><?php esc_html_e( 'Occurences', 'searchcraft' ); ?></th>
					</tr>
				</thead>
				<tbody id="sc-popular-terms-tbody"></tbody>
			</table>
			<p class="sc-popular-terms-empty"><?php esc_html_e( 'No searches yet. Run a test search from your site to see this fill in.', 'searchcraft' ); ?></p>
			<p class="sc-popular-terms-error" role="alert">
				<span class="sc-popular-terms-error-text"></span>
				<a href="#" class="sc-popular-terms-retry"><?php esc_html_e( 'Retry', 'searchcraft' ); ?></a>
			</p>
		</div>
	</div>

	<?php endif; // measure_enabled ?>
	<?php endif; // is_configured ?>
</div>
