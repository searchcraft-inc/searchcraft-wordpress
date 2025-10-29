import { p as proxyCustomElement, H, h } from './p-5365011f.js';
import { r as registry } from './p-e30203b1.js';
import { c as classNames } from './p-5cdc6210.js';
import { d as defineCustomElement$2 } from './p-acf23bab.js';

const SearchcraftPagination$1 = /*@__PURE__*/ proxyCustomElement(class SearchcraftPagination extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    // store vars
    searchTerm;
    searchResultsPerPage;
    searchResultsPage;
    searchResultsCount;
    // local vars
    searchResultsPagesCount = 1;
    searchResultsRangeMin = 1;
    searchResultsRangeMax = 1;
    // store functions
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
            this.searchResultsRangeMin =
                (this.searchResultsPage - 1) * this.searchResultsPerPage + 1;
            this.searchResultsRangeMax =
                (this.searchResultsPerPage - 1) * this.searchResultsPerPage +
                    this.searchResultsPerPage;
            // store functions
            this.setSearchResultsPage = state.setSearchResultsPage;
        });
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
    }
    handleGoToPage(page) {
        this.setSearchResultsPage(page);
    }
    renderOddPaginationItem(page) {
        return (h("li", null, h("button", { class: classNames('searchcraft-pagination-item', {
                'searchcraft-pagination-item-active': this.searchResultsPage === page,
            }), onClick: () => this.handleGoToPage(page), type: 'button' }, page)));
    }
    renderEvenPaginationItem(page) {
        if (this.searchResultsPagesCount <= page) {
            return;
        }
        if (this.searchResultsPagesCount <= 5 ||
            page < Math.ceil(this.searchResultsPagesCount / 2) // is the first or second even pagination item
            ? this.searchResultsPage <= page + 1
            : this.searchResultsPage >= page - 1) {
            return (h("li", null, h("button", { class: classNames('searchcraft-pagination-item', {
                    'searchcraft-pagination-item-active': this.searchResultsPage === page,
                }), onClick: () => this.handleGoToPage(page), type: 'button' }, page)));
        }
        return (h("li", null, h("span", { class: 'searchcraft-pagination-item' }, "...")));
    }
    renderMiddlePaginationItem() {
        if (this.searchResultsPagesCount <= 3) {
            return;
        }
        if (this.searchResultsPagesCount <= 5 ||
            this.searchResultsPage <= 3 ||
            this.searchResultsPage >= this.searchResultsPagesCount - 2) {
            return (h("li", null, h("button", { class: classNames('searchcraft-pagination-item', {
                    'searchcraft-pagination-item-active': this.searchResultsPage === 3 ||
                        this.searchResultsPage === this.searchResultsPagesCount - 2,
                }), type: 'button', onClick: () => this.handleGoToPage(this.searchResultsPage >= this.searchResultsPagesCount - 2
                    ? this.searchResultsPagesCount - 2
                    : 3) }, this.searchResultsPage >= this.searchResultsPagesCount - 2
                ? this.searchResultsPagesCount - 2
                : 3)));
        }
        return (h("li", null, h("span", { class: 'searchcraft-pagination-item searchcraft-pagination-item-active' }, this.searchResultsPage)));
    }
    render() {
        // early return if there isn't a searchTerm or there is 1 or fewer pages of results
        if (!this.searchTerm || this.searchResultsPagesCount <= 1) {
            return;
        }
        return (h("div", { class: 'searchcraft-pagination' }, h("div", { class: 'searchcraft-pagination-control' }, h("searchcraft-button", { disabled: this.searchResultsPage === 1, hierarchy: 'tertiary', onButtonClick: () => this.handleGoToPage(Math.max(1, this.searchResultsPage - 1)), label: 'Previous', iconPosition: 'left', icon: h("svg", { class: 'searchcraft-button-icon', width: '20', height: '20', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, h("title", null, "Previous page icon"), h("path", { d: 'M12.5 15L7.5 10L12.5 5', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' })), iconOnly: true })), h("ul", { class: 'searchcraft-pagination-list' }, this.renderOddPaginationItem(1), this.renderEvenPaginationItem(2), this.renderMiddlePaginationItem(), this.renderEvenPaginationItem(this.searchResultsPagesCount > 4
            ? this.searchResultsPagesCount - 1
            : 4), this.renderOddPaginationItem(this.searchResultsPagesCount)), h("div", { class: 'searchcraft-pagination-control' }, h("searchcraft-button", { disabled: this.searchResultsPage === this.searchResultsPagesCount, hierarchy: 'tertiary', onButtonClick: () => {
                this.handleGoToPage(Math.min(this.searchResultsPagesCount, this.searchResultsPage + 1));
            }, label: 'Next', iconPosition: 'right', icon: h("svg", { class: 'searchcraft-button-icon', width: '20', height: '20', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, h("title", null, "Next page icon"), h("path", { d: 'M7.5 15L12.5 10L7.5 5', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' })), iconOnly: true }))));
    }
}, [0, "searchcraft-pagination", {
        "searchcraftId": [1, "searchcraft-id"],
        "searchTerm": [32],
        "searchResultsPerPage": [32],
        "searchResultsPage": [32],
        "searchResultsCount": [32],
        "searchResultsPagesCount": [32],
        "searchResultsRangeMin": [32],
        "searchResultsRangeMax": [32],
        "setSearchResultsPage": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-pagination", "searchcraft-button"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-pagination":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftPagination$1);
            }
            break;
        case "searchcraft-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const SearchcraftPagination = SearchcraftPagination$1;
const defineCustomElement = defineCustomElement$1;

export { SearchcraftPagination, defineCustomElement };

//# sourceMappingURL=searchcraft-pagination.js.map