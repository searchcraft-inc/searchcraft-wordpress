import type { SearchcraftCore } from "../../classes/index";
/**
 * This component renders a results summary for RAG search result summaries.
 * When the user makes a search, a network call is made to retrieve the summary content, which is then
 * rendered in this box.
 *
 * NOTE: This component requires the usage of a read key that has "SUMMARY" permissions.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftResultsSummary } from "@searchcraft/react-sdk";
 * ```
 *
 * @vue-import
 * ```ts
 * import { SearchcraftResultsSummary } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <searchcraft-results-summary />
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftResultsSummary />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftResultsSummary />
 * ```
 */
export declare class SearchcraftResultsSummary {
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
    /**
     * Callback invoked when the Searchcraft core instance is available.
     */
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
//# sourceMappingURL=searchcraft-results-summary.d.ts.map