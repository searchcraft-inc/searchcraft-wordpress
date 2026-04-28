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
$is_configured = Searchcraft_Config::is_configured();

// Get index statistics if configured.
$index_stats = null;
if ( $is_configured ) {
	// Get the admin instance to fetch stats.
	$admin_instance = new Searchcraft_Admin( 'searchcraft', '1.0.0' );
	$index_stats    = $admin_instance->searchcraft_get_index_stats();
}
?>
<div class="searchcraft-overview">
	<?php if ( ! $is_configured ) : ?>
		<div class="notice notice-warning">
			<p><strong>Configuration Required:</strong> Please configure your Searchcraft settings to enable the plugin's functionality. You can do this on the <a href="admin.php?page=searchcraft&tab=config">configuration page</a>.</p>
		</div>
	<?php endif; ?>
	<?php if ( $is_configured ) : ?>
	<h2 class="searchcraft-section-heading">Welcome Aboard Pilot!</h2>
	<div class="searchcraft-overview-getting-started">
		<p>Getting Started</p>
		<div>
			<p>As you create pages and posts, they will automatically be added to search unless you mark "exclude from search" on the edit screen.</p>
			<?php if ( $index_stats && isset( $index_stats['document_count'] ) && number_format( $index_stats['document_count'] ) == 0 ) : ?>
				<p>On first activation, we need to sync your existing content.</p>
				<form method="post" class="searchcraft-form" id="searchcraft-initial-reindex-form">
					<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
					<input
						type="hidden"
						name="searchcraft_action"
						value="reindex_all_documents"
					/>
					<div class="searchcraft-button-with-spinner">
						<?php submit_button( 'Sync All Documents Now', 'primary', 'searchcraft_reindex_all_documents', false, array( 'id' => 'searchcraft-reindex-button' ) ); ?>
						<span class="searchcraft-spinner" id="searchcraft-reindex-spinner" style="display: none;">
							<span class="spinner is-active"></span>
							<span class="searchcraft-spinner-text">Syncing documents...</span>
						</span>
					</div>
				</form>
			<?php endif; ?>
			<p>
				Having issues? Join our <a href="https://discord.com/invite/y3zUHkBk6e">community Discord </a>.
			</p>
		</div>
	</div>
	<?php endif; ?>
</div>
<?php
