import { p as proxyCustomElement, H, h } from './p-5365011f.js';
import { r as registry } from './p-e30203b1.js';
import { d as defineCustomElement$4 } from './p-0c495408.js';
import { d as defineCustomElement$3 } from './p-c9b65e8f.js';
import { d as defineCustomElement$2 } from './p-02ad136b.js';

const SearchcraftFilterPanel$1 = /*@__PURE__*/ proxyCustomElement(class SearchcraftFilterPanel extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    /**
     * The items to filter.
     */
    items = [];
    lastSearchTerm;
    core;
    unsubscribe;
    cleanupCore;
    onCoreAvailable(core) {
        this.core = core;
        this.setInitialDateRanges();
        this.unsubscribe = core.store.subscribe((state) => {
            this.lastSearchTerm = state.searchTerm || '';
        });
    }
    componentDidLoad() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
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
        return (h("div", { key: 'b18a05516bea8d145d1ca015835d63fafbfc8bd8', class: 'searchcraft-filter-panel' }, this.items.map((filterItem) => {
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
                    return (h("div", { class: 'searchcraft-filter-panel-section' }, h("p", { class: 'searchcraft-filter-panel-label' }, filterItem.label), h("searchcraft-facet-list", { fieldName: item.fieldName, onFacetSelectionUpdated: (event) => {
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
}, [0, "searchcraft-filter-panel", {
        "searchcraftId": [1, "searchcraft-id"],
        "items": [16],
        "lastSearchTerm": [32]
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