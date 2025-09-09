/**
 * Searchcraft SDK Settings and Template Injection
 *
 * Handles the injection of search header and results templates based on configuration.
 * This script replaces the inline JavaScript previously generated in inject_search_header_script.
 *
 * @since 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
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

    // Handle full experience or popover with no container specified
    if (settings.searchExperience === 'full' ||
        (settings.searchExperience === 'popover' && !settings.popoverContainerId)) {

        injectSearchHeader(settings.headerContent);
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
});

/**
 * Inject search header after the first header element
 *
 * @param {string} headerContent - The HTML content for the search header
 */
function injectSearchHeader(headerContent) {
    const firstHeader = document.querySelector('header') || document.querySelector('[id="header"]');
    const searchHeaderDiv = document.createElement('div');

    searchHeaderDiv.innerHTML = headerContent;

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
    } else {
        console.log('Searchcraft: unable to find popover container element.');
    }
}
