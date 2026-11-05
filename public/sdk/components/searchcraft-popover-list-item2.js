import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?scv=0.15.1';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.15.1';
import { g as getDocumentValueFromSearchResultMapping } from './units.js?scv=0.15.1';
import { h as html } from './html.js?scv=0.15.1';

const SearchcraftPopoverListItem = /*@__PURE__*/ proxyCustomElement(class SearchcraftPopoverListItem extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
    }
    item;
    popoverResultMappings;
    /**
     * A callback function responsible for rendering the result. When provided, it is used instead of `popoverResultMappings`.
     */
    template;
    /**
     * The index of the result in the list view. Passed to the `template` callback.
     */
    index = 0;
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
    templateHtml;
    get hostElement() { return this; }
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
            if (this.template) {
                try {
                    this.templateHtml = this.template(this.item.document, this.index, {
                        html,
                        source_index: this.item.source_index,
                    });
                }
                catch (error) {
                    console.error('Invalid popover result template:', error);
                }
            }
            else {
                this.mapValuesFromDocument(this.item.document);
            }
        }
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.cleanupCore?.();
    }
    sendDocumentClickedEvent() {
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
    }
    handleLinkClick = () => {
        this.sendDocumentClickedEvent();
    };
    /**
     * Sends the click event when a link inside the rendered template is clicked.
     */
    handleTemplateClick = (event) => {
        const link = event.target?.closest('a');
        if (link && this.hostElement?.contains(link)) {
            this.sendDocumentClickedEvent();
        }
    };
    handleKeyDown = () => { };
    render() {
        if (this.template) {
            return (h("div", { class: 'searchcraft-popover-list-item searchcraft-popover-list-item-template', innerHTML: this.templateHtml, onClick: this.handleTemplateClick, onKeyDown: this.handleKeyDown }));
        }
        return (h("div", { class: 'searchcraft-popover-list-item' }, h("a", { class: 'searchcraft-popover-list-item-link', href: this.href, onClick: this.handleLinkClick.bind(this) }, this.imageSource && (h("div", { class: 'searchcraft-popover-list-item-image-wrapper' }, h("img", { alt: this.imageAlt, src: this.imageSource, class: 'searchcraft-popover-list-item-image' }))), h("div", { class: 'searchcraft-popover-list-item-content' }, this.title && (h("p", { class: 'searchcraft-popover-list-item-content-title' }, this.title)), this.subtitle && (h("p", { class: 'searchcraft-popover-list-item-content-subtitle' }, this.subtitle))))));
    }
}, [768, "searchcraft-popover-list-item", {
        "item": [16],
        "popoverResultMappings": [16],
        "template": [16],
        "index": [2],
        "documentPosition": [2, "document-position"],
        "searchcraftId": [1, "searchcraft-id"],
        "title": [32],
        "subtitle": [32],
        "href": [32],
        "imageSource": [32],
        "imageAlt": [32],
        "templateHtml": [32]
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