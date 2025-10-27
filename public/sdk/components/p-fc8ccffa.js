import { p as proxyCustomElement, H, h } from './p-5365011f.js';
import { g as getDocumentValueFromSearchResultMapping } from './p-d54771ef.js';
import './p-e2a10337.js';
import { r as registry } from './p-e30203b1.js';

const SearchcraftPopoverListItem = /*@__PURE__*/ proxyCustomElement(class SearchcraftPopoverListItem extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    item;
    popoverResultMappings;
    /** The document position relative to the search results (For Measure) */
    documentPosition = 0;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    title;
    subtitle;
    href;
    imageSource;
    imageAlt;
    core;
    cleanupCore;
    mapValuesFromDocument(document) {
        this.title = getDocumentValueFromSearchResultMapping(document, this.popoverResultMappings?.title);
        this.subtitle = getDocumentValueFromSearchResultMapping(document, this.popoverResultMappings?.subtitle);
        this.href = getDocumentValueFromSearchResultMapping(document, this.popoverResultMappings?.href);
        this.imageSource = getDocumentValueFromSearchResultMapping(document, this.popoverResultMappings?.imageSource);
        this.imageAlt = getDocumentValueFromSearchResultMapping(document, this.popoverResultMappings?.imageAlt);
    }
    onCoreAvailable(core) {
        this.core = core;
    }
    connectedCallback() {
        if (this.item) {
            this.mapValuesFromDocument(this.item.document);
        }
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.cleanupCore?.();
    }
    handleLinkClick = () => {
        if (this.core) {
            const document_position = this.documentPosition;
            const search_term = this.core.store.getState().searchTerm;
            const number_of_documents = this.core.store.getState().searchClientResponseItems.length || 0;
            this.core.measureClient?.sendMeasureEvent('document_clicked', {
                document_position,
                number_of_documents,
                search_term,
            });
        }
    };
    render() {
        return (h("div", { key: 'fe1f0a2803c05c7f7901a1e34e3751283683b841', class: 'searchcraft-popover-list-item' }, h("a", { key: 'b1765b28e4df4483554e4aa1e776f85817f45709', class: 'searchcraft-popover-list-item-link', href: this.href, onClick: this.handleLinkClick.bind(this) }, this.imageSource && (h("div", { key: 'd47112466fe3414278f88db73294c829eceb63ba', class: 'searchcraft-popover-list-item-image-wrapper' }, h("img", { key: 'cf65d6520a2586f9b056775a0d1c3e85cb81cdd7', alt: this.imageAlt, src: this.imageSource, class: 'searchcraft-popover-list-item-image' }))), h("div", { key: 'b6bdaf2e52e216d20c23790b4b53563be8709d40', class: 'searchcraft-popover-list-item-content' }, this.title && (h("p", { key: '21a6541924914c8ea2b798d0e910c6e4544b7e46', class: 'searchcraft-popover-list-item-content-title' }, this.title)), this.subtitle && (h("p", { key: '625a1d6b1a7e6bfb848fd49cb316968b396b0473', class: 'searchcraft-popover-list-item-content-subtitle' }, this.subtitle))))));
    }
}, [0, "searchcraft-popover-list-item", {
        "item": [16],
        "popoverResultMappings": [16],
        "documentPosition": [2, "document-position"],
        "searchcraftId": [1, "searchcraft-id"],
        "title": [32],
        "subtitle": [32],
        "href": [32],
        "imageSource": [32],
        "imageAlt": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-popover-list-item"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-popover-list-item":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftPopoverListItem);
            }
            break;
    } });
}

export { SearchcraftPopoverListItem as S, defineCustomElement as d };

//# sourceMappingURL=p-fc8ccffa.js.map