import { p as proxyCustomElement, H, h } from './p-5365011f.js';
import { r as registry } from './p-e30203b1.js';
import { d as defineCustomElement$2 } from './p-73db9122.js';

const SearchcraftSearchResultsPerPage$1 = /*@__PURE__*/ proxyCustomElement(class SearchcraftSearchResultsPerPage extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    /**
     * The amount the options will increase (e.g. 20 = [20, 40, 60, 80, 100]).
     * The base value is defined by the `searchResultsPerPage` option in the configuration.
     */
    increment = 20;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    // store vars
    searchTerm;
    searchResultsPage;
    searchResultsPerPage;
    searchResultsCount;
    searchResultsPagesCount;
    // local vars
    initialSearchResultsPerPage;
    // store functions
    setSearchResultsPerPage = () => { };
    setSearchResultsPage = () => { };
    unsubscribe = () => { };
    cleanupCore;
    onCoreAvailable(core) {
        this.unsubscribe = core.store.subscribe((state) => {
            // store vars
            this.searchTerm = state.searchTerm;
            this.searchResultsPerPage = state.searchResultsPerPage;
            this.searchResultsPage = state.searchResultsPage;
            this.searchResultsCount = state.searchResultsCount;
            // local vars
            this.searchResultsPagesCount = Math.ceil(this.searchResultsCount / this.searchResultsPerPage);
            // store functions
            this.setSearchResultsPage = state.setSearchResultsPage;
            this.setSearchResultsPerPage = state.setSearchResultsPerPage;
        });
        this.initialSearchResultsPerPage =
            core.store.getState().searchResultsPerPage;
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
    }
    render() {
        // early return if there isn't a searchTerm or there is 1 or fewer pages of results
        if (!this.searchTerm || this.searchResultsPagesCount <= 1) {
            return;
        }
        return (h("div", { class: 'searchcraft-search-results-per-page' }, h("div", { class: 'searchcraft-search-results-per-page-select' }, h("label", { class: 'searchcraft-search-results-per-page-select-label', htmlFor: 'searchcraft-search-results-per-page-select-input' }, "Results Per Page"), h("div", { class: 'searchcraft-search-results-per-page-select-input' }, h("searchcraft-select", { inputId: 'searchcraft-search-results-per-page-select-input', name: 'results-per-page', options: [...Array(5)].map((_, index) => {
                const value = this.initialSearchResultsPerPage +
                    Number(this.increment) * index;
                return {
                    label: `${value}`,
                    value,
                };
            }), onSelectChange: (event) => {
                this.setSearchResultsPerPage(Number(event.detail));
                this.setSearchResultsPage(1);
            } })))));
    }
}, [0, "searchcraft-search-results-per-page", {
        "increment": [8],
        "searchcraftId": [1, "searchcraft-id"],
        "searchTerm": [32],
        "searchResultsPage": [32],
        "searchResultsPerPage": [32],
        "searchResultsCount": [32],
        "searchResultsPagesCount": [32],
        "initialSearchResultsPerPage": [32],
        "setSearchResultsPerPage": [32],
        "setSearchResultsPage": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-search-results-per-page", "searchcraft-select"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-search-results-per-page":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftSearchResultsPerPage$1);
            }
            break;
        case "searchcraft-select":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const SearchcraftSearchResultsPerPage = SearchcraftSearchResultsPerPage$1;
const defineCustomElement = defineCustomElement$1;

export { SearchcraftSearchResultsPerPage, defineCustomElement };

//# sourceMappingURL=searchcraft-search-results-per-page.js.map