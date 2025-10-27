import type { SearchcraftCore } from "../../classes/index";
/**
 * This web component is designed to facilitate pagination of search results. Once a query is submitted, calculates the number for pages.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftPagination } from "@searchcraft/react-sdk";
 * ```
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftPagination } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <searchcraft-pagination />
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftPagination />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftPagination />
 * ```
 */
export declare class SearchcraftPagination {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    searchTerm: any;
    searchResultsPerPage: any;
    searchResultsPage: any;
    searchResultsCount: any;
    searchResultsPagesCount: number;
    searchResultsRangeMin: number;
    searchResultsRangeMax: number;
    setSearchResultsPage: (page: number) => void;
    private unsubscribe;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleGoToPage(page: number): void;
    renderOddPaginationItem(page: number): any;
    renderEvenPaginationItem(page: number): any;
    renderMiddlePaginationItem(): any;
    render(): any;
}
//# sourceMappingURL=searchcraft-pagination.d.ts.map