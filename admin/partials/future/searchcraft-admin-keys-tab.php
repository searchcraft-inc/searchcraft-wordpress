<?php
/**
 * The access keys tab.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 */

$keys = $this->searchcraft_get_keys();
?>
<form method="post" class="searchcraft-form">
	<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
	<input
		type="hidden"
		name="searchcraft_action"
		value="keys"
	/>
	<div class="searchcraft-access-keys">
		<h2 class="searchcraft-section-heading">Access Keys</h2>
		<ul class="searchcraft-access-keys-list">
			<li class="searchcraft-access-keys-list-item">
				<div class="searchcraft-access-keys-input-wrapper">
					<label class="searchcraft-label" for="read-key">
						Read Key
					</label>
					<div class="searchcraft-password-input-wrapper" data-toggle-password-visibility>
						<input type="hidden" name="searchcraft_access_keys[read_key]" value="" />
						<input
							class="searchcraft-input searchcraft-password-input"
							disabled
							id="read-key"
							type="password"
							value="<?php echo esc_attr( $keys['read'] ); ?>"
						/>
						<button class="button button-secondary searchcraft-button" type="button" aria-label="Show">
							<span class="dashicons dashicons-visibility"></span>
						</button>
					</div>
					<button class="button button-primary" data-copy-to-clipboard="<?php echo esc_attr( $keys['read'] ); ?>" type="button">Copy</button>
				</div>
			</li>
			<li class="searchcraft-access-keys-list-item">
				<div class="searchcraft-access-keys-input-wrapper">
					<label class="searchcraft-label" for="ingest-key">
						Ingest Key
					</label>
					<div class="searchcraft-password-input-wrapper" data-toggle-password-visibility>
						<input type="hidden" name="searchcraft_access_keys[ingest_key]" value="" />
						<input
							class="searchcraft-input searchcraft-password-input"
							disabled
							id="ingest-key"
							type="password"
							value="<?php echo esc_attr( $keys['ingest'] ); ?>"
						/>
						<button class="button button-secondary searchcraft-button" type="button" aria-label="Show">
							<span class="dashicons dashicons-visibility"></span>
						</button>
					</div>
					<button class="button button-primary" data-copy-to-clipboard="<?php echo esc_attr( $keys['ingest'] ); ?>" type="button">Copy</button>
				</div>
			</li>
		</ul>
		<div class="searchcraft-access-keys-buttons">
			<?php submit_button( 'Regenerate Access Keys', 'primary', 'searchcraft_regenerate_keys' ); ?>
		</div>
	</div>
</form>
<?php
