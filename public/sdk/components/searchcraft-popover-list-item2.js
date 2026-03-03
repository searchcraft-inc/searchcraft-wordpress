import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?scv=0.14.0';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.14.0';
import { g as getDocumentValueFromSearchResultMapping } from './units.js?scv=0.14.0';
import './purify.es.js';

const SearchcraftPopoverListItem = /*@__PURE__*/ proxyCustomElement(class SearchcraftPopoverListItem extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
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
        return (h("div", { key: '119fc0a527160924a22d185ce764202b1d342e9b', class: 'searchcraft-popover-list-item' }, h("a", { key: '95a5db24035c3be7decb2f062710214fa5726f27', class: 'searchcraft-popover-list-item-link', href: this.href, onClick: this.handleLinkClick.bind(this) }, this.imageSource && (h("div", { key: '6a5ddee0b5f03bc7cf5c5dacc5b4a5ee2fcbe511', class: 'searchcraft-popover-list-item-image-wrapper' }, h("img", { key: '3cdae906aee5b6ef7d1f618419476e75af4c4ebe', alt: this.imageAlt, src: this.imageSource, class: 'searchcraft-popover-list-item-image' }))), h("div", { key: 'd0b55113188fb8fafff8ee15d3dc919617852b62', class: 'searchcraft-popover-list-item-content' }, this.title && (h("p", { key: '1482260827b057f03db9eb6e8d7df7f5977fe3dc', class: 'searchcraft-popover-list-item-content-title' }, this.title)), this.subtitle && (h("p", { key: 'c4210cef3c4372ee4f9ce4a41dbea10d0e915175', class: 'searchcraft-popover-list-item-content-subtitle' }, this.subtitle))))));
    }
}, [768, "searchcraft-popover-list-item", {
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
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftPopoverListItem);
            }
            break;
    } });
}

export { SearchcraftPopoverListItem as S, defineCustomElement as d };
//# sourceMappingURL=searchcraft-popover-list-item2.js.map

//# sourceMappingURL=searchcraft-popover-list-item2.js.map