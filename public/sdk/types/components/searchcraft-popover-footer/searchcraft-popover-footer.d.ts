import type { SearchcraftCore } from "../../classes/index";
/**
 * Renders the footer for the searchcraft-popover-form.
 *
 * @internal
 */
export declare class SearchcraftPopoverFooter {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    searchResultsCount: any;
    private unsubscribe;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): any;
}
//# sourceMappingURL=searchcraft-popover-footer.d.ts.map