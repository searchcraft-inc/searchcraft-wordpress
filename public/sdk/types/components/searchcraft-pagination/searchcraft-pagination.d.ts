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
    /**
     * Whether to scroll to the top of the search results when pagination buttons are clicked.
     * @default true
     */
    scrollToTop?: boolean;
    /**
     * The URL query string parameter name used to track the current page. When a user navigates
     * to a URL that contains this parameter, the pagination component will automatically navigate
     * to that page.
     * @default "p"
     */
    pageQueryParam: string;
    /**
     * Whether to use a query string parameter to track and restore the current page.
     * Set to `false` to disable query string synchronisation entirely.
     * @default true
     */
    usePageQueryParam: boolean;
    searchTerm: any;
    searchResultsPerPage: any;
    searchResultsPage: any;
    searchResultsCount: any;
    searchClientRequestProperties: any;
    searchResultsPagesCount: number;
    searchResultsRangeMin: number;
    searchResultsRangeMax: number;
    setSearchResultsPage: (page: number) => void;
    private unsubscribe;
    private cleanupCore?;
    private _initialPageApplied;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Smooth scroll to the top of the search results component
     */
    private scrollAnimationId?;
    private smoothScrollToSearchResults;
    /**
     * Returns the page number from the URL query string, or null if not present / disabled.
     * Reads from the top-level window when inside a same-origin iframe so that the
     * address-bar URL is the source of truth (consistent with updateUrlPage).
     */
    private getPageFromUrl;
    /**
     * Updates (or removes) the page query string parameter in the browser URL without
     * triggering a navigation/reload.
     * When running inside a same-origin iframe (e.g. Storybook), the top-level window's
     * URL is updated so the change is visible in the address bar.
     */
    private updateUrlPage;
    handleGoToPage(page: number): void;
    renderOddPaginationItem(page: number): any;
    renderEvenPaginationItem(page: number): any;
    renderMiddlePaginationItem(): any;
    render(): any;
}
//# sourceMappingURL=searchcraft-pagination.d.ts.map