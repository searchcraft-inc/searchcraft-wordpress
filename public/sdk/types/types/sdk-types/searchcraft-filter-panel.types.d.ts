export interface FilterItem {
    type: 'facets' | 'dateRange' | 'numericRange' | 'exactMatchToggle' | 'mostRecentToggle';
    label: string;
    options: object | null;
}
export interface FacetsFilterItem extends FilterItem {
    fieldName: string;
    type: 'facets';
    options: {
        showSublevel: boolean;
        exclude?: string[];
        /**
         * Initial collapse state of the facet section.
         * - 'open': Section is expanded by default
         * - 'closed': Section is collapsed by default
         * @default 'open'
         */
        initialCollapseState?: 'open' | 'closed';
        /**
         * The number of facets to show before displaying a "view more" link.
         * Set to 0 to show all facets without a "view more" link.
         * @default 8
         */
        viewMoreThreshold?: number;
    };
}
export interface NumericFilterItem extends FilterItem {
    fieldName: string;
    type: 'numericRange';
    options: {
        min: number;
        max: number;
        granularity: number;
    };
}
export interface DateRangeFilterItem extends FilterItem {
    fieldName: string;
    type: 'dateRange';
    options: {
        minDate: Date;
        maxDate?: Date;
        granularity: 'year' | 'month' | 'day' | 'hour';
    };
}
export interface ExactMatchToggleFilterItem extends FilterItem {
    type: 'exactMatchToggle';
    options: {
        subLabel?: string;
    };
}
export interface MostRecentToggleFilterItem extends FilterItem {
    fieldName: string;
    type: 'mostRecentToggle';
    options: {
        subLabel?: string;
    };
}
//# sourceMappingURL=searchcraft-filter-panel.types.d.ts.map