import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?v=0.13.2';
import { r as registry } from './CoreInstanceRegistry.js?v=0.13.2';
import { d as defineCustomElement$4 } from './searchcraft-ad2.js?v=0.13.2';
import { d as defineCustomElement$3 } from './searchcraft-error-message2.js?v=0.13.2';
import { d as defineCustomElement$2 } from './searchcraft-search-result2.js?v=0.13.2';

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
     */
    template;
    adClientResponseItems = [];
    config;
    isSearchInProgress = true;
    searchClientResponseItems;
    searchResultsPage;
    searchResultsPerPage;
    searchTerm = '';
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
    }
    renderEmptyState() {
        return (h("div", { class: 'searchcraft-search-results-empty-state' }, h("slot", { name: 'empty-search' })));
    }
    renderNoResultsFoundState() {
        return (h("div", { class: 'searchcraft-search-results' }, h("div", { class: 'searchcraft-search-results-error-message' }, h("searchcraft-error-message", null, "No search results found for \"", this.searchTerm, "\" query."))));
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
        if (searchClientResponseItems.length === 0 && !this.isSearchInProgress) {
            return this.renderEmptyState();
        }
        if (this.searchTerm.length > 0 &&
            searchClientResponseItems.length === 0 &&
            !this.isSearchInProgress) {
            return this.renderNoResultsFoundState();
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
        "searchTerm": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-search-results", "searchcraft-ad", "searchcraft-error-message", "searchcraft-search-result"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-search-results":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftSearchResults$1);
            }
            break;
        case "searchcraft-ad":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$4();
            }
            break;
        case "searchcraft-error-message":
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