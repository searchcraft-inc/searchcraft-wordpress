import { p as proxyCustomElement, H, h } from './p-DO5g2x-l.js';
import { r as registry } from './p-D0j0UFpV.js';
import { h as html } from './p-_aHgRsRD.js';

const SearchcraftSearchResult = /*@__PURE__*/ proxyCustomElement(class SearchcraftSearchResult extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
    }
    item;
    /**
     * The index.
     */
    index;
    /**
     * The position in the document. Used with the "document_clicked" measure event.
     */
    documentPosition = 0;
    /**
     * A callback function responsible for rendering a result.
     */
    template;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    templateHtml;
    get hostElement() { return this; }
    core;
    cleanupCore;
    onCoreAvailable(core) {
        this.core = core;
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
        if (this.item) {
            try {
                this.templateHtml = this.template?.(this.item.document, this.index, {
                    html,
                    source_index: this.item.source_index,
                });
            }
            catch (error) {
                console.error('Invalid search result template:', error);
            }
        }
    }
    disconnectedCallback() {
        this.cleanupCore?.();
    }
    handleResultContainerClick = (event) => {
        if (!event.target) {
            return;
        }
        const target = event.target;
        const link = target.closest('a');
        if (!link ||
            !this.hostElement?.contains(link) ||
            !this.core ||
            !this.core.measureClient) {
            return;
        }
        const document_position = this.documentPosition;
        const search_term = this.core.store.getState().searchTerm;
        const number_of_documents = this.core.store.getState().searchClientResponseItems.length || 0;
        this.core.measureClient.sendMeasureEvent('document_clicked', {
            document_position,
            number_of_documents,
            search_term,
        });
    };
    handleKeyDown = () => { };
    render() {
        if (!this.item) {
            return;
        }
        if (typeof this.template === 'undefined') {
            return (h("div", { class: 'searchcraft-search-result searchcraft-search-result-no-template', onClick: this.handleResultContainerClick, onKeyDown: this.handleKeyDown }, Object.entries(this.item.document).map(([key, value]) => (h("p", { key: key }, h("strong", null, key), ": ", value)))));
        }
        return (h("div", { class: 'searchcraft-search-result', innerHTML: this.templateHtml, onClick: this.handleResultContainerClick, onKeyDown: this.handleKeyDown }));
    }
}, [768, "searchcraft-search-result", {
        "item": [16],
        "index": [2],
        "documentPosition": [2, "document-position"],
        "template": [16],
        "searchcraftId": [1, "searchcraft-id"],
        "templateHtml": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-search-result"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-search-result":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftSearchResult);
            }
            break;
    } });
}

export { SearchcraftSearchResult as S, defineCustomElement as d };
//# sourceMappingURL=p-DotXR-Gz.js.map

//# sourceMappingURL=p-DotXR-Gz.js.map