<?php
/**
 * The stopwords tab.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 */

$stopwords = $this->searchcraft_get_stopwords();
?>
<div class="searchcraft-stopwords">
	<h2 class="searchcraft-section-heading">Stopwords</h2>
	<form method="post" class="searchcraft-form">
		<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
		<input
			type="hidden"
			name="searchcraft_action"
			value="stopwords"
		/>
		<div class="searchcraft-stopwords-input-wrapper">
			<label class="searchcraft-label" for="stopword">
				Stopword
			</label>
			<input
				class="searchcraft-input searchcraft-text-input"
				id="stopword"
				name="searchcraft_stopwords[]"
				placeholder="Add a stopword..."
				type="text"
			/>
			<?php submit_button( 'Add Stopword' ); ?>
		</div>
		<?php
		if ( ! empty( $stopwords ) ) {
			?>
			<div class="searchcraft-stopwords-list-wrapper">
				<div>
					<p class="searchcraft-label">
						Current Stopwords
					</p>
					<ul class="searchcraft-stopwords-list">
						<?php
						foreach ( $stopwords as $index => $stopword ) {
							?>
							<li class="searchcraft-stopwords-list-item">
								<button class="button button-secondary searchcraft-stopword" data-stopword type="button">
									<span><?php echo esc_html( $stopword ); ?></span>
									<span></span>
									<input type="hidden" name="searchcraft_stopwords[]" value="<?php echo esc_html( $stopword ); ?>">
								</button>
							</li>
							<?php
						}
						?>
					</ul>
				</div>
				<div>
					<div class="searchcraft-textarea-wrapper">
						<?php $stored_str = trim( implode( ', ', $stopwords ) ); ?>
						<textarea class="searchcraft-textarea"  readonly><?php echo esc_attr( $stored_str ); ?></textarea>
						<button class="button button-primary" data-copy-to-clipboard="<?php echo esc_attr( $stored_str ); ?>" type="button">Copy</button>
					</div>
					<p class="searchcraft-caption">
						You can copy the list of stopwords here if you'd like to back it up, use it elsewhere, or keep it for reference .
					</p>
				</div>
			</div>
		<?php } ?>
	</form>
	<?php if ( ! empty( $stopwords ) ) { ?>
		<div class="searchcraft-stopwords-buttons">
			<form method="post" class="searchcraft-form">
				<?php wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' ); ?>
				<input
					type="hidden"
					name="searchcraft_action"
					value="restore_default_stopwords"
				/>
				<?php submit_button( 'Restore default Stopwords', 'primary', 'searchcraft_restore_default_stopwords' ); ?>
			</form>
		</div>
	<?php } ?>
</div>
<?php