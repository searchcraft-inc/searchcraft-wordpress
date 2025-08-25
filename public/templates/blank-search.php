<?php
/**
 * Blank Search Template for Searchcraft
 *
 * This template replaces the default WordPress search results page
 * when Searchcraft plugin is active. The search functionality is
 * handled by the Searchcraft header template instead.
 *
 * @package Searchcraft
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header(); ?>

<main class="searchcraft-blank-search-page">
</main>

<?php get_footer(); ?>