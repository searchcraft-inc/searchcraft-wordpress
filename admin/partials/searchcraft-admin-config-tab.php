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

// Get all public taxonomies.
$taxonomies          = get_taxonomies(
	array(
		'public' => true,
	),
	'objects'
);
$excluded_taxonomies = array( 'post_tag', 'post_format' );
$taxonomies          = array_filter(
	$taxonomies,
	function ( $taxonomy_obj ) use ( $excluded_taxonomies ) {
		return ! in_array( $taxonomy_obj->name, $excluded_taxonomies, true );
	}
);
$selected_taxonomies = get_option( 'searchcraft_filter_taxonomies', array() );
if ( ! is_array( $selected_taxonomies ) ) {
	$selected_taxonomies = array();
}
if ( empty( $selected_taxonomies ) ) {
	$selected_taxonomies = array( 'category' );
}

// Get all public post types.
$all_post_types     = get_post_types(
	array(
		'public' => true,
	),
	'objects'
);
$builtin_post_types = array( 'post', 'page', 'attachment' );
$custom_post_types  = array_filter(
	$all_post_types,
	function ( $post_type_obj ) use ( $builtin_post_types ) {
		return ! in_array( $post_type_obj->name, $builtin_post_types, true );
	}
);

$selected_custom_post_types = get_option( 'searchcraft_custom_post_types', array() );
if ( ! is_array( $selected_custom_post_types ) ) {
	$selected_custom_post_types = array();
}

$custom_post_types_with_fields = get_option( 'searchcraft_custom_post_types_with_fields', array() );
if ( ! is_array( $custom_post_types_with_fields ) ) {
	$custom_post_types_with_fields = array();
}

// Get selected custom fields for each post type.
$selected_custom_fields = get_option( 'searchcraft_selected_custom_fields', array() );
if ( ! is_array( $selected_custom_fields ) ) {
	$selected_custom_fields = array();
}

// Get built-in post types selection (default to both enabled).
$selected_builtin_post_types = get_option( 'searchcraft_builtin_post_types', array( 'post', 'page' ) );
if ( ! is_array( $selected_builtin_post_types ) ) {
	$selected_builtin_post_types = array( 'post', 'page' );
}
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

		<?php if ( ! empty( $taxonomies ) ) : ?>
			<h3>Filter Options</h3>
			<table class="form-table">
				<tbody>
					<tr>
						<th scope="row">
							<label>Add these taxonomies as filter options</label>
						</th>
						<td>
							<fieldset>
								<legend class="screen-reader-text"><span>Select taxonomies to use as filters</span></legend>
								<?php foreach ( $taxonomies as $taxonomy_obj ) : ?>
									<?php
									$is_checked  = in_array( $taxonomy_obj->name, $selected_taxonomies, true );
									?>
									<div style="margin-bottom: 8px;">
										<label style="display: inline-block; font-weight: 600; cursor: pointer;">
											<input
												type="checkbox"
												name="searchcraft_filter_taxonomies[]"
												value="<?php echo esc_attr( $taxonomy_obj->name ); ?>"
												style="margin-right: 4px;"
												<?php checked( $is_checked ); ?>
											/>
											<?php echo esc_html( $taxonomy_obj->label ); ?>
											<?php if ( ! empty( $taxonomy_obj->description ) ) : ?>
												- <?php echo esc_html( $taxonomy_obj->description ); ?>
											<?php else : ?>
												(<?php echo esc_html( $taxonomy_obj->name ); ?>)
											<?php endif; ?>
										</label>
									</div>
								<?php endforeach; ?>
							</fieldset>
							<p class="description">
								Select which taxonomies should be available as filter options in the search interface.
							</p>
						</td>
					</tr>
				</tbody>
			</table>
		<?php endif; ?>

		<h3>Standard Content Types</h3>
		<table class="form-table">
			<tbody>
				<tr>
					<th scope="row">
						<label>Include these content types in search</label>
					</th>
					<td>
						<fieldset>
							<legend class="screen-reader-text"><span>Select content types to include in search</span></legend>
							<div style="margin-bottom: 12px; position: relative; z-index: 1;">
								<label for="searchcraft_builtin_post_type_post" style="display: inline-block; margin-bottom: 4px; font-weight: 600; cursor: pointer;">
									<input
										type="checkbox"
										id="searchcraft_builtin_post_type_post"
										name="searchcraft_builtin_post_types[]"
										value="post"
										style="margin-right: 4px;"
										<?php checked( in_array( 'post', $selected_builtin_post_types, true ) ); ?>
									/>
									Posts
								</label>
							</div>
							<div style="margin-bottom: 12px; position: relative; z-index: 1;">
								<label for="searchcraft_builtin_post_type_page" style="display: inline-block; margin-bottom: 4px; font-weight: 600; cursor: pointer;">
									<input
										type="checkbox"
										id="searchcraft_builtin_post_type_page"
										name="searchcraft_builtin_post_types[]"
										value="page"
										style="margin-right: 4px;"
										<?php checked( in_array( 'page', $selected_builtin_post_types, true ) ); ?>
									/>
									Pages
								</label>
							</div>
						</fieldset>
						<p class="description">
							Select which built-in content types should be included in the search index. Uncheck to exclude all posts or pages from search.
						</p>
					</td>
				</tr>
			</tbody>
		</table>

		<?php if ( ! empty( $custom_post_types ) ) : ?>
			<h3>Custom Content Types</h3>
			<table class="form-table">
				<tbody>
					<tr>
						<th scope="row">
							<label>Include these custom post types in search</label>
						</th>
						<td>
							<fieldset>
								<legend class="screen-reader-text"><span>Select custom post types to include in search</span></legend>
								<?php foreach ( $custom_post_types as $post_type_obj ) : ?>
									<?php
									$is_checked        = in_array( $post_type_obj->name, $selected_custom_post_types, true );
									$meta_keys         = Searchcraft_Helper_Functions::searchcraft_get_meta_keys_for_post_type( $post_type_obj->name );
									$has_custom_fields = ! empty( $meta_keys );
									$fields_checked    = in_array( $post_type_obj->name, $custom_post_types_with_fields, true );
									$post_type_selected_fields = isset( $selected_custom_fields[ $post_type_obj->name ] ) ? $selected_custom_fields[ $post_type_obj->name ] : array();
									$selected_count = count( $post_type_selected_fields );
									$total_count = count( $meta_keys );
									?>
									<div style="margin-bottom: 12px;">
										<label style="display: block; margin-bottom: 4px;">
											<input
												type="checkbox"
												name="searchcraft_custom_post_types[]"
												value="<?php echo esc_attr( $post_type_obj->name ); ?>"
												class="searchcraft-custom-post-type-checkbox"
												data-post-type="<?php echo esc_attr( $post_type_obj->name ); ?>"
												<?php checked( $is_checked ); ?>
											/>
											<strong><?php echo esc_html( $post_type_obj->label ); ?></strong>
											<?php if ( ! empty( $post_type_obj->description ) ) : ?>
												- <?php echo esc_html( $post_type_obj->description ); ?>
											<?php else : ?>
												(<?php echo esc_html( $post_type_obj->name ); ?>)
											<?php endif; ?>
										</label>
										<?php if ( $has_custom_fields ) : ?>
											<div class="searchcraft-custom-fields-option" data-post-type="<?php echo esc_attr( $post_type_obj->name ); ?>" style="padding-left: 2em; margin-top: 4px;<?php echo $is_checked ? '' : 'display:none;'; ?>">
												<label style="display: block; margin-bottom: 4px;">
													<input
														type="checkbox"
														name="searchcraft_custom_post_types_with_fields[]"
														value="<?php echo esc_attr( $post_type_obj->name ); ?>"
														class="searchcraft-enable-custom-fields-checkbox"
														data-post-type="<?php echo esc_attr( $post_type_obj->name ); ?>"
														<?php checked( $fields_checked ); ?>
													/>
													Include custom fields
												</label>
												<div class="searchcraft-custom-fields-selector" data-post-type="<?php echo esc_attr( $post_type_obj->name ); ?>" style="margin-top: 8px;<?php echo $fields_checked ? '' : 'display:none;'; ?>">
													<button type="button" class="button searchcraft-select-fields-button" data-post-type="<?php echo esc_attr( $post_type_obj->name ); ?>">
														<?php if ( $selected_count > 0 ) : ?>
															Select Fields (<?php echo esc_html( $selected_count ); ?> of <?php echo esc_html( $total_count ); ?> selected)
														<?php else : ?>
															Select Fields (All <?php echo esc_html( $total_count ); ?> fields)
														<?php endif; ?>
													</button>
												</div>
											</div>
										<?php endif; ?>
									</div>
								<?php endforeach; ?>
							</fieldset>
							<p class="description">
								Select which custom post types should be included in the search index. If a custom post type has custom fields, you can optionally include those fields in the search.
							</p>
							<p class="description">
								<strong>Note:</strong> To display custom fields in a search result you will need to create a <a href="https://docs.searchcraft.io/sdks/javascript/working-with-templates/" target="_blank">custom template</a>.
							</p>
						</td>
					</tr>
				</tbody>
			</table>
		<?php endif; ?>

		<?php if ( defined( 'PP_AUTHORS_VERSION' ) || defined( 'MOLONGUI_AUTHORSHIP_VERSION' ) ) : ?>
			<h3>Author Options</h3>
			<table class="form-table">
				<tbody>
					<?php if ( defined( 'PP_AUTHORS_VERSION' ) ) : ?>
						<tr>
							<th scope="row">
								<label for="searchcraft_use_publishpress_authors">PublishPress Authors</label>
							</th>
							<td>
								<?php
								$use_publishpress_authors = get_option( 'searchcraft_use_publishpress_authors', '1' );
								?>
								<label>
									<input
										type="checkbox"
										id="searchcraft_use_publishpress_authors"
										name="searchcraft_use_publishpress_authors"
										value="1"
										<?php checked( $use_publishpress_authors, '1' ); ?>
									/>
									Use PublishPress Authors
								</label>
								<p class="description">
									When enabled, the plugin will use PublishPress Authors for post author information instead of the default WordPress author.
								</p>
							</td>
						</tr>
					<?php endif; ?>
					<?php if ( defined( 'MOLONGUI_AUTHORSHIP_VERSION' ) ) : ?>
						<tr>
							<th scope="row">
								<label for="searchcraft_use_molongui_authorship">Molongui Authorship</label>
							</th>
							<td>
								<?php
								$use_molongui_authorship = get_option( 'searchcraft_use_molongui_authorship', '1' );
								?>
								<label>
									<input
										type="checkbox"
										id="searchcraft_use_molongui_authorship"
										name="searchcraft_use_molongui_authorship"
										value="1"
										<?php checked( $use_molongui_authorship, '1' ); ?>
									/>
									Use Molongui Authorship
								</label>
								<p class="description">
									When enabled, the plugin will use Molongui Authorship for post author information instead of the default WordPress author.
								</p>
							</td>
						</tr>
					<?php endif; ?>
				</tbody>
			</table>
		<?php endif; ?>

		<!-- Hidden inputs to store selected custom fields -->
		<div id="searchcraft-selected-fields-inputs" style="display: none;">
			<?php foreach ( $custom_post_types as $post_type_obj ) : ?>
				<?php
				$post_type_selected_fields = isset( $selected_custom_fields[ $post_type_obj->name ] ) ? $selected_custom_fields[ $post_type_obj->name ] : array();
				?>
				<div class="searchcraft-selected-fields-container" data-post-type="<?php echo esc_attr( $post_type_obj->name ); ?>">
					<?php foreach ( $post_type_selected_fields as $field_name ) : ?>
						<input type="hidden" name="searchcraft_selected_custom_fields[<?php echo esc_attr( $post_type_obj->name ); ?>][]" value="<?php echo esc_attr( $field_name ); ?>" />
					<?php endforeach; ?>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="searchcraft-button-with-spinner searchcraft-config-actions">
			<?php submit_button( 'Save Configuration', 'primary', 'searchcraft_save_config' ); ?>
			<span class="searchcraft-spinner" style="display: none;">
				<span class="spinner is-active"></span>
				<span class="searchcraft-spinner-text">Saving...</span>
			</span>
		</div>
	</form>
	</div>
</div>

<!-- Custom Fields Selection Modal -->
<div id="searchcraft-custom-fields-modal" class="searchcraft-modal" style="display: none;">
	<div class="searchcraft-modal-overlay"></div>
	<div class="searchcraft-modal-content">
		<div class="searchcraft-modal-header">
			<h2 id="searchcraft-modal-title">Select Custom Fields</h2>
			<button type="button" class="searchcraft-modal-close" aria-label="Close">&times;</button>
		</div>
		<div class="searchcraft-modal-body">
			<div class="searchcraft-modal-actions">
				<button type="button" class="button searchcraft-select-all-fields">Select All</button>
				<button type="button" class="button searchcraft-deselect-all-fields">Deselect All</button>
			</div>
			<div id="searchcraft-custom-fields-list" class="searchcraft-custom-fields-list">
				<!-- Fields will be populated dynamically -->
			</div>
		</div>
		<div class="searchcraft-modal-footer">
			<button type="button" class="button button-primary searchcraft-save-field-selection">Save Selection</button>
			<button type="button" class="button searchcraft-cancel-field-selection">Cancel</button>
		</div>
	</div>
</div>

<!-- Store meta keys data for JavaScript -->
<script type="text/javascript">
	var searchcraftMetaKeys = <?php
		echo wp_json_encode(
			array_values(
				array_map(
					function( $post_type_obj ) {
						return array(
							'name'      => $post_type_obj->name,
							'label'     => $post_type_obj->label,
							'meta_keys' => Searchcraft_Helper_Functions::searchcraft_get_meta_keys_for_post_type( $post_type_obj->name ),
						);
					},
					$custom_post_types
				)
			)
		);
		?>;
</script>

<?php
