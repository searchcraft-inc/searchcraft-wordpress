import type { SearchcraftCore } from "../../classes/index";
import type { PopoverResultMappings, SearchClientResponseItem, SearchDocument } from "../../types/index";
/**
 * A single list item rendered in a searchcraft-popover-list-view.
 *
 * @internal
 */
export declare class SearchcraftPopoverListItem {
    item: SearchClientResponseItem | undefined;
    popoverResultMappings: PopoverResultMappings | undefined;
    /** The document position relative to the search results (For Measure) */
    documentPosition: number;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    title?: string;
    subtitle?: string;
    href?: string;
    imageSource?: string;
    imageAlt?: string;
    core?: SearchcraftCore;
    private cleanupCore?;
    mapValuesFromDocument(document: SearchDocument): void;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleLinkClick: () => void;
    render(): any;
}
//# sourceMappingURL=searchcraft-popover-list-item.d.ts.map