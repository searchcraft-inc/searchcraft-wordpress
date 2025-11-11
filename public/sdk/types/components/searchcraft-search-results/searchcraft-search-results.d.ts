import type { AdClientResponseItem, SearchClientResponseItem, SearchcraftConfig, SearchResultTemplate, SearchResultTemplateData } from "../../types/index";
import type { SearchcraftState } from "../../store/index";
import type { SearchcraftCore } from "../../classes/index";
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
 * <searchcraft-search-results
 *   ad-interval="4"
 *   place-ad-at-start="true"
 * />
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
 *   adInterval={4}
 *   placeAdAtState={true}
 *   template={(item, index, { html }) => html`
 *     <h2>${item.title}</h2>
 *   `}
 * />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftSearchResults
 *   adInterval={4}
 *   placeAdAtState={true}
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
     */
    template?: SearchResultTemplate<SearchResultTemplateData>;
    adClientResponseItems: AdClientResponseItem[];
    config?: SearchcraftConfig;
    isSearchInProgress: boolean;
    searchClientResponseItems?: SearchClientResponseItem[];
    searchResultsPage: any;
    searchResultsPerPage: any;
    searchTerm: string;
    private unsubscribe?;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleStateChange(state: SearchcraftState): void;
    renderEmptyState(): any;
    renderNoResultsFoundState(): any;
    renderWithADMAds(): any;
    renderWithCustomAds(): any;
    renderWithNativoAds(): any;
    renderWithNoAds(): any;
    render(): any;
}
//# sourceMappingURL=searchcraft-search-results.d.ts.map