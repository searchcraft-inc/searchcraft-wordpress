import type { SearchcraftCore } from "../../classes/index";
import type { AdClientResponseItem, PopoverResultMappings, SearchClientResponseItem } from "../../types/index";
/**
 * This web component is designed to display a list of results within a popover interface.
 * It is consumed within the `searchcraft-popover-form` component.
 *
 * @js-example
 * ```html
 * <searchcraft-popover-list-view />
 * ```
 *
 * @internal
 */
export declare class SearchcraftPopoverListView {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    /**
     * The mappings that define how the data in the documents are mapped to the
     * list-view-item elements.
     */
    popoverResultMappings: PopoverResultMappings | undefined;
    /**
     * The items to render in the list view.
     */
    searchClientResponseItems: SearchClientResponseItem[] | undefined;
    adClientResponseItems: AdClientResponseItem[] | undefined;
    searchResultsPage: number;
    searchResultsPerPage: number;
    private config?;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    renderWithADMAds(): any;
    renderWithCustomAds(): any;
    renderWithNativoAds(): any;
    renderWithNoAds(): any;
    render(): any;
}
//# sourceMappingURL=searchcraft-popover-list-view.d.ts.map