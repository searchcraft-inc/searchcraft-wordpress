import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?scv=0.15.1';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.15.1';
import { f as formatNumberWithCommas } from './units.js?scv=0.15.1';
import './purify.es.js';

const name = "@searchcraft/javascript-sdk";
const version = "0.15.1";

const SearchcraftPopoverFooter = /*@__PURE__*/ proxyCustomElement(class SearchcraftPopoverFooter extends H {
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
     * The SDK variant used to render this component. Used for UTM attribution. This isn't exposed for developer consumption, it's set automatically.
     *
     * @internal
     */
    sdkVariant = 'js';
    /**
     * Optional href for the "View all" button.
     */
    viewAllResultsHref;
    /**
     * Optional label for the "View all" button.
     */
    viewAllResultsLabel;
    searchResultsCount;
    unsubscribe = () => { };
    cleanupCore;
    onCoreAvailable(core) {
        this.searchResultsCount = core.store.getState().searchResultsCount;
        this.unsubscribe = core.store.subscribe((state) => {
            this.searchResultsCount = state.searchResultsCount;
        });
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
    }
    get safeViewAllHref() {
        const href = this.viewAllResultsHref;
        if (!href)
            return undefined;
        try {
            const url = new URL(href, window.location.href);
            return url.protocol === 'https:' || url.protocol === 'http:'
                ? href
                : undefined;
        }
        catch {
            return undefined;
        }
    }
    render() {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const utmParams = new URLSearchParams({
            utm_source: hostname,
            utm_medium: this.sdkVariant ?? 'js',
            utm_campaign: 'powered-by',
            utm_content: 'popover-footer',
            sc_sdk_version: version,
        });
        const href = `https://searchcraft.io/?${utmParams.toString()}`;
        const hasResults = typeof this.searchResultsCount === 'number' &&
            this.searchResultsCount > 0;
        const showViewAll = !!this.safeViewAllHref && hasResults;
        return (h("footer", { key: '548704335f80a2b4bc7ebd4ea2d0a2eb73376fde', class: 'searchcraft-popover-footer' }, h("a", { key: 'a10cbfd833ef0c6016932fede6ca3195eecdfaea', class: 'searchcraft-popover-footer-link', href: href, target: '_blank', rel: 'noreferrer' }, h("span", { key: '6c6333a61ae282419e32721fc9760d3d237870df', class: 'searchcraft-popover-footer-link-prefix' }, "Powered by\u00A0"), ' ', "Searchcraft"), h("div", { key: 'ac3af12966e7de74be888511493cc8b5411be6f5', class: 'searchcraft-popover-footer-results' }, h("p", { key: '4a8bbc33d91852efb12b11ed7a82d34a91718456', class: 'searchcraft-popover-footer-results-info' }, hasResults ? (h("span", null, formatNumberWithCommas(this.searchResultsCount), " Results", h("span", { class: 'searchcraft-popover-footer-results-found' }, ' Found'))) : (' ')), showViewAll && (h("a", { key: '480adfb8b751ce450c6547a78750d29cbe542359', class: 'searchcraft-popover-footer-view-all', href: this.safeViewAllHref }, h("span", { key: '5cb8eb24a192fc3c22784e72414a5b8bf8070c8b', class: 'searchcraft-popover-footer-view-all-label' }, this.viewAllResultsLabel), h("span", { key: 'cc6e55e19527e99eded57edb5b35eebc574fbec0', class: 'searchcraft-popover-footer-view-all-shortcut', "aria-hidden": 'true' }, h("kbd", { key: '8e55153e517ca311239d9029073d127b9638ba05' }, "\u2318"), h("kbd", { key: '71e773899f5abe1bcf8d94c3617732f2c213571a' }, "\u21B5")))))));
    }
}, [768, "searchcraft-popover-footer", {
        "searchcraftId": [1, "searchcraft-id"],
        "sdkVariant": [1, "sdk-variant"],
        "viewAllResultsHref": [1, "view-all-results-href"],
        "viewAllResultsLabel": [1, "view-all-results-label"],
        "searchResultsCount": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-popover-footer"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-popover-footer":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftPopoverFooter);
            }
            break;
    } });
}

export { SearchcraftPopoverFooter as S, defineCustomElement as d, name as n, version as v };
//# sourceMappingURL=searchcraft-popover-footer2.js.map

//# sourceMappingURL=searchcraft-popover-footer2.js.map