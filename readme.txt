=== Searchcraft ===
Donate link: https://searchcraft.io/
Contributors: searchcraft
Tags:         search, fuzzy search, better search, instant search, search replacement
Requires at least: 5.0
Tested up to: 6.8
Stable tag:   1.0.0
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
