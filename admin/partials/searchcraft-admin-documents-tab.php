<?php
/**
 * The documents admin view.
 *
 * @link       https://searchcraft.io
 * @since      1.5.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/admin/partials
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$is_configured = Searchcraft_Config::is_configured();

$index_stats = null;
if ( $is_configured ) {
	$admin_instance = new Searchcraft_Admin( 'searchcraft', SEARCHCRAFT_VERSION );
	$index_stats    = $admin_instance->searchcraft_get_index_stats();
}
?>
<div class="searchcraft-documents">
	<?php if ( $is_configured ) : ?>
		<h2 class="searchcraft-section-heading"><?php esc_html_e( 'Documents in Index', 'searchcraft' ); ?></h2>
		<div class="searchcraft-doc-count-widget">
			<p class="searchcraft-doc-count-value">
				<?php
				if ( $index_stats && isset( $index_stats['document_count'] ) ) {
					echo esc_html( number_format_i18n( (int) $index_stats['document_count'] ) );
				} else {
					esc_html_e( 'Unavailable', 'searchcraft' );
				}
				?>
			</p>
		</div>
		<h2 class="searchcraft-section-heading"><?php esc_html_e( 'Index Management', 'searchcraft' ); ?></h2>
		<div class="searchcraft-overview-index-management">
			<p><?php esc_html_e( 'If you need to delete all documents from the index or re-index all documents you may do so using the buttons below. If you change your permalink settings you may want to do this.', 'searchcraft' ); ?></p>
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
	<?php else : ?>
		<div class="notice notice-warning">
			<p>
				<strong><?php esc_html_e( 'Configuration Required:', 'searchcraft' ); ?></strong>
				<?php esc_html_e( ' Please configure your Searchcraft settings to enable document management. You can do this on the', 'searchcraft' ); ?>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=searchcraft&tab=config' ) ); ?>"><?php esc_html_e( 'configuration page', 'searchcraft' ); ?></a>.
			</p>
		</div>
	<?php endif; ?>
</div>
<?php
