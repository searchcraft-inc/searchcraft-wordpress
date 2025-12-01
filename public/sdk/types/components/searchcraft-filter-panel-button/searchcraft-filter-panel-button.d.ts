import type { SearchcraftCore } from "../../classes/index";
/**
 * Renders a button which toggles the visibility of the filter panel.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftFilterPanelButton } from "@searchcraft/react-sdk";
 * ````
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftFilterPanelButton } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <!-- index.html -->
 * <searchcraft-filter-panel-button>
 *   Toggle Filters
 * </searchcraft-filter-panel-button>
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftFilterPanelButton>
 *   Toggle Filters
 * </SearchcraftFilterPanelButton>
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftFilterPanelButton>
 *   Toggle Filters
 * </SearchcraftFilterPanelButton>
 * ```
 */
export declare class SearchcraftFilterPanelButton {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    isFilterPanelVisible: boolean;
    private unsubscribe;
    private cleanupCore?;
    private core?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    handleOnClick(): void;
    disconnectedCallback(): void;
    render(): any;
}
//# sourceMappingURL=searchcraft-filter-panel-button.d.ts.map