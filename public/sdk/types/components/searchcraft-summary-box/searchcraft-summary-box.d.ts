import type { SearchcraftCore } from "../../classes/index";
/**
 * @deprecated Use `searchcraft-results-summary` instead.
 * This component is deprecated and will be removed in a future version.
 * Please update to use `searchcraft-results-summary` which has the same functionality.
 *
 * This component renders a summary box for RAG search result summaries.
 * When the user makes a search, a network call is made to retrieve the summary content, which is then
 * rendered in this box.
 *
 * NOTE: This component requires the usage of a read key that has "SUMMARY" permissions.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftSummaryBox } from "@searchcraft/react-sdk";
 * ```
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftSummaryBox } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <searchcraft-summary-box />
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftSummaryBox />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftSummaryBox />
 * ```
 */
export declare class SearchcraftSummaryBox {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    summary: string;
    summaryErrorMessage: string;
    isLoading: boolean;
    isSummaryNotEnabled: boolean;
    private unsubscribe?;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Handles state changes from the store and updates component state.
     */
    private handleStateChange;
    /**
     * Sanitizes and converts markdown to HTML.
     */
    private sanitizeMarkdown;
    /**
     * Renders the appropriate content based on current state.
     */
    private renderContent;
    render(): any;
}
//# sourceMappingURL=searchcraft-summary-box.d.ts.map