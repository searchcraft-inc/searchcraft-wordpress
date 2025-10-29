import type { AdClientResponseItem } from "../../types/index";
import type { SearchcraftState } from "../../store/index";
import type { SearchcraftCore } from "../../classes/index";
/**
 * An inline ad meant to be rendered in a list of search results.
 *
 * @internal
 */
export declare class SearchcraftPopoverListItemAd {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    adSource: 'Custom' | 'Nativo' | 'adMarketplace';
    adClientResponseItem?: AdClientResponseItem;
    /**
     * Where the ad is being rendered within the search results div.
     * Lifecycle behavior differs for ads being rendered in different positions,
     * so we need to be able to handle all of those cases.
     */
    renderPosition: 'interstitial' | 'top' | 'bottom';
    searchTerm?: string;
    isSearchInProgress: boolean;
    searchResultCount: number;
    hostElement?: HTMLElement;
    private core?;
    private intersectionObserver?;
    private storeUnsubscribe?;
    private cleanupCore?;
    private adContainerRenderedTimeout?;
    private isComponentConnected;
    private timeTaken?;
    adContainerId: string;
    /**
     * Handles when an ad container is first rendered.
     * Core emits an ad_container_rendered event and performs ad client side effects
     *
     */
    handleAdRendered(): void;
    handleAdViewed(): void;
    /**
     * Things to do when there's a new incoming search request.
     */
    handleNewIncomingSearchRequest(state: SearchcraftState): void;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    startIntersectionObserver(): void;
    disconnectedCallback(): void;
    renderADMAd(): any;
    renderCustomAd(): any;
    renderNativoAd(): any;
    render(): any;
}
//# sourceMappingURL=searchcraft-ad.d.ts.map