/**
 * Searchcraft SDK Settings and Template Injection
 *
 * Handles the injection of search header and results templates based on configuration.
 *
 * @since 1.0.0
 */

(function() {
    'use strict';

    let templatesInjected = false;

    /**
     * Initialize template injection after SDK is ready
     */
    function initTemplateInjection() {
        // Prevent double injection
        if (templatesInjected) {
            return;
        }

        // Check if searchcraft settings are available
        if (typeof searchcraftSettings === 'undefined') {
            console.warn('Searchcraft: Settings not found');
            return;
        }

        const settings = searchcraftSettings;

        // Validate required settings
        if (!settings.headerContent) {
            console.warn('Searchcraft: Header content not found');
            return;
        }

        templatesInjected = true;

        // Handle full experience or popover with no container specified
        if (settings.searchExperience === 'full' ||
            (settings.searchExperience === 'popover' && !settings.popoverContainerId)) {
            injectSearchHeader(settings.headerContent, settings.inputContainerId);
            // Inject results content for full experience
            if (settings.searchExperience === 'full' && settings.resultsContent) {
                injectSearchResults(settings.resultsContent, settings.resultsContainerId);
            }
        }
        // Handle popover with specific container
        else if (settings.searchExperience === 'popover' && settings.popoverContainerId) {
            injectPopoverContent(
                settings.headerContent,
                settings.popoverContainerId,
                settings.popoverInsertBehavior
            );
        }

        // Dispatch event to signal templates are injected and ready for configuration
        const templatesReadyEvent = new CustomEvent('searchcraft:templates-injected');
        document.dispatchEvent(templatesReadyEvent);
    }

    /**
     * Configure DOM elements after templates are injected
     * This runs after both SDK initialization and template injection
     */
    function configureComponents(eventDetail) {
        const searchcraft_config = eventDetail.config;
        const searchcraftResultTemplate = eventDetail.resultTemplate;
        const includeFilterPanel = eventDetail.includeFilterPanel;

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
                const pastDate = new Date('2000-01-01');
                const currentYear = today.getFullYear();
                const oldestYear = parseInt(searchcraft_config.oldestPostYear);
                pastDate.setFullYear(oldestYear);

                // Define all available filter items
                const availableFilterItems = {
                    'most_recent': {
                        type: 'mostRecentToggle',
                        fieldName: 'post_date',
                        label: 'Most Recent',
                        options: {
                            subLabel: 'Show the most recently published posts first.',
                        },
                        enabled: searchcraft_config.enableMostRecentToggle == true,
                    },
                    'exact_match': {
                        type: 'exactMatchToggle',
                        label: 'Exact Match',
                        options: {
                            subLabel: 'Only show results that precisely match your search.',
                        },
                        enabled: searchcraft_config.enableExactMatchToggle == true,
                    },
                    'date_range': {
                        type: 'dateRange',
                        fieldName: 'post_date',
                        label: 'Filter by Year',
                        options: {
                            minDate: pastDate,
                            granularity: 'year',
                        },
                        // Only show date range if enabled AND there's more than one year of data
                        enabled: searchcraft_config.enableDateRange == true && currentYear !== oldestYear,
                    },
                    'post_type': {
                        type: 'facets',
                        fieldName: 'type',
                        label: 'Content Type',
                        options: {
                            showSublevel: false,
                        },
                        enabled: searchcraft_config.postTypes && Array.isArray(searchcraft_config.postTypes),
                    },
                    'facets': {
                        type: 'facets',
                        // This will be populated with taxonomy facets
                        enabled: searchcraft_config.enableFacets == true,
                    }
                };

                // Get the filter panel order from config
                const filterPanelOrder = searchcraft_config.filterPanelOrder ||
                    ['most_recent', 'exact_match', 'date_range', 'post_type', 'facets'];

                // Build filterPanelItems array based on the saved order
                let filterPanelItems = [];

                filterPanelOrder.forEach(itemKey => {
                    const item = availableFilterItems[itemKey];

                    if (!item || !item.enabled) {
                        return;
                    }

                    // Special handling for facets - add taxonomy facets
                    if (itemKey === 'facets') {
                        if (searchcraft_config.filterTaxonomies && Array.isArray(searchcraft_config.filterTaxonomies)) {
                            searchcraft_config.filterTaxonomies.forEach(taxonomy => {
                                const taxonomyName = taxonomy.name === "category" ? "categories" : taxonomy.name;
                                const options = {
                                    showSublevel: true,
                                }
                                if (taxonomyName === 'categories' && searchcraft_config.hideUncategorized) {
                                    options.exclude = ['/uncategorized']
                                }
                                filterPanelItems.push({
                                    type: 'facets',
                                    fieldName: taxonomyName,
                                    label: `${taxonomy.label}`,
                                    options
                                });
                            });
                        }
                    } else {
                        // Add the item (without the 'enabled' property)
                        const { enabled, ...itemConfig } = item;
                        filterPanelItems.push(itemConfig);
                    }
                });

                filterPanel.items = filterPanelItems;
            }
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
    }

    /**
     * Inject search header after the first header element or into a specific container
     *
     * @param {string} headerContent - The HTML content for the search header
     * @param {string} inputContainerId - Optional container ID(s) to inject the header into (comma-separated for multiple)
     */
    function injectSearchHeader(headerContent, inputContainerId) {
        // If inputContainerId is provided and not empty, inject as first element in that container
        if (inputContainerId && inputContainerId.trim() !== '') {
            // Check if multiple IDs are provided (comma-separated)
            if (inputContainerId.includes(',')) {
                const containerIds = inputContainerId.split(',').map(id => id.trim()).filter(id => id !== '');
                let injectedCount = 0;

                // Inject into each container
                containerIds.forEach(containerId => {
                    const targetContainer = document.getElementById(containerId);
                    if (targetContainer) {
                        const searchHeaderDiv = document.createElement('div');
                        searchHeaderDiv.innerHTML = headerContent;
                        targetContainer.insertBefore(searchHeaderDiv, targetContainer.firstChild);
                        injectedCount++;
                    }
                });

                // If at least one injection was successful, return
                if (injectedCount > 0) {
                    return;
                }
            } else {
                // Single ID
                const targetContainer = document.getElementById(inputContainerId);
                if (targetContainer) {
                    const searchHeaderDiv = document.createElement('div');
                    searchHeaderDiv.innerHTML = headerContent;
                    targetContainer.insertBefore(searchHeaderDiv, targetContainer.firstChild);
                    return;
                }
            }
        }

        // Default behavior: inject after the first header element
        const searchHeaderDiv = document.createElement('div');
        searchHeaderDiv.innerHTML = headerContent;
        const firstHeader = document.querySelector('header') || document.querySelector('[id="header"]');

        if (firstHeader) {
            // Insert after the header element
            if (firstHeader.nextSibling) {
                firstHeader.parentNode.insertBefore(searchHeaderDiv, firstHeader.nextSibling);
            } else {
                firstHeader.parentNode.appendChild(searchHeaderDiv);
            }
        } else {
            // Fallback: if no header found, append to body
            document.body.insertBefore(searchHeaderDiv, document.body.firstChild);
        }
    }

    /**
     * Inject search results content
     *
     * @param {string} resultsContent - The HTML content for search results
     * @param {string} resultsContainerId - Optional container ID for results
     */
    function injectSearchResults(resultsContent, resultsContainerId) {
        const searchInputContainer = document.querySelector('.searchcraft-input-container');

        if (resultsContainerId) {
            const customContainer = document.getElementById(resultsContainerId);
            if (customContainer) {
                customContainer.insertAdjacentHTML('afterbegin', resultsContent);
            } else if (searchInputContainer) {
                searchInputContainer.insertAdjacentHTML('afterend', resultsContent);
            }
        } else if (searchInputContainer) {
            searchInputContainer.insertAdjacentHTML('afterend', resultsContent);
        }
    }

    /**
     * Inject popover content into specified container
     *
     * @param {string} popoverContent - The HTML content for the popover
     * @param {string} popoverContainerId - The container ID or class name
     * @param {string} insertBehavior - 'replace' or 'prepend'
     */
    function injectPopoverContent(popoverContent, popoverContainerId, insertBehavior) {
        let targetElement = null;

        // Try to find by ID first
        const customPopoverContainerById = document.getElementById(popoverContainerId);
        if (customPopoverContainerById) {
            targetElement = customPopoverContainerById;
        }

        // If not found by ID, try by class
        if (!targetElement) {
            const customPopoverContainerByClass = document.querySelector(`[class="${popoverContainerId}"]`);
            if (customPopoverContainerByClass) {
                targetElement = customPopoverContainerByClass;
            }
        }

        if (targetElement) {
            if (insertBehavior === 'replace') {
                targetElement.innerHTML = popoverContent;
            } else {
                targetElement.insertAdjacentHTML('afterbegin', popoverContent);
            }
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
            // Silently fail if text styles cannot be inherited
        }
    }

    // Coordination between SDK initialization and template injection
    let sdkReady = false;
    let sdkEventDetail = null;

    // Listen for SDK ready event
    document.addEventListener('searchcraft:sdk-ready', function(event) {
        sdkReady = true;
        sdkEventDetail = event.detail;

        // Inject templates now that SDK is ready
        initTemplateInjection();
    });

    // Listen for templates injected event, then configure components
    document.addEventListener('searchcraft:templates-injected', function() {
        if (sdkReady && sdkEventDetail) {
            // Configure components now that templates are in the DOM
            configureComponents(sdkEventDetail);
        }
    });

})();
