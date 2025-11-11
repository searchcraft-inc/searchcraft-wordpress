import { p as proxyCustomElement, H, h } from './p-5365011f.js';
import { r as registry } from './p-e30203b1.js';
import { f as formatNumberWithCommas } from './p-d54771ef.js';
import { h as html } from './p-b4b67072.js';

const SearchcraftResultsInfo$1 = /*@__PURE__*/ proxyCustomElement(class SearchcraftResultsInfo extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    /**
     * A callback function responsible for rendering the results info.
     */
    template;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    // store vars
    searchTerm;
    searchResultsPage;
    searchResultsPerPage;
    searchResultsCount;
    searchClientRequestProperties;
    // local vars
    count = 0;
    range = [0, 0];
    responseTime = '0';
    unsubscribe = () => { };
    cleanupCore;
    onCoreAvailable(core) {
        this.unsubscribe = core.store.subscribe((state) => {
            // store vars
            this.searchTerm = state.searchTerm;
            this.searchResultsPage = state.searchResultsPage;
            this.searchResultsPerPage = state.searchResultsPerPage;
            this.searchResultsCount = state.searchResultsCount;
            this.searchClientRequestProperties = state.searchClientRequestProperties;
            // local vars
            this.count = this.searchResultsCount;
            this.range[0] =
                this.searchResultsPage <= 1
                    ? 1
                    : this.searchResultsPerPage * (this.searchResultsPage - 1);
            this.range[1] = this.searchResultsPerPage * this.searchResultsPage;
            this.range[1] =
                this.range[1] > this.searchResultsCount
                    ? this.searchResultsCount
                    : this.range[1];
            this.responseTime = ((state.searchResponseTimeTaken || 0) * 1000).toFixed(2);
        });
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
    }
    render() {
        // Check if this is an initialQuery case (string requestProperties with empty searchTerm)
        const isInitialQuery = typeof this.searchClientRequestProperties === 'string' &&
            this.searchTerm.trim() === '';
        // Only hide if there's no search term AND no initialQuery AND no results
        if ((!this.searchTerm && !isInitialQuery) ||
            this.searchResultsCount === 0) {
            return null;
        }
        return (h("p", { class: 'searchcraft-results-info' }, typeof this.template !== 'undefined'
            ? this.template({
                range: [Number(this.range[0]), Number(this.range[1])],
                count: this.count,
                responseTime: this.responseTime,
            }, { html })
            : `${formatNumberWithCommas(this.count)} results found in ${this.responseTime}ms`));
    }
}, [0, "searchcraft-results-info", {
        "template": [16],
        "searchcraftId": [1, "searchcraft-id"],
        "searchTerm": [32],
        "searchResultsPage": [32],
        "searchResultsPerPage": [32],
        "searchResultsCount": [32],
        "searchClientRequestProperties": [32],
        "count": [32],
        "range": [32],
        "responseTime": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-results-info"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-results-info":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftResultsInfo$1);
            }
            break;
    } });
}

const SearchcraftResultsInfo = SearchcraftResultsInfo$1;
const defineCustomElement = defineCustomElement$1;

export { SearchcraftResultsInfo, defineCustomElement };

//# sourceMappingURL=searchcraft-results-info.js.map