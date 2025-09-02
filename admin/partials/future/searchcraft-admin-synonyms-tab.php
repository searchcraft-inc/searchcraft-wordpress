<?php
/**
 * The synonyms tab.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 */

$two_way_synonyms = get_option( '_searchcraft_two_way_synonyms', array() );
$synonyms         = $this->searchcraft_get_synonyms();
// Remove two-way synonyms.
$synonyms = array_diff_key( $synonyms, $two_way_synonyms );
?>
<div class="searchcraft-synonyms">
	<h2 class="searchcraft-section-heading">Synonyms</h2>
	<form method="post" class="searchcraft-form">
		<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
		<input
			type="hidden"
			name="searchcraft_action"
			value="synonyms"
		/>
		<div class="searchcraft-synonyms-form">
			<div class="searchcraft-text-input-wrapper">
				<label class="searchcraft-label" for="base-word">
					Base Word
				</label>
				<input
					class="searchcraft-input searchcraft-text-input"
					id="base-word"
					name="searchcraft_synonyms[base_word]"
					type="text"
				/>
			</div>
			<div class="searchcraft-text-input-wrapper">
				<label class="searchcraft-label" for="synonyms">
					Synonyms
				</label>
				<p class="searchcraft-caption">Use a comma separated list.</p>
				<input
					class="searchcraft-input searchcraft-text-input"
					id="synonyms"
					name="searchcraft_synonyms[synonyms]"
					type="text"
				/>
			</div>
			<div class="searchcraft-select-wrapper">
				<label class="searchcraft-label" for="type">
					Type
				</label>
				<select
					class="searchcraft-select"
					id="type"
					name="searchcraft_synonyms[type]"
				>
					<option value="one-way">One-Way</option>
					<option value="two-way">Two-Way</option>
				</select>
			</div>
			<div>
				<?php submit_button( 'Add Synonym' ); ?>
			</div>
		</div>
	</form>
	<?php
	if ( ! empty( $synonyms ) ) {
		?>
		<form method="post" class="searchcraft-form">
			<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
			<input
				type="hidden"
				name="searchcraft_action"
				value="delete_synonyms"
			/>
			<div>
				<table class="searchcraft-synonyms-table" data-indeterminate-checkbox>
					<thead>
						<tr>
							<th>
								<label class="screen-reader-text" for="select-all">
									Select All
								</label>
								<input
									class="searchcraft-checkbox-input searchcraft-indeterminate-checkbox-input"
									id="select-all"
									type="checkbox"
									<?php echo empty( $synonyms ) ? 'disabled' : ''; ?>
								/>
							</th>
							<th>
								Base Word
							</th>
							<th>
								Synonyms
							</th>
						</tr>
					</thead>
					<tbody>
						<?php
						foreach ( $synonyms as $base_word => $synonyms_group ) {
							$field_id = preg_replace( '/\s+/', '_', $base_word );
							?>
							<tr>
								<td>
									<label class="screen-reader-text" for="<?php echo esc_attr( $field_id ); ?>">
										Select <?php echo esc_html( $base_word ); ?>
									</label>
									<input
										id="<?php echo esc_attr( $field_id ); ?>"
										class="searchcraft-checkbox-input searchcraft-indeterminate-checkbox-input"
										name="searchcraft_synonyms[<?php echo esc_attr( $base_word ); ?>]"
										type="checkbox"
										value="1"
									/>
								</td>
								<td>
									<?php echo esc_html( $base_word ); ?>
								</td>
								<td>
									<?php echo esc_html( implode( ',', $synonyms_group ) ); ?>
								</td>
							</tr>
								<?php
						}
						?>
					</tbody>
				</table>
			</div>
			<div class="searchcraft-synonyms-buttons">
				<?php submit_button( 'Delete Synonyms', 'primary', 'searchcraft_delete_synonyms' ); ?>
			</div>
		</form>
			<?php
	}
	?>
</div>
<?php
