<?php
/**
 * The import/export tab for Searchcraft settings.
 *
 * This file contains the import and export functionality for all Searchcraft settings.
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
?>
<div class="searchcraft-import-export">
	<h2 class="searchcraft-section-heading">Import/Export Settings</h2>

	<div class="searchcraft-overview-getting-started">
		<p>Backup and Restore</p>
		<div>
			<p>Use this page to export all your Searchcraft settings as a JSON file, or import settings from a previously exported file.</p>
			<p><strong>Important:</strong> API keys are encrypted using your WordPress authentication salts. To import settings on a different site, that site must have the same WordPress salts (AUTH_SALT, SECURE_AUTH_SALT, etc.) defined in wp-config.php.</p>
		</div>
	</div>

	<!-- Export Settings Section -->
	<div class="searchcraft-section" style="margin-top: 30px;">
		<h3>Export Settings</h3>
		<p>Download all your current Searchcraft settings as a JSON file. This file can be used to restore your settings or transfer them to another site.</p>

		<form method="post" class="searchcraft-form" id="searchcraft-export-form">
			<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
			<input type="hidden" name="searchcraft_action" value="export_settings" />

			<div class="searchcraft-button-with-spinner">
				<?php submit_button( 'Export Settings', 'primary', 'searchcraft_export_settings', false, array( 'id' => 'searchcraft-export-button' ) ); ?>
				<span class="searchcraft-spinner" id="searchcraft-export-spinner" style="display: none;">
					<span class="spinner is-active"></span>
					<span class="searchcraft-spinner-text">Preparing export...</span>
				</span>
			</div>
		</form>
	</div>

	<!-- Import Settings Section -->
	<div class="searchcraft-section" style="margin-top: 40px;">
		<h3>Import Settings</h3>
		<p>Upload a previously exported JSON file to restore your Searchcraft settings.</p>
		<p><strong>Warning:</strong> Importing settings will overwrite all current settings. Make sure to export your current settings first if you want to keep a backup.</p>

		<form method="post" enctype="multipart/form-data" class="searchcraft-form" id="searchcraft-import-form">
			<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
			<input type="hidden" name="searchcraft_action" value="import_settings" />

			<table class="form-table">
				<tbody>
					<tr>
						<th scope="row">
							<label for="searchcraft_import_file">Settings File</label>
						</th>
						<td>
							<input
								type="file"
								id="searchcraft_import_file"
								name="searchcraft_import_file"
								accept=".json,application/json"
								required
							/>
							<p class="description">Select a JSON file exported from Searchcraft.</p>
						</td>
					</tr>
				</tbody>
			</table>

			<div class="searchcraft-button-with-spinner">
				<?php submit_button( 'Import Settings', 'primary', 'searchcraft_import_settings', false, array( 'id' => 'searchcraft-import-button' ) ); ?>
				<span class="searchcraft-spinner" id="searchcraft-import-spinner" style="display: none;">
					<span class="spinner is-active"></span>
					<span class="searchcraft-spinner-text">Importing settings...</span>
				</span>
			</div>
		</form>
	</div>
</div>

<script type="text/javascript">
jQuery(document).ready(function($) {
	// Handle export form submission
	$('#searchcraft-export-form').on('submit', function() {
		$('#searchcraft-export-button').prop('disabled', true);
		$('#searchcraft-export-spinner').show();

		// Hide spinner and re-enable button after download starts (2 seconds)
		setTimeout(function() {
			$('#searchcraft-export-spinner').hide();
			$('#searchcraft-export-button').prop('disabled', false);
		}, 2000);
	});

	// Handle import form submission
	$('#searchcraft-import-form').on('submit', function(e) {
		var fileInput = $('#searchcraft_import_file')[0];

		if (!fileInput.files || !fileInput.files[0]) {
			e.preventDefault();
			alert('Please select a file to import.');
			return false;
		}

		if (!confirm('Are you sure you want to import these settings? This will overwrite all current settings.')) {
			e.preventDefault();
			return false;
		}

		$('#searchcraft-import-button').prop('disabled', true);
		$('#searchcraft-import-spinner').show();
		// Import will reload the page, so no need to hide spinner
	});
});
</script>
<?php

