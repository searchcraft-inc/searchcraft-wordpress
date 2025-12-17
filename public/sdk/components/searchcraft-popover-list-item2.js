import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?v=0.13.2';
import { r as registry } from './CoreInstanceRegistry.js?v=0.13.2';
import { g as getDocumentValueFromSearchResultMapping } from './units.js?v=0.13.2';
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
        return (h("div", { key: 'd1c9c310b8abc9d2370efb802eac1edf4189519d', class: 'searchcraft-popover-list-item' }, h("a", { key: '30eb1a5076c5b4b95ae43147eaee0bb72ce46179', class: 'searchcraft-popover-list-item-link', href: this.href, onClick: this.handleLinkClick.bind(this) }, this.imageSource && (h("div", { key: 'd18ff55823dc2c61f3786f423936af8b009aeeda', class: 'searchcraft-popover-list-item-image-wrapper' }, h("img", { key: '56f4cc1d472f7da05e64fcf52c560a7ad0cdf7a6', alt: this.imageAlt, src: this.imageSource, class: 'searchcraft-popover-list-item-image' }))), h("div", { key: '78a0f0235d5e71d10076b70ccbaf4b58e0d6fea0', class: 'searchcraft-popover-list-item-content' }, this.title && (h("p", { key: '4489047af56e5aa295cb5f036e970dcad053d3b7', class: 'searchcraft-popover-list-item-content-title' }, this.title)), this.subtitle && (h("p", { key: '4d177c227a1dbf1233022d738403c8eb93ba328d', class: 'searchcraft-popover-list-item-content-subtitle' }, this.subtitle))))));
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