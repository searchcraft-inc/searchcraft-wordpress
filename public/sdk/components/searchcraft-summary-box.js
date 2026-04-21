import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?scv=0.15.1';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.15.1';
import { p as purify } from './purify.es.js?scv=0.15.1';
import { m as marked } from './marked.esm.js?scv=0.15.1';
import { d as defineCustomElement$2 } from './searchcraft-loading2.js?scv=0.15.1';

const SearchcraftSummaryBox$1 = /*@__PURE__*/ proxyCustomElement(class SearchcraftSummaryBox extends H {
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
    summary = '';
    summaryErrorMessage = '';
    isLoading = false;
    isSummaryNotEnabled = false;
    unsubscribe;
    cleanupCore;
    onCoreAvailable(core) {
        core.store.setState({ hasSummaryBox: true });
        this.unsubscribe = core.store.subscribe(this.handleStateChange.bind(this));
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
    }
    /**
     * Handles state changes from the store and updates component state.
     */
    handleStateChange(state) {
        this.isLoading = state.isSummaryLoading;
        this.isSummaryNotEnabled = state.isSummaryNotEnabled;
        this.summaryErrorMessage = state.summaryErrorMessage;
        this.summary = this.sanitizeMarkdown(state.summary);
    }
    /**
     * Sanitizes and converts markdown to HTML.
     */
    sanitizeMarkdown(markdown) {
        return purify.sanitize(marked.parse(markdown));
    }
    /**
     * Renders the appropriate content based on current state.
     */
    renderContent() {
        if (this.isLoading) {
            return h("searchcraft-loading", { label: 'LOADING' });
        }
        if (this.isSummaryNotEnabled) {
            return (h("div", { class: 'searchcraft-summary-box-content' }, this.summaryErrorMessage || 'AI summaries are not enabled'));
        }
        return (h("div", { class: 'searchcraft-summary-box-content', innerHTML: this.summary }));
    }
    render() {
        return h("div", { key: 'a33091962cfbbcf0399e9e15e8346590511090e1', class: 'searchcraft-summary-box' }, this.renderContent());
    }
}, [768, "searchcraft-summary-box", {
        "searchcraftId": [1, "searchcraft-id"],
        "summary": [32],
        "summaryErrorMessage": [32],
        "isLoading": [32],
        "isSummaryNotEnabled": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-summary-box", "searchcraft-loading"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-summary-box":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftSummaryBox$1);
            }
            break;
        case "searchcraft-loading":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$2();
            }
            break;
    } });
}

const SearchcraftSummaryBox = SearchcraftSummaryBox$1;
const defineCustomElement = defineCustomElement$1;

export { SearchcraftSummaryBox, defineCustomElement };
//# sourceMappingURL=searchcraft-summary-box.js.map

//# sourceMappingURL=searchcraft-summary-box.js.map