export interface FacetPathsForIndexField {
    fieldName: string;
    value: string;
}
export interface RangeValueForIndexField {
    fieldName: string;
    value: string;
}
export interface SearchClientQuery {
    occur?: 'must' | 'should';
    exact?: {
        ctx: string;
    };
    fuzzy?: {
        ctx: string;
    };
}
export type SearchClientRequest = {
    limit?: number;
    offset?: number;
    order_by?: string;
    sort?: 'asc' | 'desc';
    query: SearchClientQuery[];
};
export interface SearchClientRequestProperties {
    /**
     * The search mode, which can be either 'fuzzy' or 'exact'.
     */
    mode: 'fuzzy' | 'exact';
    /**
     * The starting point for the results, used for pagination.
     * Optional parameter.
     */
    offset?: number;
    /**
     * The number of results returned.
     * Optional parameter.
     */
    limit?: number;
    /**
     * The field to order the results by (e.g., 'date_published', 'title', etc.).
     * Optional parameter.
     */
    order_by?: string | null;
    /**
     * The search term provided by the user.
     */
    searchTerm: string;
    /**
     * The sort order, which can be either 'asc' or 'desc'.
     * Optional parameter.
     */
    sort?: 'asc' | 'desc' | null;
    /**
     * The facet path value(s) specified by the `facets` filter items that the `searchcraft-filter-panel` renders.
     * There may be multiple rendered within a single filter panel.
     * Optional parameter.
     */
    facetPathsForIndexFields?: Record<string, FacetPathsForIndexField>;
    /**
     * The date range slider value(s) specified by the `dateRange` filter items that the `searchcraft-filter-panel` renders.
     * There may be multiple rendered within a single filter panel.
     * Optional parameter.
     */
    rangeValueForIndexFields?: Record<string, RangeValueForIndexField>;
}
//# sourceMappingURL=SearchClient.types.d.ts.map