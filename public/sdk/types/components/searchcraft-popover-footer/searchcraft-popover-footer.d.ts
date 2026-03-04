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
    /**
     * The SDK variant used to render this component. Used for UTM attribution. This isn't exposed for developer consumption, it's set automatically.
     *
     * @internal
     */
    sdkVariant?: 'js' | 'react' | 'vue';
    /**
     * Optional href for the "View all" button.
     */
    viewAllResultsHref?: string;
    /**
     * Optional label for the "View all" button.
     */
    viewAllResultsLabel?: string;
    searchResultsCount: any;
    private unsubscribe;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private get safeViewAllHref();
    render(): any;
}
//# sourceMappingURL=searchcraft-popover-footer.d.ts.map