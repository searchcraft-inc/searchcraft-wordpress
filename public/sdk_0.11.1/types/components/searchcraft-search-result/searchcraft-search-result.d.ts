import type { SearchClientResponseItem, SearchResultTemplate, SearchResultTemplateData } from "../../types/index";
import type { SearchcraftCore } from "../../classes/index";
/**
 * This web component is designed to display detailed information for a single search result. Once a query is submitted, the component formats and presents the result.
 *
 * @internal
 */
export declare class SearchcraftSearchResult {
    item?: SearchClientResponseItem;
    /**
     * The index.
     */
    index: number;
    /**
     * The position in the document. Used with the "document_clicked" measure event.
     */
    documentPosition: number;
    /**
     * A callback function responsible for rendering a result.
     */
    template?: SearchResultTemplate<SearchResultTemplateData>;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    templateHtml: string | undefined;
    hostElement?: HTMLElement;
    core?: SearchcraftCore;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleResultContainerClick: (event: MouseEvent) => void;
    handleKeyDown: () => void;
    render(): any;
}
//# sourceMappingURL=searchcraft-search-result.d.ts.map