import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?scv=0.15.0';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.15.0';
import { p as purify } from './purify.es.js?scv=0.15.0';
import { m as marked } from './marked.esm.js?scv=0.15.0';
import { d as defineCustomElement$1 } from './searchcraft-loading2.js?scv=0.15.0';

const SearchcraftResultsSummary = /*@__PURE__*/ proxyCustomElement(class SearchcraftResultsSummary extends H {
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
    /**
    * Callback invoked when the Searchcraft core instance is available.
    */
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
            return (h("div", { class: 'searchcraft-results-summary-content' }, this.summaryErrorMessage || 'AI summaries are not enabled'));
        }
        return (h("div", { class: 'searchcraft-results-summary-content', innerHTML: this.summary, "aria-live": "polite" }));
    }
    render() {
        return (h("div", { key: '4fabef16a76b57d737aa47fcf106c7375d19a5bc', class: 'searchcraft-results-summary' }, this.renderContent()));
    }
}, [768, "searchcraft-results-summary", {
        "searchcraftId": [1, "searchcraft-id"],
        "summary": [32],
        "summaryErrorMessage": [32],
        "isLoading": [32],
        "isSummaryNotEnabled": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-results-summary", "searchcraft-loading"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-results-summary":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftResultsSummary);
            }
            break;
        case "searchcraft-loading":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { SearchcraftResultsSummary as S, defineCustomElement as d };
//# sourceMappingURL=searchcraft-results-summary2.js.map

//# sourceMappingURL=searchcraft-results-summary2.js.map