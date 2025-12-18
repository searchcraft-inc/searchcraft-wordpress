=== Searchcraft ===
Donate link: https://searchcraft.io/
Contributors: searchcraft
Tags:         search, fuzzy search, better search, instant search, search replacement
Requires at least: 5.3
Tested up to: 6.9
Stable tag:   1.2.2
License:      Apache 2.0
License URI:  LICENSE.txt

Bring fast, relevant search to your site. Searchcraft replaces the default search with a customizable, tunable, highly relevant search experience.


== Description ==
Searchcraft brings fast, relevant search to your site. You can choose between a near-instant keyword search or utilize AI to generate post summaries that are powered by your own content. Searchcraft doesn't add any bloat to your database, it's index data is stored remotely and is designed to be a drop-in replacement for the default search.

== Features ==

* Fast, relevant search that can scale to hundreds of millions of posts.
* Drop-in replacement for default search.
* Instant results.
* Choose which content is searchable and which to exclude. Supports both posts and pages.
* Multiple layout options including pop-over and faceted search.
* Customizable search fields and weighting.
* Synonyms (configured via Searchcraft Cloud).
* Stopwords (configured via Searchcraft Cloud).
* Search analytics (via Searchcraft Cloud).
* Works with Searchcraft Cloud or self-hosted Searchcraft Core.

== Installation ==

1. Create an account on [Searchcraft Cloud](https://vektron.searchcraft.io/) via the Vektron dashboard.
2. Within Vektron, follow onboarding steps to create a new application and index, selecting the "Wordpress" template on index creation. Copy the provided endpoint url, index name, ingest key and read key values.
3. Activate the plugin in WordPress.
4. Within Wordpress navigate to the Searchcraft settings page and fill in the cluster url, API keys and index name.
5. That's it! Searchcraft will automatically prepare your post content for search.

== Frequently Asked Questions ==

= How does Searchcraft work? =

The Searchcraft plugin is a drop-in replacement for the default search experience on WordPress. It is intended to be used with the Searchcraft Cloud SaaS service. Functionally, it will work with self-hosted Searchcraft instances but it will require manual configuration on the Searchcraft Core engine side.

= Can I use Searchcraft with WooCommerce? =

Woocommerce is not supported with the Searchcraft plugin at this time, this plugin is intended for use with standard WordPress posts.

= Can I use the Searchcraft plugin with custom post types? =

Custom post types are not supported at this time.

= How do I use the Searchcraft plugin with multiple domains? =

If you are hosting WordPress in a multi-environment setting (eg, live and staging) you should setup an index for both domains.

= If I want to self-host Searchcraft Core to use with the Searchcraft plugin, what do I need to do? =

Contact the Searchcraft team on our [Discord server](https://discord.gg/y3zUHkBk6e) and we can help! For self-hosted Searchcraft Core there are support plans available.

= Where can I find the Searchcraft plugin documentation? =

Documentation for the Searchcraft plugin can be found on our [developer documentation](https://docs.searchcraft.io/).

= I would like to report a bug or request a feature =

If you would like to report an issue or suggest an enhancement you may contact the team on our [issues GitHub repository](https://github.com/searchcraft-inc/searchcraft-issues). We do not provide support on the WordPress.org forums.

Searchcraft Cloud customers may also reach out via our Discord server for assistance or to request a custom feature.

== Changelog ==

= 1.2.2 =
* Minor bugfixes

= 1.2.1 =
* Bugfix - Filter panel start date bug.

= 1.2.0 =
* New Feature - Add support for Molongui Authorship authors
* New Feature - Add support to add search input to multiple elements on a page when "send to search page" option is used
* New Feature - Add option to retain stock get_search_form under advanced options
* Improvement - Added cache control headers to reduce browser caching issues after plugin updates
* Updates Searchcraft JavaScript SDK to v0.13.2

= 1.1.3 =
* Additional bugfixes

= 1.1.2 =
* Bugfix - option check for PublishPress authors.

= 1.1.1 =
* New Feature - Custom post type and custom fields support is here! If you have a custom type you can now add it to the same search index as the standard WordPress post type. You can also optionally include custom fields from these types.
* New Feature - Filter panel items are now re-orderable.
* New Feature - Search requests now differentiate between signed in and signed out users.
* New Feature - Filter label colors are now editable via layout GUI.
* Updates Searchcraft JavaScript SDK to v0.13.1
* Bugfix - option check for PublishPress authors.
* Bugfix - Precision fix for float values ending with zeros (via Searchraft PHP client update).
* WP 6.9 compatibility.

= 1.1.0 =

* Adds support for multiple authors on a post and and a configuration option for using PostPublish authors instead of the stock WP authors if the plugin is present.

= 1.0.3 =

* Update Searchcraft JavaScript SDK to v0.12.2 (related to facet exclusion feature)
* Add ability to exclude "Uncategorized" category facet from the search filter panel.

= 1.0.2 =

* Memory usage optimization for systems with large amounts of posts and small memory allocated to PHP

= 1.0.1 =

* Update Searchcraft JavaScript SDK to v0.12.1
* Layout configuration screen is now a single form with a unified save button
* Added ability to choose a DOM elemnent by ID to inject the search form into. This overrides the default auto-detect behavior when used.
* Additional layout customization options and more color settings.
* Support for initialQuery.
* Added additional layout advanced options and support for submitting to the stand alone WordPress search page.
* Added documentation link for custom result templates.
* Added support to choose between column and grid layouts, hiding showing primary category and pub date without needing a custom result template.
* Filter panel and summary box customization features.
* Re-arranged layout admin tab to group AI summary settings together.
* Made first load of overview tab more intuitive.
* Support for custom taxonomies as facet fields.
* General bug-fixes and improvments.

= 1.0.0 =

* Initial release. Uses Searchcraft JavaScript SDK v0.11.1 and Searchcraft PHP Client v0.7.5

== External services ==

This plugin connects to an API either hosted by Searchcraft, Inc. or self-hosted by the user. Post and Page content is sent to the API for indexing on an opt-in basis. No user data or site content is shared with any third parties.
