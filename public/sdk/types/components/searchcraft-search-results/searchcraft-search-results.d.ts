import type { AdClientResponseItem, SearchClientResponseItem, SearchResultTemplate, SearchResultTemplateData, SearchcraftConfig } from "../../types/index";
import type { SearchcraftCore } from "../../classes/index";
import type { SearchcraftState } from "../../store/index";
/**
 * This web component is responsible for displaying the results of a search query. Once a query is submitted, the component formats and presents an ordered list of the results.
 *
 *
 * @react-import
 * ```jsx
 * import { SearchcraftSearchResults } from "@searchcraft/react-sdk";
 * ```
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftSearchResults } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <!-- index.html -->
 * <searchcraft-search-results></searchcraft-search-results>
 * ```
 *
 * ```js
 * // index.js
 * const searchResults = document.querySelector('searchcraft-search-results');
 *
 * searchResults.template = (item, index, { html }) => html`
 *  <h2>${item.title}</h2>
 * `;
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftSearchResults
 *   template={(item, index, { html }) => html`
 *     <h2>${item.title}</h2>
 *   `}
 * />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftSearchResults
 *   :template={(item, index, { html }) => html`
 *     <h2>${item.title}</h2>
 *   `}
 * />
 * ```
 */
export declare class SearchcraftSearchResults {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    /**
     * A query that will appears when the component initializes or the search term is ''..
     */
    initialQuery?: string;
    /**
     * A callback function responsible for rendering a result. Passed to `searchcraft-search-result`.
     * Pass URLs from the result through the `safeUrl` helper before placing them in an `href` or `src`.
     * Never place result values in event handler attributes such as `onclick`, or in `style`.
     */
    template?: SearchResultTemplate<SearchResultTemplateData>;
    adClientResponseItems: AdClientResponseItem[];
    config?: SearchcraftConfig;
    isSearchInProgress: boolean;
    searchClientResponseItems?: SearchClientResponseItem[];
    searchResultsPage: any;
    searchResultsPerPage: any;
    searchTerm: string;
    /**
     * The search term of the most recent search request, used to tell a
     * completed search apart from a term that has not been searched yet.
     */
    completedSearchTerm: string | undefined;
    private unsubscribe?;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleStateChange(state: SearchcraftState): void;
    /**
     * Whether the search for the current search term has completed with no
     * results. False while the term is empty, while a search is in progress, and
     * after the term changes until its search completes.
     */
    get hasNoResultsToShow(): boolean;
    renderEmptyState(): any;
    renderNoResultsFoundState(): any;
    renderWithADMAds(): any;
    renderWithCustomAds(): any;
    renderWithNativoAds(): any;
    renderWithNoAds(): any;
    render(): any;
}
//# sourceMappingURL=searchcraft-search-results.d.ts.map