<?php
/**
 * The configuration tab for Searchcraft settings.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$config         = Searchcraft_Config::get_all();
$is_configured  = Searchcraft_Config::is_configured();
$has_ingest_key = ! empty( Searchcraft_Config::get_ingest_key() );
$has_read_key   = ! empty( Searchcraft_Config::get_read_key() );
?>
<div class="searchcraft-config-section">
	<h2 class="searchcraft-section-heading">Searchcraft Configuration</h2>

	<?php if ( ! $is_configured ) : ?>
		<div class="notice notice-warning">
			<p><strong>Configuration Required:</strong> Please configure your Searchcraft settings below to enable the plugin functionality.</p>
		</div>
		<div class="searchcraft-overview-getting-started">
			<p>Getting Started</p>
			<div>
				<p>Setting up Searchcraft for your WordPress site is easy.</p>
				<ol>
					<li>Sign up for a Searchcraft account at <a href="https://vektron.searchcraft.io" target="_blank">https://vektron.searchcraft.io</a>. It's free and takes less than a minute.</li>
					<li>Create a new application and index.</li>
					<li>Select <em>"I have data"</em> and choose the WordPress option.</li>
					<li>Copy the endpoint url, index name, ingest key and read key values from the Vektron dashboard.</li>
				</ol>
				<p>
					Once you have saved your configuration options, the plugin will automatically prepare your post content for search. Having issues? Join our <a href="https://discord.com/invite/y3zUHkBk6e">community Discord </a>.
				</p>
			</div>
		</div>
	<?php endif; ?>

	<form method="post" class="searchcraft-form">
		<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
		<input type="hidden" name="searchcraft_action" value="config" />

		<table class="form-table">
			<tbody>
				<tr>
					<th scope="row">
						<label for="searchcraft_endpoint_url">Endpoint URL</label>
					</th>
					<td>
						<input
							type="url"
							id="searchcraft_endpoint_url"
							name="searchcraft_config[endpoint_url]"
							value="<?php echo esc_attr( $config['endpoint_url'] ); ?>"
							class="regular-text"
							required
						/>
						<p class="description">
							The Searchcraft API endpoint URL.
						</p>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<label for="searchcraft_index_id">Index ID</label>
					</th>
					<td>
						<input
							type="text"
							id="searchcraft_index_id"
							name="searchcraft_config[index_id]"
							value="<?php echo esc_attr( $config['index_id'] ); ?>"
							class="regular-text"
							pattern="[^ ]+"
							required
						/>
						<p class="description">
							Unique identifier for your search index.
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="searchcraft_ingest_key">Ingest Key</label>
					</th>
					<td>
						<div class="searchcraft-password-input-wrapper" data-toggle-password-visibility>
							<input
								autocomplete="off"
								type="password"
								id="searchcraft_ingest_key"
								name="searchcraft_config[ingest_key]"
								value="<?php echo esc_attr( $config['ingest_key'] ); ?>"
								class="regular-text searchcraft-password-input"
							/>
							<button class="button button-secondary searchcraft-button" type="button" aria-label="Show">
								<span class="dashicons dashicons-visibility"></span>
							</button>
						</div>
						<p class="description">
							API key for ingest operations (adding/updating documents).
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="searchcraft_read_key">Read Key</label>
					</th>
					<td>
						<div class="searchcraft-password-input-wrapper" data-toggle-password-visibility>
							<input
								autocomplete="off"
								type="password"
								id="searchcraft_read_key"
								name="searchcraft_config[read_key]"
								value="<?php echo esc_attr( $config['read_key'] ); ?>"
								class="regular-text searchcraft-password-input"
							/>
							<button class="button button-secondary searchcraft-button" type="button" aria-label="Show">
								<span class="dashicons dashicons-visibility"></span>
							</button>
						</div>
						<p class="description">
							API key for read operations (searching).
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="searchcraft_cortex_url">Cortex URL</label>
					</th>
					<td>
						<input
							type="url"
							id="searchcraft_cortex_url"
							name="searchcraft_config[cortex_url]"
							value="<?php echo esc_attr( isset( $config['cortex_url'] ) ? $config['cortex_url'] : '' ); ?>"
							class="regular-text"
						/>
						<p class="description">
							Optional URL for AI summary functionality. Contact Searchcraft support for this value.
						</p>
					</td>
				</tr>
			</tbody>
		</table>

		<div class="searchcraft-config-actions">
			<?php submit_button( 'Save Configuration', 'primary', 'searchcraft_save_config' ); ?>
		</div>
	</form>
	</div>
</div>
<?php
