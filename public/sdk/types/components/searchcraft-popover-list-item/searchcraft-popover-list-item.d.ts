import type { SearchcraftCore } from "../../classes/index";
import type { PopoverResultMappings, SearchClientResponseItem, SearchDocument, SearchResultTemplate, SearchResultTemplateData } from "../../types/index";
/**
 * A single list item rendered in a searchcraft-popover-list-view.
 *
 * @internal
 */
export declare class SearchcraftPopoverListItem {
    item: SearchClientResponseItem | undefined;
    popoverResultMappings: PopoverResultMappings | undefined;
    /**
     * A callback function responsible for rendering the result. When provided, it is used instead of `popoverResultMappings`, which are still used if the template throws.
     */
    template?: SearchResultTemplate<SearchResultTemplateData>;
    /**
     * The index of the result in the list view. Passed to the `template` callback.
     */
    index: number;
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
    templateHtml: string | undefined;
    hostElement?: HTMLElement;
    core?: SearchcraftCore;
    private cleanupCore?;
    mapValuesFromDocument(document: SearchDocument): void;
    /**
     * Maps the document values and renders the template, if there is one. The mapped values are
     * always kept so the result can fall back to them if the template throws or is removed.
     */
    updateRenderedValues(): void;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    sendDocumentClickedEvent(): void;
    handleLinkClick: () => void;
    /**
     * Sends the click event when a link inside the rendered template is clicked.
     */
    handleTemplateClick: (event: MouseEvent) => void;
    handleKeyDown: () => void;
    render(): any;
}
//# sourceMappingURL=searchcraft-popover-list-item.d.ts.map