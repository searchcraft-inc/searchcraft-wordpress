<?php
/**
 * The admin menu page.
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://searchcraft.io
 * @since      1.0.0
 *
 * @package    Searchcraft
 * @subpackage Searchcraft/admin/partials
 */

$is_configured = Searchcraft_Config::is_configured();
$allowed_tabs  = array( 'overview', 'config', 'layout' );
$requested_tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : 'overview'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
$active_tab    = ( in_array( $requested_tab, $allowed_tabs, true ) ? $requested_tab : 'overview' );
if ( ! $is_configured ) {
	$active_tab = 'config';
}
?>
<div class="searchcraft">
	<h1 class="searchcraft-heading">Searchcraft</h1>
	<div class="wrap">
		<div class="nav-tab-wrapper">
			<a
				href="?page=searchcraft&tab=overview"
				class="<?php echo esc_attr( classNames( 'nav-tab', array( 'nav-tab-active' => 'overview' === $active_tab ) ) ); ?>"
			>
				<?php esc_html_e( 'Overview', 'searchcraft' ); ?>
			</a>
			<a
				href="?page=searchcraft&tab=layout"
				class="<?php echo esc_attr( classNames( 'nav-tab', array( 'nav-tab-active' => 'layout' === $active_tab ) ) ); ?>"
			>
				<?php esc_html_e( 'Layout', 'searchcraft' ); ?>
			</a>
			<a
				href="?page=searchcraft&tab=config"
				class="<?php echo esc_attr( classNames( 'nav-tab', array( 'nav-tab-active' => 'config' === $active_tab ) ) ); ?>"
			>
				<?php esc_html_e( 'Configuration', 'searchcraft' ); ?>
			</a>
		</div>
		<div>
			<?php
			if ( 'overview' === $active_tab ) {
				include_once 'searchcraft-admin-overview-tab.php';
			} elseif ( 'config' === $active_tab ) {
				include_once 'searchcraft-admin-config-tab.php';
			} elseif ( 'layout' === $active_tab ) {
				include_once 'searchcraft-admin-layout-tab.php';
			}

			/*
			} elseif ( 'schema' === $active_tab ) {
				?>
				<form method="post" class="searchcraft-form">
					<?php
					wp_nonce_field( 'searchcraft_settings', 'searchcraft_nonce' );
					?>
					<input
						type="hidden"
						name="searchcraft_action"
						value="schema"
					/>
					<?php
					include_once 'searchcraft-admin-schema-tab.php';
					include_once 'searchcraft-admin-facets-tab.php';
					submit_button();
					?>
				</form>
				<?php
			} elseif ( 'synonyms' === $active_tab ) {
				include_once 'searchcraft-admin-synonyms-tab.php';
			} elseif ( 'stopwords' === $active_tab ) {
				include_once 'searchcraft-admin-stopwords-tab.php';
			} elseif ( 'access-keys' === $active_tab ) {
				include_once 'searchcraft-admin-keys-tab.php';
			}
			*/

			?>
		</div>
	</div>
</div>
<?php
