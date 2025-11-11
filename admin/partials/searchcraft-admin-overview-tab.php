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
		<?php if ( $index_stats && isset( $index_stats['document_count'] ) && number_format( $index_stats['document_count'] ) != 0 ) : ?>
		<h2 class="searchcraft-section-heading">Index Management</h2>
		<div class="searchcraft-overview-index-management">
			<?php if ( $index_stats && isset( $index_stats['document_count'] ) ) : ?>
				<div class="searchcraft-index-stats">
					<p><strong>Total Documents in Index:</strong> <?php echo esc_html( number_format( $index_stats['document_count'] ) ); ?></p>
				</div>
			<?php elseif ( null === $index_stats ) : ?>
				<div class="searchcraft-index-stats">
					<p><strong>Index Statistics:</strong> <em>Unable to retrieve statistics. Please check your configuration.</em></p>
				</div>
			<?php endif; ?>
			<p>If you need to delete all documents from the index or re-index all documents you may do so using the buttons below. If you change your permalink settings you may want to do this.</p>
			<table class="searchcraft-overview-table">
				<tbody>
					<tr>
						<td>
							<div class="searchcraft-overview-index-management-buttons">
								<form method="post" class="searchcraft-form" id="searchcraft-reindex-form">
									<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
									<input
										type="hidden"
										name="searchcraft_action"
										value="reindex_all_documents"
									/>
									<div class="searchcraft-button-with-spinner">
										<?php submit_button( 'Manually Re-Sync All Documents', 'primary', 'searchcraft_reindex_all_documents', false, array( 'id' => 'searchcraft-reindex-button' ) ); ?>
										<span class="searchcraft-spinner" id="searchcraft-reindex-spinner" style="display: none;">
											<span class="spinner is-active"></span>
											<span class="searchcraft-spinner-text">Syncing documents...</span>
										</span>
									</div>
								</form>
								<form method="post" class="searchcraft-form" id="searchcraft-delete-form">
									<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
									<input
										type="hidden"
										name="searchcraft_action"
										value="delete_all_documents"
									/>
									<div class="searchcraft-button-with-spinner">
										<?php submit_button( 'Delete All Documents', 'primary', 'searchcraft_delete_all_documents', false, array( 'id' => 'searchcraft-delete-button' ) ); ?>
										<span class="searchcraft-spinner" id="searchcraft-delete-spinner" style="display: none;">
											<span class="spinner is-active"></span>
											<span class="searchcraft-spinner-text">Deleting documents...</span>
										</span>
									</div>
								</form>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<?php endif; // End index document count check to hide index management section. ?>

	<?php endif; ?>
</div>
<?php
