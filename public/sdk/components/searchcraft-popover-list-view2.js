import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?v=0.13.2';
import { r as registry } from './CoreInstanceRegistry.js?v=0.13.2';
import { d as defineCustomElement$2 } from './searchcraft-ad2.js?v=0.13.2';
import { d as defineCustomElement$1 } from './searchcraft-popover-list-item2.js?v=0.13.2';

const SearchcraftPopoverListView = /*@__PURE__*/ proxyCustomElement(class SearchcraftPopoverListView extends H {
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
     * The mappings that define how the data in the documents are mapped to the
     * list-view-item elements.
     */
    popoverResultMappings;
    /**
     * The items to render in the list view.
     */
    searchClientResponseItems;
    adClientResponseItems;
    searchResultsPage;
    searchResultsPerPage;
    config;
    cleanupCore;
    onCoreAvailable(core) {
        this.config = core.config;
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.cleanupCore?.();
    }
    renderWithADMAds() {
        return (h("div", { class: 'searchcraft-popover-list-view' }, this.adClientResponseItems?.map((item) => (h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adClientResponseItem: item, adSource: 'adMarketplace', key: item.id, renderPosition: 'top' }))), this.searchClientResponseItems?.map((item, index) => (h("searchcraft-popover-list-item", { "searchcraft-id": this.searchcraftId, item: item, key: item.id, popoverResultMappings: this.popoverResultMappings, documentPosition: this.searchResultsPerPage * (this.searchResultsPage - 1) + index })))));
    }
    renderWithCustomAds() {
        const itemsToRender = [];
        const interstitialInterval = this.config?.customAdConfig?.adInterstitialInterval || 0;
        const interstitialQuantity = this.config?.customAdConfig?.adInterstitialQuantity || 1;
        const adStartQuantity = this.config?.customAdConfig?.adStartQuantity || 0;
        const adEndQuantity = this.config?.customAdConfig?.adEndQuantity || 0;
        const searchItems = this.searchClientResponseItems || [];
        // Renders ads at beginning
        for (let n = 0; n < adStartQuantity; n++) {
            itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Custom', key: `${n}-ad`, renderPosition: 'top' }));
        }
        // Renders search results + interstitial ads
        searchItems.forEach((item, index) => {
            if (interstitialInterval &&
                index % interstitialInterval === 0 &&
                index + interstitialInterval < searchItems.length &&
                index >= interstitialInterval) {
                for (let n = 0; n < interstitialQuantity; n++) {
                    itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Custom', key: `${item.id}-ad-${n}`, renderPosition: 'interstitial' }));
                }
            }
            itemsToRender.push(h("searchcraft-popover-list-item", { "searchcraft-id": this.searchcraftId, item: item, key: item.id, popoverResultMappings: this.popoverResultMappings, documentPosition: this.searchResultsPerPage * (this.searchResultsPage - 1) + index }));
        });
        // Renders ads at end
        for (let n = 0; n < adEndQuantity; n++) {
            itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Custom', key: `${n}-ad`, renderPosition: 'bottom' }));
        }
        return h("div", { class: 'searchcraft-popover-list-view' }, itemsToRender);
    }
    renderWithNativoAds() {
        const itemsToRender = [];
        const interstitialStartIndex = this.config?.nativoConfig?.adInterstialStartIndex || 0;
        const interstitialInterval = this.config?.nativoConfig?.adInterstitialInterval || 0;
        const interstitialQuantity = this.config?.nativoConfig?.adInterstitialQuantity || 1;
        const adStartQuantity = this.config?.nativoConfig?.adStartQuantity || 0;
        const adEndQuantity = this.config?.nativoConfig?.adEndQuantity || 0;
        const searchItems = this.searchClientResponseItems || [];
        // Renders ads at beginning
        for (let n = 0; n < adStartQuantity; n++) {
            itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Nativo', key: `${n}-ad`, renderPosition: 'top' }));
        }
        // Renders search results + interstitial ads
        searchItems.forEach((item, index) => {
            if (interstitialInterval &&
                (index + interstitialStartIndex) % interstitialInterval === 0 &&
                index + interstitialInterval < searchItems.length &&
                index >= interstitialInterval) {
                for (let n = 0; n < interstitialQuantity; n++) {
                    itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Nativo', key: `${item.id}-ad-${n}`, renderPosition: 'interstitial' }));
                }
            }
            itemsToRender.push(h("searchcraft-popover-list-item", { "searchcraft-id": this.searchcraftId, item: item, key: item.id, popoverResultMappings: this.popoverResultMappings, documentPosition: this.searchResultsPerPage * (this.searchResultsPage - 1) + index }));
        });
        // Renders ads at end
        for (let n = 0; n < adEndQuantity; n++) {
            itemsToRender.push(h("searchcraft-ad", { "searchcraft-id": this.searchcraftId, adSource: 'Nativo', key: `${n}-ad`, renderPosition: 'bottom' }));
        }
        return h("div", { class: 'searchcraft-popover-list-view' }, itemsToRender);
    }
    renderWithNoAds() {
        return (h("div", { class: 'searchcraft-popover-list-view' }, this.searchClientResponseItems?.map((item, index) => (h("searchcraft-popover-list-item", { "searchcraft-id": this.searchcraftId, item: item, key: item.id, popoverResultMappings: this.popoverResultMappings, documentPosition: this.searchResultsPerPage * (this.searchResultsPage - 1) + index })))));
    }
    render() {
        if (this.config?.customAdConfig) {
            return this.renderWithCustomAds();
        }
        if (this.config?.nativoConfig) {
            return this.renderWithNativoAds();
        }
        if (this.config?.admAdConfig) {
            return this.renderWithADMAds();
        }
        return this.renderWithNoAds();
    }
}, [768, "searchcraft-popover-list-view", {
        "searchcraftId": [1, "searchcraft-id"],
        "popoverResultMappings": [16],
        "searchClientResponseItems": [16],
        "adClientResponseItems": [16],
        "searchResultsPage": [2, "search-results-page"],
        "searchResultsPerPage": [2, "search-results-per-page"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-popover-list-view", "searchcraft-ad", "searchcraft-popover-list-item"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-popover-list-view":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftPopoverListView);
            }
            break;
        case "searchcraft-ad":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$2();
            }
            break;
        case "searchcraft-popover-list-item":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { SearchcraftPopoverListView as S, defineCustomElement as d };
//# sourceMappingURL=searchcraft-popover-list-view2.js.map

//# sourceMappingURL=searchcraft-popover-list-view2.js.map