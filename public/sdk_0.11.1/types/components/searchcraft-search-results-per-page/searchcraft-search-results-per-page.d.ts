import type { SearchcraftCore } from "../../classes/index";
/**
 * This web component is designed to choose the number of search results displayed.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftSearchResultsPerPage } from "@searchcraft/react-sdk";
 * ```
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftSearchResultsPerPage } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <!-- index.html -->
 * <searchcraft-search-results-per-page increment="20" />
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftSearchResultsPerPage increment={20} />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftSearchResultsPerPage increment="20" />
 * ```
 */
export declare class SearchcraftSearchResultsPerPage {
    /**
     * The amount the options will increase (e.g. 20 = [20, 40, 60, 80, 100]).
     * The base value is defined by the `searchResultsPerPage` option in the configuration.
     */
    increment: string | number;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    searchTerm: any;
    searchResultsPage: any;
    searchResultsPerPage: any;
    searchResultsCount: any;
    searchResultsPagesCount: any;
    initialSearchResultsPerPage: any;
    setSearchResultsPerPage: (perPage: number) => void;
    setSearchResultsPage: (page: number) => void;
    private unsubscribe;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): any;
}
//# sourceMappingURL=searchcraft-search-results-per-page.d.ts.map