<?php
/**
 * The facets view.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/admin/partials
 */

$index      = $this->searchcraft_get_index();
$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );
?>
<div class="searchcraft-facets">
	<h2 class="searchcraft-section-heading">Taxonomies</h2>
	<table class="searchcraft-facets-table">
		<?php
		foreach ( $taxonomies as $taxonomy_obj ) {
			$field_id   = esc_attr( $taxonomy_obj->name );
			$field_name = 'searchcraft_schema[fields][' . esc_attr( $field_id ) . ']';
			$is_checked = array_key_exists( $field_id, $index['fields'] ) && true === (bool) $index['fields'][ $field_id ]['indexed'] ? 'checked' : '';
			?>
			<tr>
				<td>
					<?php echo esc_html( $taxonomy_obj->name ); ?>
				</td>
				<td>
					<div class="searchcraft-switch-input-wrapper">
						<input
							name="<?php echo esc_attr( $field_name ); ?>[type]"
							type="hidden"
							value="<?php echo esc_attr( $taxonomy_obj->hierarchical ? 'facet' : 'multi-text' ); ?>"
						>
						<input
							name="<?php echo esc_attr( $field_name ); ?>[indexed]"
							type="hidden"
							value="0"
						>
						<label>
							<input
								aria-label="<?php echo esc_html( $taxonomy_obj->name ); ?>"
								id="<?php echo esc_attr( $field_id ); ?>[indexed]"
								class="searchcraft-switch-input"
								name="<?php echo esc_attr( $field_name ); ?>[indexed]"
								type="checkbox"
								value="1"
								<?php echo esc_attr( $is_checked ); ?>
							>
							<div></div>
						</label>
					</div>
				</td>
				<td>
					<?php
						$field_name  = 'searchcraft_schema[weight_multipliers][' . $field_id . ']';
						$field_value = $index['weight_multipliers'][ $field_id ] ?? 1;
					if ( ! $taxonomy_obj->hierarchical ) {
						?>
							<div class="searchcraft-range-slider-input-wrapper"	data-range-slider>
								<label class="searchcraft-label" for="<?php echo esc_attr( $field_name ); ?>">
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
						<?php
					} else {
						?>
						<p class="searchcraft-caption">
							Taxonomies that are structured in a hierarchy—like categories—don't need a weight.
						</p>
						<?php
					}
					?>
				</td>
			</tr>
			<?php
		}
		?>
	</table>
</div>
<?php
