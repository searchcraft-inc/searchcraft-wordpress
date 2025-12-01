import type { SearchcraftCore } from "../../classes/index";
import type { DateRangeFilterItem, FilterItem } from "../../types/index";
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
    /**
     * The breakpoint (in pixels) below which the filter panel will be hidden.
     * Defaults to 768px (--sc-breakpoint-md).
     */
    responsiveBreakpoint?: number;
    /**
     * Controls whether the filter panel automatically hides/shows based on window size.
     * - 'auto': Automatically hide/show based on window width
     * - 'manual': User controls visibility manually
     */
    responsiveBehavior?: 'auto' | 'manual';
    lastSearchTerm: string | undefined;
    isFilterPanelVisible: boolean;
    hostElement: HTMLElement;
    private core?;
    private unsubscribe?;
    private cleanupCore?;
    private resizeObserver?;
    private manuallyToggled;
    private toggleClickHandler?;
    onCoreAvailable(core: SearchcraftCore): void;
    componentDidLoad(): void;
    disconnectedCallback(): void;
    /**
     * Sets up a ResizeObserver to watch for window size changes
     */
    setupResizeObserver(): void;
    /**
     * Handles window resize events
     */
    handleWindowResize: () => void;
    /**
     * Updates filter panel visibility based on current window width
     */
    updateVisibilityBasedOnWindowSize(): void;
    /**
     * Sets up click handlers for elements with data-toggle-filter-panel attribute
     */
    setupToggleClickHandlers(): void;
    /**
     * Updates data attributes on toggle elements to reflect panel visibility state
     */
    updateToggleElementAttributes(isVisible: boolean): void;
    /**
     * Cleans up click handlers for toggle elements
     */
    cleanupToggleClickHandlers(): void;
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