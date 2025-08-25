<?php
	/**
	 * The exclude from Searchcraft meta box on the right side of all posts.
	 *
	 * This file is used to markup the admin-facing aspects of the plugin.
	 *
	 * @link       https://searchcraft.io
	 * @since      1.0.0
	 *
	 * @package    Searchcraft
	 * @subpackage Searchcraft/admin/partials
	 */

	$post_meta  = get_post_meta( $post->ID, '_searchcraft_exclude_from_index', true );
	$is_checked = isset( $post_meta ) && '1' === $post_meta ? 'checked' : '';
	wp_nonce_field( 'searchcraft_custom_meta_boxes', 'searchcraft_exclude_from_searchcraft_nonce' );
?>
	<label>
		<div class="searchcraft-switch-input-wrapper">
			<span class="searchcraft-label searchcraft-sidebar-label">
				Exclude from search
			</span>
			<input
				class="searchcraft-switch-input"
				id="searchcraft_exclude_from_index"
				name="searchcraft_exclude_from_index"
				type="checkbox"
				value="1"
				<?php echo esc_attr( $is_checked ); ?>
			>
			<div></div>
		</div>
	</label>
<?php