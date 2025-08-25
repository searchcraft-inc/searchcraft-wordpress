<?php
/**
 * The schema view.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 */

$index = $this->searchcraft_get_index();

$post_types = get_post_types( array( 'public' => true ), 'objects' );

// Explicitly remove attachment post types.
unset( $post_types['attachment'] );

// All the core fields except for 'post_type'.
$core_fields = array(
	'post_title'   => array(
		'label' => 'Title',
		'type'  => 'text',
	),
	'post_content' => array(
		'label' => 'Content',
		'type'  => 'text',
	),
	'post_excerpt' => array(
		'label' => 'Excerpt',
		'type'  => 'text',
	),
	'post_date'    => array(
		'label' => 'Publish Date',
		'type'  => 'datetime',
	),
	'post_status'  => array(
		'label' => 'Status',
		'type'  => 'text',
	),
	'post_author'  => array(
		'label' => 'Author',
		'type'  => 'text',
	),
	'post_name'    => array(
		'label' => 'Slug',
		'type'  => 'text',
	),
);
?>
<div class="searchcraft-schema">
	<h2 class="searchcraft-section-heading">Schema</h2>
	<ul class="searchcraft-schema-list">
		<?php
		foreach ( $post_types as $post_type_obj ) {
			$field_id = esc_attr( $post_type_obj->name );
			?>
			<li class="searchcraft-schema-list-item" data-indeterminate-checkbox>
				<label class="searchcraft-checkbox-input-wrapper">
					<span class="searchcraft-label">
						<?php echo esc_html( $post_type_obj->labels->name ); ?>
					</span>
					<input
						class="searchcraft-checkbox-input searchcraft-indeterminate-checkbox-input"
						type="checkbox"
					>
				</label>
				<table class="searchcraft-schema-table">
					<?php
					foreach ( $core_fields as $field_key => $field ) {
						$field_id   = esc_attr( $post_type_obj->name . '_' . $field_key );
						$field_name = 'searchcraft_schema[fields][' . $field_id . ']';
						$is_checked = array_key_exists( $field_id, $index['fields'] ) && true === (bool) $index['fields'][ $field_id ]['indexed'] ? 'checked' : '';
						?>
						<tr>
							<td><?php echo esc_html( $field_key ); ?></td>
							<td>
								<div class="searchcraft-checkbox-input-wrapper">
									<?php
									if ( isset( $field['type'] ) ) {
										?>
										<input
											name="<?php echo esc_attr( $field_name ); ?>[type]"
											type="hidden"
											value="<?php echo esc_attr( $field['type'] ); ?>"
										>
										<?php
									}
									?>
									<input
										name="<?php echo esc_attr( $field_name ); ?>[indexed]"
										type="hidden"
										value="0"
									>
									<label>
										<input
											aria-label="<?php echo esc_html( $post_type_obj->label ); ?>"
											id="<?php echo esc_attr( $field_name ); ?>[indexed]"
											class="searchcraft-checkbox-input searchcraft-indeterminate-checkbox-input"
											name="<?php echo esc_attr( $field_name ); ?>[indexed]"
											type="checkbox"
											value="1"
											<?php echo esc_attr( $is_checked ); ?>
										>
									</label>
								</div>
							</td>
							<?php
								$field_name  = 'searchcraft_schema[weight_multipliers][' . $field_id . ']';
								$field_value = $index['weight_multipliers'][ $field_id ] ?? 1;
							?>
							<td>
								<div class="searchcraft-range-slider-input-wrapper"	data-range-slider>
									<label class="searchcraft-label" for="<?php echo esc_html( $field_name ); ?>">
										Weight
									</label>
									<input
										class="searchcraft-range-slider-input"
										id="<?php echo esc_attr( $field_name ); ?>"
										name="<?php echo esc_attr( $field_name ); ?>"
										min="0.5"
										max="10"
										step="0.1"
										type="range"
										value="<?php echo esc_attr( $field_value ); ?>"
									/>
									<input
										class="searchcraft-input searchcraft-number-input"
										min="0.5"
										max="10"
										step="0.1"
										type="number"
										value="<?php echo esc_attr( $field_value ); ?>"
									>
								</div>
							</td>
						</tr>
						<?php
					}

					$meta_fields = Searchcraft_Helper_Functions::searchcraft_get_meta_keys_for_post_type( $post_type_obj->name );

					if ( ! empty( $meta_fields ) ) {
						foreach ( $meta_fields as $field_key => $field ) {
							$field_id   = esc_attr( $post_type_obj->name . '_' . $field_key );
							$field_name = 'searchcraft_schema[fields][' . $field_id . ']';
							$is_checked = array_key_exists( $field_id, $index['fields'] ) && true === (bool) $index['fields'][ $field_id ]['indexed'] ? 'checked' : '';
							?>
						<tr>
							<td><?php echo esc_html( $field_key ); ?></td>
							<td>
								<div class="searchcraft-checkbox-input-wrapper">
									<?php
									if ( isset( $field['type'] ) ) {
										?>
										<input
											name="<?php echo esc_attr( $field_name ); ?>[type]"
											type="hidden"
											value="<?php echo esc_attr( $field['type'] ); ?>"
										>
										<?php
									}
									if ( isset( $field['sample'] ) ) {
										?>
										<input
											name="<?php echo esc_attr( $field_name ); ?>[sample]"
											type="hidden"
											value="<?php echo esc_attr( $field['sample'] ); ?>"
										>
										<?php
									}
									?>
									<input
										name="<?php echo esc_attr( $field_name ); ?>[indexed]"
										type="hidden"
										value="0"
									>
									<label>
										<input
											aria-label="<?php echo esc_html( $post_type_obj->label ); ?>"
											id="<?php echo esc_attr( $field_name ); ?>[indexed]"
											class="searchcraft-checkbox-input searchcraft-indeterminate-checkbox-input"
											name="<?php echo esc_attr( $field_name ); ?>[indexed]"
											type="checkbox"
											value="1"
											<?php echo esc_attr( $is_checked ); ?>
										>
									</label>
								</div>
							</td>
							<?php
								$field_name  = 'searchcraft_schema[weight_multipliers][' . $field_id . ']';
								$field_value = $index['weight_multipliers'][ $field_id ] ?? 1;
							?>
							<td>
								<div class="searchcraft-range-slider-input-wrapper"	data-range-slider>
									<label class="searchcraft-label" for="<?php echo esc_html( $field_name ); ?>">
										Weight
									</label>
									<input
										class="searchcraft-range-slider-input"
										id="<?php echo esc_attr( $field_name ); ?>"
										name="<?php echo esc_attr( $field_name ); ?>"
										min="0.5"
										max="10"
										step="0.1"
										type="range"
										value="<?php echo esc_attr( $field_value ); ?>"
									/>
									<input
										class="searchcraft-input searchcraft-number-input"
										min="0.5"
										max="10"
										step="0.1"
										type="number"
										value="<?php echo esc_attr( $field_value ); ?>"
									>
								</div>
							</td>
						</tr>
							<?php
						}
					}
					?>
				</table>
			</li>
			<?php
		}
		?>
	</ul>
</div>
<?php
