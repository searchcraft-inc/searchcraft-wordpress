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
            const sdkScript = document.querySelector('script[src*="sdk/components/index.js?v=0.12.0"]');
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

            const config = {
                indexName: searchcraft_config.indexName,
                readKey: searchcraft_config.readKey,
                endpointURL: searchcraft_config.endpointURL,
                searchDebounceDelay: 50,
                searchResultsPerPage: parseInt(searchcraft_config.resultsPerPage) || 10,
                //initialQuery: JSON.stringify({query: [{occur: "should", exact: {ctx: "*"}}], offset: 0, limit: 20})
            };
            (searchcraft_config.cortexURL && searchcraft_config.enableAiSummary) && (config.cortexURL = searchcraft_config.cortexURL);
            const includeFilterPanel = searchcraft_config.includeFilterPanel || false;

            const defaultResultTemplate = (item, index, { html }) => {
                const postDate = item.post_date ? new Date(item.post_date).toLocaleDateString() : '';
                const image = item?.featured_image_url && item.featured_image_url.length > 0 ? html`
                    <div class="searchcraft-result-image">
                        <img src="${item.featured_image_url}" alt="${item.post_title}" />
                    </div>` : '';
                const by = (item.post_author_name && postDate && searchcraft_config.displayPostDate) ? 'By ' : '';
                return html`
                <a class="searchcraft-result-item" href="${item.permalink}">
                    ${searchcraft_config.imageAlignment === 'left' ? image : ''}
                    <div class="searchcraft-result-content">
                        ${(item.primary_category_name && searchcraft_config.displayPrimaryCategory) ? html`<h4 class="searchcraft-result-primary-category">${item.primary_category_name}</h4>` : ''}
                        <h3 class="searchcraft-result-title">${item.post_title}</h3>
                        <p class="searchcraft-result-excerpt">${item.post_excerpt}</p>
                        <div class="searchcraft-result-meta flex">
                            ${(postDate && searchcraft_config.displayPostDate) ? html`<time class="searchcraft-result-date">${postDate}</time> • ` : ''}
                            ${item.post_author_name ? html`<span class="searchcraft-result-author-name">${by}${item.post_author_name}</span>` : ''}
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
                    console.log('Searchcraft: Using custom result template callback');
                } catch (error) {
                    console.warn('Searchcraft: Invalid custom result template callback, using default template', error);
                    searchcraftResultTemplate = defaultResultTemplate;
                }
            }

            const searchcraft = new Searchcraft(config);
            const searchResults = document.querySelectorAll('searchcraft-search-results');
            searchResults.forEach((results) => {
                results.template = searchcraftResultTemplate;
                inheritTextStyles(results);
            });

            // Configure summary box if AI summary is enabled
            if (searchcraft_config.enableAiSummary) {
                const summaryBoxes = document.querySelectorAll('searchcraft-summary-box');
                summaryBoxes.forEach((summaryBox) => {
                    inheritTextStyles(summaryBox);
                });
            }
            if (includeFilterPanel) {
                const filterPanel = document.querySelector('searchcraft-filter-panel');
                if (filterPanel) {
                    const today = new Date();
                    const pastDate = new Date(today);
                    const currentYear = today.getFullYear();
                    const oldestYear = parseInt(searchcraft_config.oldestPostYear);
                    pastDate.setFullYear(oldestYear);
                    let filterPanelItems = [
                        {
                            type: 'mostRecentToggle',
                            fieldName: 'post_date',
                            label: 'Most Recent',
                            options: {
                                subLabel: 'Show the most recently published posts first.',
                            },
                        },
                        {
                            type: 'exactMatchToggle',
                            label: 'Exact Match',
                            options: {
                                subLabel: 'Only show results that precisely match your search.',
                            },
                        },
                        {
                            type: 'dateRange',
                            fieldName: 'post_date',
                            label: 'Filter by Year',
                            options: {
                                minDate: pastDate,
                                granularity: 'year',
                            },
                        },
                    ];

                    // Add facets for each enabled taxonomy
                    if (searchcraft_config.filterTaxonomies && Array.isArray(searchcraft_config.filterTaxonomies)) {
                        searchcraft_config.filterTaxonomies.forEach(taxonomy => {
                            const taxonomyName = taxonomy.name === "category" ? "categories" : taxonomy.name;
                            filterPanelItems.push({
                                type: 'facets',
                                fieldName: taxonomyName,
                                label: `${taxonomy.label}`,
                                options: {
                                    showSublevel: true,
                                },
                            });
                        });
                    }
                    filterPanelItems = filterPanelItems.filter(filter => {
                        // Filter based on config settings
                        if (filter.type === 'mostRecentToggle') {
                            return searchcraft_config.enableMostRecentToggle == true;
                        }
                        if (filter.type === 'exactMatchToggle') {
                            return searchcraft_config.enableExactMatchToggle == true;
                        }
                        if (filter.type === 'dateRange') {
                            // Only show date range if enabled AND there's more than one year of data
                            return searchcraft_config.enableDateRange == true && currentYear !== oldestYear;
                        }
                        if (filter.type === 'facets') {
                            return searchcraft_config.enableFacets == true;
                        }
                        return true;
                    });
                    filterPanel.items = filterPanelItems;
                }
            }
            if (searchcraft_config.searchQuery) {
                await searchcraft.getResponseItems({
                    requestProperties: {
                        mode: 'fuzzy',
                        searchTerm: searchcraft_config.searchQuery,
                    },
                    shouldCacheResultsForEmptyState: false
                });
                const searchInput = document.querySelector('searchcraft-input-form');
                searchInput.inputValue = searchcraft_config.searchQuery;
                setTimeout( () => {
                    searchInput.inputValue = searchcraft_config.searchQuery;
                }, 300);
            }

            const popoverForms = document.querySelectorAll('searchcraft-popover-form');
            const popoverResultMappings = {
                href: {
                    fieldNames: [
                        {
                            fieldName: "permalink",
                            dataType: "text",
                        },
                    ],
                },
                title: {
                    fieldNames: [{ fieldName: "post_title", dataType: "text" }],
                },
                subtitle: {
                    fieldNames: [{ fieldName: "post_excerpt", dataType: "text" }],
                },
                imageSource: {
                    fieldNames: [{ fieldName: "featured_image_url", dataType: "text" }],
                },
                imageAlt: {
                    fieldNames: [{ fieldName: "post_title", dataType: "text" }],
                },
            };

            popoverForms.forEach((form) => {
                form.popoverResultMappings = popoverResultMappings;

                // Inherit text styles from parent
                inheritTextStyles(form);
            });

            // Configure input forms and inherit styles
            const inputForms = document.querySelectorAll('searchcraft-input-form');
            inputForms.forEach((form) => {
                inheritTextStyles(form);
            });

        } catch (error) {
            console.error('Searchcraft: Failed to initialize SDK', error);
            showConfigurationError('Failed to initialize Searchcraft SDK.');
        }
    }

    /**
     * Inherit text styles from parent element
     */
    function inheritTextStyles(component) {
        try {
            // Get computed styles from the parent element
            const parent = component.parentElement;
            if (!parent) return;

            const parentStyles = window.getComputedStyle(parent);

            // Extract text-related properties
            const textProperties = {
                'font-family': parentStyles.fontFamily,
                'font-size': parentStyles.fontSize,
                'font-weight': parentStyles.fontWeight,
                'line-height': parentStyles.lineHeight,
                'color': parentStyles.color,
                'letter-spacing': parentStyles.letterSpacing,
                'text-transform': parentStyles.textTransform
            };

            // Apply styles to the component
            Object.entries(textProperties).forEach(([property, value]) => {
                if (value && value !== 'normal') {
                    component.style.setProperty(property, value, 'important');
                }
            });

            // If the component has a shadow root, inject styles there too
            if (component.shadowRoot) {
                const style = document.createElement('style');
                style.textContent = `
                    * {
                        font-family: ${textProperties['font-family']} !important;
                        font-size: ${textProperties['font-size']} !important;
                        font-weight: ${textProperties['font-weight']} !important;
                        line-height: ${textProperties['line-height']} !important;
                        color: ${textProperties['color']} !important;
                        letter-spacing: ${textProperties['letter-spacing']} !important;
                        text-transform: ${textProperties['text-transform']} !important;
                    }
                    input, input:focus, input:active {
                        font-family: ${textProperties['font-family']} !important;
                        font-size: ${textProperties['font-size']} !important;
                        font-weight: ${textProperties['font-weight']} !important;
                        line-height: ${textProperties['line-height']} !important;
                        color: ${textProperties['color']} !important;
                        letter-spacing: ${textProperties['letter-spacing']} !important;
                        text-transform: ${textProperties['text-transform']} !important;
                    }
                `;
                component.shadowRoot.appendChild(style);
            }

        } catch (error) {
            console.debug('Could not inherit text styles:', error);
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
