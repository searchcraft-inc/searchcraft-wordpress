import { p as proxyCustomElement, H, h } from './p-DO5g2x-l.js';
import { r as registry } from './p-D0j0UFpV.js';
import { d as defineCustomElement$4 } from './p-BV4HUriZ.js';
import { d as defineCustomElement$3 } from './p-BbSxfaD7.js';
import { d as defineCustomElement$2 } from './p-D5p2scT9.js';

const SearchcraftFilterPanel$1 = /*@__PURE__*/ proxyCustomElement(class SearchcraftFilterPanel extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
    }
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    /**
     * The items to filter.
     */
    items = [];
    /**
     * The breakpoint (in pixels) below which the filter panel will be hidden.
     * Defaults to 768px (--sc-breakpoint-md).
     */
    responsiveBreakpoint = 768;
    /**
     * Controls whether the filter panel automatically hides/shows based on window size.
     * - 'auto': Automatically hide/show based on window width
     * - 'manual': User controls visibility manually
     */
    responsiveBehavior = 'auto';
    lastSearchTerm;
    isFilterPanelVisible = true;
    get hostElement() { return this; }
    core;
    unsubscribe;
    cleanupCore;
    resizeObserver;
    manuallyToggled = false; // Track if user manually toggled visibility
    toggleClickHandler;
    onCoreAvailable(core) {
        this.core = core;
        this.setInitialDateRanges();
        // Initialize visibility based on current window size if in auto mode
        if (this.responsiveBehavior === 'auto') {
            this.updateVisibilityBasedOnWindowSize();
        }
        this.unsubscribe = core.store.subscribe((state, prevState) => {
            this.lastSearchTerm = state.searchTerm || '';
            // Check if visibility was manually changed (not by auto-resize)
            if (prevState.isFilterPanelVisible !== state.isFilterPanelVisible) {
                const windowWidth = window.innerWidth;
                const autoVisibility = windowWidth >= (this.responsiveBreakpoint || 768);
                // If the new state differs from what auto mode would set, it was manual
                if (state.isFilterPanelVisible !== autoVisibility) {
                    this.manuallyToggled = true;
                }
                // Update toggle element attributes when visibility changes
                this.updateToggleElementAttributes(state.isFilterPanelVisible);
            }
            this.isFilterPanelVisible = state.isFilterPanelVisible;
        });
    }
    componentDidLoad() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
        // Set up resize observer if in auto mode
        if (this.responsiveBehavior === 'auto' && typeof window !== 'undefined') {
            this.setupResizeObserver();
        }
        // Set up click handlers for elements with data-toggle-filter-panel attribute
        this.setupToggleClickHandlers();
        // Set initial toggle element state immediately
        // Use setTimeout to ensure this runs after the store is initialized
        setTimeout(() => {
            if (this.core) {
                const currentVisibility = this.core.store.getState().isFilterPanelVisible;
                this.updateToggleElementAttributes(currentVisibility);
            }
        }, 0);
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
        this.resizeObserver?.disconnect();
        // Clean up window resize listener if it was used as fallback
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleWindowResize);
        }
        // Clean up toggle click handlers
        this.cleanupToggleClickHandlers();
    }
    /**
     * Sets up a ResizeObserver to watch for window size changes
     */
    setupResizeObserver() {
        if (typeof ResizeObserver === 'undefined') {
            // Fallback to window resize event if ResizeObserver is not available
            window.addEventListener('resize', this.handleWindowResize);
            return;
        }
        this.resizeObserver = new ResizeObserver(() => {
            this.handleWindowResize();
        });
        // Observe the document body for size changes
        this.resizeObserver.observe(document.body);
    }
    /**
     * Handles window resize events
     */
    handleWindowResize = () => {
        if (this.responsiveBehavior === 'auto') {
            this.updateVisibilityBasedOnWindowSize();
        }
    };
    /**
     * Updates filter panel visibility based on current window width
     */
    updateVisibilityBasedOnWindowSize() {
        if (typeof window === 'undefined')
            return;
        // Don't auto-hide/show if user manually toggled it
        if (this.manuallyToggled)
            return;
        const windowWidth = window.innerWidth;
        const shouldBeVisible = windowWidth >= (this.responsiveBreakpoint || 768);
        if (this.core && this.isFilterPanelVisible !== shouldBeVisible) {
            this.core.store.getState().setFilterPanelVisibility(shouldBeVisible);
        }
    }
    /**
     * Sets up click handlers for elements with data-toggle-filter-panel attribute
     */
    setupToggleClickHandlers() {
        if (typeof document === 'undefined')
            return;
        this.toggleClickHandler = (event) => {
            // Only allow toggle on mobile (below breakpoint)
            const windowWidth = window.innerWidth;
            if (windowWidth >= (this.responsiveBreakpoint || 768)) {
                return; // Don't toggle on desktop
            }
            event.preventDefault();
            if (this.core) {
                const currentVisibility = this.core.store.getState().isFilterPanelVisible;
                this.core.store.getState().setFilterPanelVisibility(!currentVisibility);
            }
        };
        // Find all elements with the data attribute
        const toggleElements = document.querySelectorAll('[data-toggle-filter-panel]');
        toggleElements.forEach((element) => {
            if (this.toggleClickHandler) {
                element.addEventListener('click', this.toggleClickHandler);
            }
        });
    }
    /**
     * Updates data attributes on toggle elements to reflect panel visibility state
     */
    updateToggleElementAttributes(isVisible) {
        if (typeof document === 'undefined')
            return;
        const toggleElements = document.querySelectorAll('[data-toggle-filter-panel]');
        toggleElements.forEach((element) => {
            if (isVisible) {
                element.removeAttribute('data-filter-panel-collapsed');
                element.setAttribute('data-filter-panel-expanded', '');
            }
            else {
                element.removeAttribute('data-filter-panel-expanded');
                element.setAttribute('data-filter-panel-collapsed', '');
            }
        });
    }
    /**
     * Cleans up click handlers for toggle elements
     */
    cleanupToggleClickHandlers() {
        if (typeof document === 'undefined' || !this.toggleClickHandler)
            return;
        const toggleElements = document.querySelectorAll('[data-toggle-filter-panel]');
        toggleElements.forEach((element) => {
            if (this.toggleClickHandler) {
                element.removeEventListener('click', this.toggleClickHandler);
            }
        });
    }
    /**
     * Sets the initial min/max date range values for search queries based on the filter items provided.
     */
    setInitialDateRanges() {
        for (const item of this.items) {
            if (item.type === 'dateRange') {
                const dateItem = item;
                const startingMinDate = dateItem.options.minDate;
                const startingMaxDate = dateItem.options.maxDate || new Date();
                this.core?.store.getState()?.addRangeValueForIndexField({
                    fieldName: dateItem.fieldName,
                    value: `${dateItem.fieldName}:[${startingMinDate.toISOString()} TO ${startingMaxDate.toISOString()}]`,
                });
            }
        }
    }
    handleDateRangeChanged(item, min, max) {
        const start = new Date(min);
        const end = new Date(max);
        this.core?.store.getState()?.addRangeValueForIndexField({
            fieldName: item.fieldName,
            value: `${item.fieldName}:[${start.toISOString()} TO ${end.toISOString()}]`,
        });
        this.core?.store.getState()?.search();
    }
    handleNumericRangeChanged(fieldName, min, max) {
        this.core?.store.getState()?.addRangeValueForIndexField({
            fieldName,
            value: `${fieldName}:[${min} TO ${max}]`,
        });
        this.core?.store.getState()?.search();
    }
    handleFacetSelectionUpdated(fieldName, paths) {
        if (paths.length > 0) {
            this.core?.store.getState()?.addFacetPathsForIndexField({
                fieldName,
                value: `${fieldName}: IN [${paths.join(' ')}]`,
            });
        }
        else {
            this.core?.store.getState()?.removeFacetPathsForIndexField(fieldName);
        }
        this.core?.store.getState()?.search();
    }
    handleExactMatchToggleUpdated(isActive) {
        this.core?.store.getState()?.setSearchMode(isActive ? 'exact' : 'fuzzy');
        this.core?.store.getState()?.search();
    }
    handleMostRecentToggleUpdated(fieldName, isActive) {
        if (isActive) {
            this.core?.store.getState()?.setSortOrder({
                orderByField: fieldName,
                sortType: 'desc',
            });
        }
        else {
            this.core?.store.getState()?.setSortOrder({
                orderByField: null,
                sortType: null,
            });
        }
        this.core?.store.getState()?.search();
    }
    /**
     * Iterate through `items` and render them based on `type`
     */
    render() {
        // Don't render if not visible
        if (!this.isFilterPanelVisible) {
            return null;
        }
        return (h("div", { class: 'searchcraft-filter-panel' }, this.items.map((filterItem) => {
            switch (filterItem.type) {
                case 'dateRange': {
                    const item = filterItem;
                    const maxDate = item.options.maxDate || new Date();
                    // return date range slider
                    return (h("div", { class: 'searchcraft-filter-panel-section' }, h("p", { class: 'searchcraft-filter-panel-label' }, filterItem.label), h("searchcraft-slider", { min: item.options.minDate.getTime(), max: maxDate.getTime(), dataType: 'date', step: 1, dateGranularity: item.options.granularity, onRangeChanged: (event) => {
                            this.handleDateRangeChanged(item, event.detail.startValue, event.detail.endValue);
                        } })));
                }
                case 'numericRange': {
                    const item = filterItem;
                    // return date range slider
                    return (h("div", { class: 'searchcraft-filter-panel-section' }, h("p", { class: 'searchcraft-filter-panel-label' }, filterItem.label), h("searchcraft-slider", { min: item.options.min, max: item.options.max, step: item.options.granularity, onRangeChanged: (event) => {
                            this.handleNumericRangeChanged(item.fieldName, event.detail.startValue, event.detail.endValue);
                        } })));
                }
                case 'facets': {
                    const item = filterItem;
                    // return "filters-list"
                    return (h("div", { class: 'searchcraft-filter-panel-section' }, h("p", { class: 'searchcraft-filter-panel-label' }, filterItem.label), h("searchcraft-facet-list", { fieldName: item.fieldName, exclude: item.options.exclude, onFacetSelectionUpdated: (event) => {
                            this.handleFacetSelectionUpdated(item.fieldName, event.detail.paths);
                        } })));
                }
                case 'exactMatchToggle': {
                    const item = filterItem;
                    return (h("searchcraft-toggle-button", { label: item.label, subLabel: item.options.subLabel, onToggleUpdated: (event) => {
                            this.handleExactMatchToggleUpdated(event.detail);
                        } }));
                }
                case 'mostRecentToggle': {
                    const item = filterItem;
                    return (h("searchcraft-toggle-button", { label: item.label, subLabel: item.options.subLabel, onToggleUpdated: (event) => {
                            this.handleMostRecentToggleUpdated(item.fieldName, event.detail);
                        } }));
                }
            }
        })));
    }
}, [768, "searchcraft-filter-panel", {
        "searchcraftId": [1, "searchcraft-id"],
        "items": [16],
        "responsiveBreakpoint": [2, "responsive-breakpoint"],
        "responsiveBehavior": [1, "responsive-behavior"],
        "lastSearchTerm": [32],
        "isFilterPanelVisible": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-filter-panel", "searchcraft-facet-list", "searchcraft-slider", "searchcraft-toggle-button"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-filter-panel":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftFilterPanel$1);
            }
            break;
        case "searchcraft-facet-list":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "searchcraft-slider":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "searchcraft-toggle-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const SearchcraftFilterPanel = SearchcraftFilterPanel$1;
const defineCustomElement = defineCustomElement$1;

export { SearchcraftFilterPanel, defineCustomElement };
//# sourceMappingURL=searchcraft-filter-panel.js.map

//# sourceMappingURL=searchcraft-filter-panel.js.map