import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?scv=0.16.0';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.16.0';
import { d as defineCustomElement$3 } from './searchcraft-ad2.js?scv=0.16.0';
import { d as defineCustomElement$2 } from './searchcraft-search-result2.js?scv=0.16.0';

const SearchcraftSearchResults$1 = /*@__PURE__*/ proxyCustomElement(class SearchcraftSearchResults extends H {
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
     * A query that will appears when the component initializes or the search term is ''..
     */
    initialQuery;
    /**
     * A callback function responsible for rendering a result. Passed to `searchcraft-search-result`.
     * Pass URLs from the result through the `safeUrl` helper before placing them in an `href` or `src`.
     * Never place result values in event handler attributes such as `onclick`, or in `style`.
     */
    template;
    adClientResponseItems = [];
    config;
    isSearchInProgress = true;
    searchClientResponseItems;
    searchResultsPage;
    searchResultsPerPage;
    searchTerm = '';
    /**
     * The search term of the most recent search request, used to tell a
     * completed search apart from a term that has not been searched yet.
     */
    completedSearchTerm;
    unsubscribe;
    cleanupCore;
    onCoreAvailable(core) {
        const state = core.store.getState();
        this.handleStateChange(state);
        this.searchClientResponseItems = state.searchClientResponseItems;
        this.searchTerm = state.searchTerm;
        this.config = state.core?.config;
        this.unsubscribe = core.store.subscribe((state) => this.handleStateChange(state));
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
    }
    handleStateChange(state) {
        this.adClientResponseItems = [...state.adClientResponseItems];
        this.config = state.core?.config;
        this.isSearchInProgress = state.isSearchInProgress;
        this.searchClientResponseItems = [...state.searchClientResponseItems];
        this.searchResultsPage = state.searchResultsPage;
        this.searchResultsPerPage = state.searchResultsPerPage;
        this.searchTerm = state.searchTerm;
        const requestProperties = state.searchClientRequestProperties;
        this.completedSearchTerm =
            requestProperties && typeof requestProperties === 'object'
                ? requestProperties.searchTerm
                : undefined;
    }
    /**
     * Whether the search for the current search term has completed with no
     * results. False while the term is empty, while a search is in progress, and
     * after the term changes until its search completes.
     */
    get hasNoResultsToShow() {
        const searchTerm = this.searchTerm.trim();
        return (!!searchTerm &&
            !this.isSearchInProgress &&
            (this.searchClientResponseItems || []).length === 0 &&
            this.completedSearchTerm?.trim() === searchTerm);
    }
    renderEmptyState() {
        return (h("div", { class: 'searchcraft-search-results-empty-state' }, h("slot", { name: 'empty-search' })));
    }
    renderNoResultsFoundState() {
        return (h("div", { class: 'searchcraft-search-results-no-results' }, h("p", { class: 'searchcraft-search-results-no-results-message' }, "No results found for \"", this.searchTerm.trim(), "\".")));
    }
    renderWithADMAds() {
        const items = this.searchClientResponseItems || [];
        return (h("div", { class: 'searchcraft-search-results' }, this.adClientResponseItems?.map((item) => (h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'adMarketplace', adClientResponseItem: item, key: item.id, renderPosition: 'top' }))), items.map((item, index) => (h("searchcraft-search-result", { "searchcraft-id": this.searchcraftId, key: item.id, "document-position": this.searchResultsPerPage * (this.searchResultsPage - 1) + index, index: index, item: item, template: this.template })))));
    }
    renderWithCustomAds() {
        const itemsToRender = [];
        const interstitialInterval = this.config?.customAdConfig?.adInterstitialInterval || 0;
        const interstitialQuantity = this.config?.customAdConfig?.adInterstitialQuantity || 1;
        const adStartQuantity = this.config?.customAdConfig?.adStartQuantity || 0;
        const adEndQuantity = this.config?.customAdConfig?.adEndQuantity || 0;
        const items = this.searchClientResponseItems || [];
        // Renders ads at beginning
        for (let n = 0; n < adStartQuantity; n++) {
            itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Custom', key: `${n}-ad`, renderPosition: 'top' }));
        }
        // Renders search results + interstitial ads
        items.forEach((item, index) => {
            if (interstitialInterval &&
                index % interstitialInterval === 0 &&
                index + interstitialInterval < items.length &&
                index >= interstitialInterval) {
                for (let n = 0; n < interstitialQuantity; n++) {
                    itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Custom', key: `${item.id}-ad-${n}`, renderPosition: 'interstitial' }));
                }
            }
            itemsToRender.push(h("searchcraft-search-result", { "searchcraft-id": this.searchcraftId, key: item.id, "document-position": this.searchResultsPerPage * (this.searchResultsPage - 1) + index, index: index, item: item, template: this.template }));
        });
        // Renders ads at end
        for (let n = 0; n < adEndQuantity; n++) {
            itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Custom', key: `${n}-ad`, renderPosition: 'bottom' }));
        }
        return h("div", { class: 'searchcraft-search-results' }, itemsToRender);
    }
    renderWithNativoAds() {
        const itemsToRender = [];
        const interstitialStartIndex = this.config?.nativoConfig?.adInterstialStartIndex || 0;
        const interstitialInterval = this.config?.nativoConfig?.adInterstitialInterval || 0;
        const interstitialQuantity = this.config?.nativoConfig?.adInterstitialQuantity || 1;
        const adStartQuantity = this.config?.nativoConfig?.adStartQuantity || 0;
        const adEndQuantity = this.config?.nativoConfig?.adEndQuantity || 0;
        const items = this.searchClientResponseItems || [];
        // Renders ads at beginning
        for (let n = 0; n < adStartQuantity; n++) {
            itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Nativo', key: `${n}-ad`, renderPosition: 'top' }));
        }
        // Renders search results + interstitial ads
        items.forEach((item, index) => {
            if (interstitialInterval &&
                (index + interstitialStartIndex) % interstitialInterval === 0 &&
                index + interstitialInterval < items.length &&
                index >= interstitialInterval) {
                for (let n = 0; n < interstitialQuantity; n++) {
                    itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Nativo', key: `${item.id}-ad-${n}`, renderPosition: 'interstitial' }));
                }
            }
            itemsToRender.push(h("searchcraft-search-result", { "searchcraft-id": this.searchcraftId, key: item.id, "document-position": this.searchResultsPerPage * (this.searchResultsPage - 1) + index, index: index, item: item, template: this.template }));
        });
        // Renders ads at end
        for (let n = 0; n < adEndQuantity; n++) {
            itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Nativo', key: `${n}-ad`, renderPosition: 'bottom' }));
        }
        return h("div", { class: 'searchcraft-search-results' }, itemsToRender);
    }
    renderWithNoAds() {
        const items = this.searchClientResponseItems || [];
        return (h("div", { class: 'searchcraft-search-results' }, items.map((item, index) => (h("searchcraft-search-result", { "searchcraft-id": this.searchcraftId, key: item.id, "document-position": this.searchResultsPerPage * (this.searchResultsPage - 1) + index, index: index, item: item, template: this.template })))));
    }
    render() {
        const searchClientResponseItems = this.searchClientResponseItems || [];
        if (this.hasNoResultsToShow) {
            return this.renderNoResultsFoundState();
        }
        if (searchClientResponseItems.length === 0 && !this.isSearchInProgress) {
            return this.renderEmptyState();
        }
        if (this.config?.customAdConfig) {
            return this.renderWithCustomAds();
        }
        if (this.config?.admAdConfig) {
            return this.renderWithNativoAds();
        }
        if (this.config?.nativoConfig) {
            return this.renderWithNativoAds();
        }
        return this.renderWithNoAds();
    }
}, [772, "searchcraft-search-results", {
        "searchcraftId": [1, "searchcraft-id"],
        "initialQuery": [1, "initial-query"],
        "template": [16],
        "adClientResponseItems": [32],
        "config": [32],
        "isSearchInProgress": [32],
        "searchClientResponseItems": [32],
        "searchResultsPage": [32],
        "searchResultsPerPage": [32],
        "searchTerm": [32],
        "completedSearchTerm": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-search-results", "searchcraft-ad", "searchcraft-search-result"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-search-results":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftSearchResults$1);
            }
            break;
        case "searchcraft-ad":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$3();
            }
            break;
        case "searchcraft-search-result":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$2();
            }
            break;
    } });
}

const SearchcraftSearchResults = SearchcraftSearchResults$1;
const defineCustomElement = defineCustomElement$1;

export { SearchcraftSearchResults, defineCustomElement };
//# sourceMappingURL=searchcraft-search-results.js.map

//# sourceMappingURL=searchcraft-search-results.js.map