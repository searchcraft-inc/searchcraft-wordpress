/**
 * Searchcraft JavaScript SDK Integration
 *
 * This file handles the initialization and configuration of Searchcraft
 * JavaScript SDK components in WordPress.
 *
 * @since 1.0.0
 */

(function() {
    'use strict';

    /**
     * Initialize Searchcraft SDK when DOM is ready
     */
    function initSearchcraftSDK() {
        // Check if configuration is available
        if (typeof searchcraft_config === 'undefined' || !searchcraft_config) {
            console.warn('Searchcraft: Configuration not found - SDK integration disabled');
            showConfigurationError('Configuration not available');
            return;
        }

        // Validate required configuration
        if (!searchcraft_config.indexName || !searchcraft_config.readKey || !searchcraft_config.endpointURL) {
            console.warn('Searchcraft: Missing required configuration values');
            showConfigurationError('Missing required configuration values');
            return;
        }

        if (typeof searchcraft_config.readKey !== 'string' || searchcraft_config.readKey.length < 10) {
            console.warn('Searchcraft: Invalid read key');
            showConfigurationError('Invalid read key');
            return;
        }

        if (typeof searchcraft_config.endpointURL !== 'string' || !isValidURL(searchcraft_config.endpointURL)) {
            console.warn('Searchcraft: Invalid endpoint URL');
            showConfigurationError('Invalid endpoint URL');
            return;
        }

        // Load Searchcraft SDK using dynamic import
        loadSearchcraftSDK();
    }

    /**
     * Load Searchcraft SDK
     */
    async function loadSearchcraftSDK() {
        try {
            // Get the SDK script element to determine the module URL
            const sdkScript = document.querySelector('script[src*="sdk/components/index.js?v=0.13.0"]');
            if (!sdkScript) {
                console.error('Searchcraft: SDK script not found');
                showConfigurationError('SDK script not found');
                return;
            }

            // Import the Searchcraft class from the SDK module
            const sdkModule = await import(sdkScript.src);
            const { Searchcraft } = sdkModule;

            if (!Searchcraft) {
                console.error('Searchcraft: Searchcraft class not found in SDK module');
                showConfigurationError('Searchcraft class not found in SDK module');
                return;
            }
            const isWPSearchPage = searchcraft_config.isWPSearchPage || false;
            const config = {
                indexName: searchcraft_config.indexName,
                readKey: searchcraft_config.readKey,
                endpointURL: searchcraft_config.endpointURL,
                searchDebounceDelay: 50,
                searchResultsPerPage: parseInt(searchcraft_config.resultsPerPage) || 10
            };

            // Add cortexURL if AI summary is enabled
            if (searchcraft_config.cortexURL && searchcraft_config.enableAiSummary) {
                config.cortexURL = searchcraft_config.cortexURL;
            }

            // Set initialQuery based on page type
            if (isWPSearchPage) {
                if (searchcraft_config.searchQuery) {
                    // Don't set initial query.
                } else {
                    config.initialQuery = JSON.stringify({query: {exact: {ctx: "*"}}});
                }
            }

            const includeFilterPanel = searchcraft_config.includeFilterPanel || false;

            const defaultResultTemplate = (item, index, { html }) => {
                const postDate = item.post_date ? new Date(item.post_date).toLocaleDateString() : '';
                const image = item?.featured_image_url && item.featured_image_url.length > 0 ? html`
                    <div class="searchcraft-result-image">
                        <img src="${item.featured_image_url}" alt="${item.post_title}" />
                    </div>` : '';

                const author_name = Array.isArray(item.post_author_name)
                    ? item.post_author_name.filter(name => name && name.trim()).join(', ')
                    : (item.post_author_name || '');

                const by = (author_name && postDate && searchcraft_config.displayPostDate) ? 'By ' : '';
                return html`
                <a class="searchcraft-result-item" href="${item.permalink}">
                    ${searchcraft_config.imageAlignment === 'left' ? image : ''}
                    <div class="searchcraft-result-content">
                        ${(item.primary_category_name && searchcraft_config.displayPrimaryCategory) ? html`<h4 class="searchcraft-result-primary-category">${item.primary_category_name}</h4>` : ''}
                        <h3 class="searchcraft-result-title">${item.post_title}</h3>
                        <p class="searchcraft-result-excerpt">${item.post_excerpt}</p>
                        <div class="searchcraft-result-meta flex">
                            ${(postDate && searchcraft_config.displayPostDate) ? html`<time class="searchcraft-result-date">${postDate}</time> • ` : ''}
                            ${author_name ? html`<span class="searchcraft-result-author-name">${by}${author_name}</span>` : ''}
                        </div>
                    </div>
                    ${searchcraft_config.imageAlignment === 'right' ? image : ''}
                </a>
                `;
            };

            // Use custom result template callback if provided, otherwise use default
            let searchcraftResultTemplate = defaultResultTemplate;
            if (searchcraft_config.resultTemplateCallback) {
                try {
                    searchcraftResultTemplate = new Function('return ' + searchcraft_config.resultTemplateCallback)();
                } catch (error) {
                    console.warn('Searchcraft: Invalid custom result template callback, using default template', error);
                    searchcraftResultTemplate = defaultResultTemplate;
                }
            }

            const searchcraft = new Searchcraft(config);

            // Make searchcraft instance globally available
            window.searchcraft = searchcraft;

            // Wait for the SDK to fully initialize before dispatching ready event
            // The SDK initializes clients asynchronously and emits 'initialized' when done
            searchcraft.subscribe('initialized', () => {

                // Dispatch event to signal SDK is ready
                // DOM configuration will happen after templates are injected
                const sdkReadyEvent = new CustomEvent('searchcraft:sdk-ready', {
                    detail: {
                        searchcraft: window.searchcraft,
                        config: searchcraft_config,
                        resultTemplate: searchcraftResultTemplate,
                        includeFilterPanel: includeFilterPanel
                    }
                });
                document.dispatchEvent(sdkReadyEvent);
            });

        } catch (error) {
            console.error('Searchcraft: Failed to initialize SDK', error);
            showConfigurationError('Failed to initialize Searchcraft SDK.');
        }
    }

    /**
     * Validate URL format
     */
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Show configuration error message
     */
    function showConfigurationError(message) {
        // Only show errors on search pages or if there are Searchcraft components
        const hasSearchcraftComponents = document.querySelector('searchcraft-popover-form, searchcraft-input-form, searchcraft-search-results');
        const isSearchPage = document.body.classList.contains('search') || window.location.search.includes('s=');

        if (!hasSearchcraftComponents && !isSearchPage) {
            return;
        }

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'searchcraft-config-error';
        errorDiv.innerHTML = `
            <p><strong>Searchcraft Configuration Error:</strong> ${message}</p>
            <p>Please check your Searchcraft settings in the WordPress admin.</p>
        `;

        // Add error styles
        errorDiv.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
            font-family: inherit;
        `;

        // Insert error message where Searchcraft components should be
        const searchContainer = document.querySelector('.searchcraft-search-page, .searchcraft-search-container');
        if (searchContainer) {
            searchContainer.insertBefore(errorDiv, searchContainer.firstChild);
        } else {
            // Fallback: add to body
            document.body.appendChild(errorDiv);
        }
    }

    document.addEventListener('DOMContentLoaded', initSearchcraftSDK);

})();
