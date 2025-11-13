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