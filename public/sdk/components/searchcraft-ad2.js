import { p as proxyCustomElement, t as transformTag, H, h } from './index2.js?v=0.13.2';
import { c as classNames } from './index3.js?v=0.13.2';
import { r as registry } from './CoreInstanceRegistry.js?v=0.13.2';
import { h as html } from './html.js?v=0.13.2';

const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

/* @ts-self-types="./index.d.ts" */
let nanoid = (size = 21) => {
  let id = '';
  let bytes = crypto.getRandomValues(new Uint8Array((size |= 0)));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id
};

const SearchcraftPopoverListItemAd = /*@__PURE__*/ proxyCustomElement(class SearchcraftPopoverListItemAd extends H {
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
    adSource = 'Custom';
    adClientResponseItem;
    /**
     * Where the ad is being rendered within the search results div.
     * Lifecycle behavior differs for ads being rendered in different positions,
     * so we need to be able to handle all of those cases.
     */
    renderPosition = 'interstitial';
    searchTerm;
    isSearchInProgress = false;
    searchResultCount = 0;
    get hostElement() { return this; }
    core;
    intersectionObserver;
    storeUnsubscribe;
    cleanupCore;
    adContainerRenderedTimeout;
    isComponentConnected = false;
    timeTaken;
    adContainerId = '';
    /**
     * Handles when an ad container is first rendered.
     * Core emits an ad_container_rendered event and performs ad client side effects
     *
     */
    handleAdRendered() {
        this.adContainerId = nanoid();
        if (this.isComponentConnected && this.searchResultCount > 0) {
            clearTimeout(this.adContainerRenderedTimeout);
            this.adContainerRenderedTimeout = setTimeout(() => {
                this.core?.handleAdContainerRendered({
                    adClientResponseItem: this.adClientResponseItem,
                    adContainerId: this.adContainerId,
                    searchTerm: this.searchTerm || '',
                });
            }, this.core?.config?.customAdConfig?.adContainerRenderedDebounceDelay ||
                300);
        }
    }
    handleAdViewed() {
        this.core?.handleAdContainerViewed({
            adClientResponseItem: this.adClientResponseItem,
            adContainerId: this.adContainerId,
            searchTerm: this.searchTerm || '',
        });
    }
    /**
     * Things to do when there's a new incoming search request.
     */
    handleNewIncomingSearchRequest(state) {
        const requestProperties = state.searchClientRequestProperties;
        if (requestProperties && typeof requestProperties === 'object') {
            this.searchTerm = requestProperties.searchTerm;
        }
        this.searchResultCount = state.searchClientResponseItems.length;
        this.handleAdRendered();
        this.startIntersectionObserver();
    }
    onCoreAvailable(core) {
        const currentState = core.store.getState();
        this.isComponentConnected = true;
        this.core = currentState.core;
        this.isSearchInProgress = currentState.isSearchInProgress;
        this.searchResultCount = currentState.searchClientResponseItems.length;
        this.timeTaken = currentState.searchResponseTimeTaken;
        const requestProperties = currentState.searchClientRequestProperties;
        if (requestProperties && typeof requestProperties === 'object') {
            this.searchTerm = requestProperties.searchTerm;
        }
        /**
         * Interstial ads have a different lifecycle, where we need handle an incoming search
         * request immediately, because they are rendered alongside the search results.
         */
        if (this.renderPosition === 'interstitial') {
            this.handleNewIncomingSearchRequest(currentState);
        }
        // Subscribes to store changes (for search term).
        this.storeUnsubscribe = core.store.subscribe((state) => {
            if (this.timeTaken !== state.searchResponseTimeTaken) {
                this.handleNewIncomingSearchRequest(state);
            }
            this.timeTaken = state.searchResponseTimeTaken;
            this.isSearchInProgress = state.isSearchInProgress;
        });
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    startIntersectionObserver() {
        this.intersectionObserver?.disconnect();
        /**
         * Handles when an ad container is viewable within the document,
         * Core emits an ad_container_viewed event and performs ad client side effects
         */
        if (this.hostElement) {
            this.intersectionObserver = new IntersectionObserver(([entry]) => {
                if (entry?.isIntersecting && this.searchResultCount > 0) {
                    this.handleAdViewed();
                }
            }, { threshold: 0 });
            this.intersectionObserver.observe(this.hostElement);
        }
    }
    disconnectedCallback() {
        this.storeUnsubscribe?.();
        this.cleanupCore?.();
        this.intersectionObserver?.disconnect();
        this.isComponentConnected = false;
        clearTimeout(this.adContainerRenderedTimeout);
    }
    renderADMAd() {
        const item = this.adClientResponseItem;
        if (!item.admAd) {
            return;
        }
        let templateHtml = '<p>Ad Marketplace Ad Placeholder</p>';
        if (this.core?.config?.admAdConfig?.template) {
            templateHtml = this.core?.config?.admAdConfig.template(item.admAd, {
                html,
            });
        }
        return (h("div", { class: 'searchcraft-ad searchcraft-adm-ad', "data-searchcraft-ad-container-id": this.adContainerId, id: `searchcraft-adm-ad-${this.adContainerId}`, innerHTML: templateHtml }));
    }
    renderCustomAd() {
        const templateRenderFunction = this.core?.config?.customAdConfig?.template;
        const containerId = `searchcraft-custom-ad-${this.adContainerId}`;
        let templateHtml = '<p>Custom Ad Placeholder</p>';
        if (templateRenderFunction) {
            templateHtml = templateRenderFunction({
                searchTerm: this.searchTerm || '',
                adContainerId: this.adContainerId,
            }, { html });
        }
        return (h("div", { class: 'searchcraft-ad searchcraft-custom-ad', id: containerId, "data-searchcraft-ad-container-id": this.adContainerId, innerHTML: templateHtml }));
    }
    renderNativoAd() {
        const nativoClassName = this.core?.config.nativoConfig?.adClassName || 'ntv-item';
        return (h("div", { id: `searchcraft-native-ad-${this.adContainerId}`, class: classNames('searchcraft-ad', nativoClassName), "data-searchcraft-ad-container-id": this.adContainerId }));
    }
    render() {
        // Don't render ads if no search results
        if (this.searchResultCount === 0) {
            return;
        }
        switch (this.adSource) {
            case 'adMarketplace':
                return this.renderADMAd();
            case 'Custom':
                return this.renderCustomAd();
            case 'Nativo':
                return this.renderNativoAd();
            default:
                return;
        }
    }
}, [768, "searchcraft-ad", {
        "searchcraftId": [1, "searchcraft-id"],
        "adSource": [1, "ad-source"],
        "adClientResponseItem": [16],
        "renderPosition": [1, "render-position"],
        "searchTerm": [32],
        "isSearchInProgress": [32],
        "searchResultCount": [32],
        "adContainerId": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-ad"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-ad":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftPopoverListItemAd);
            }
            break;
    } });
}

export { SearchcraftPopoverListItemAd as S, defineCustomElement as d, nanoid as n };
//# sourceMappingURL=searchcraft-ad2.js.map

//# sourceMappingURL=searchcraft-ad2.js.map