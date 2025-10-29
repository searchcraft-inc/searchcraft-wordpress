import type { SearchcraftCore } from "../../classes/index";
import type { FilterItem, DateRangeFilterItem } from "../../types/index";
/**
 * This web component represents a series of filters that allows users to refine and control their search queries by applying various filter criteria.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftFilterPanel } from "@searchcraft/react-sdk";
 * ```
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftFilterPanel } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <!-- index.html -->
 * <searchcraft-filter-panel />
 * ```
 *
 * ```js
 * // index.js
 * const filterPanel = document.querySelector('searchcraft-filter-panel');
 *
 * if (filterPanel) {
 *   filterPanel.items = [];
 * }
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftFilterPanel items={[]} />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftFilterPanel :items="[]" />
 * ```
 */
export declare class SearchcraftFilterPanel {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    /**
     * The items to filter.
     */
    items: FilterItem[];
    lastSearchTerm: string | undefined;
    private core?;
    private unsubscribe?;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    /**
     * Sets the initial min/max date range values for search queries based on the filter items provided.
     */
    setInitialDateRanges(): void;
    handleDateRangeChanged(item: DateRangeFilterItem, min: number, max: number): void;
    handleNumericRangeChanged(fieldName: string, min: number, max: number): void;
    handleFacetSelectionUpdated(fieldName: string, paths: string[]): void;
    handleExactMatchToggleUpdated(isActive: boolean): void;
    handleMostRecentToggleUpdated(fieldName: string, isActive: boolean): void;
    /**
     * Iterate through `items` and render them based on `type`
     */
    render(): any;
}
//# sourceMappingURL=searchcraft-filter-panel.d.ts.map