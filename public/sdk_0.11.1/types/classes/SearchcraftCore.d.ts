import { type AdClient, MeasureClient, SearchClient } from "../clients/index";
import type { AdClientResponseItem, SearchcraftConfig, SearchcraftSDKInfo, SubscriptionEventName, SubscriptionEventCallback, SubscriptionEventMap, UnsubscribeFunction, SearchClientRequestProperties } from "../types/index";
import { type SearchcraftStore } from "../store/index";
/**
 * Javascript Class providing the functionality to interact with the Searchcraft BE
 */
export declare class SearchcraftCore {
    store: SearchcraftStore;
    config: SearchcraftConfig;
    measureClient: MeasureClient | undefined;
    searchClient: SearchClient | undefined;
    adClient: AdClient | undefined;
    userId: string;
    private requestTimeout;
    private subscriptionEvents;
    /**
     * @param config The SearchcraftConfig object for this Searchcraft instance.
     * @param sdkInfo The SDK info object for this searchcraft instance
     * @param searchcraftId The identifier to use to reference this instance of SearchcraftCore.
     */
    constructor(config: SearchcraftConfig, sdkInfo: SearchcraftSDKInfo, searchcraftId: string | undefined);
    private initClients;
    emitEvent<T extends SubscriptionEventName>(eventName: T, event: SubscriptionEventMap[T]): void;
    subscribe<T extends SubscriptionEventName>(eventName: T, callback: SubscriptionEventCallback<T>): UnsubscribeFunction;
    /**
     * Called when a `<searchcraft-ad>` component is rendered
     */
    handleAdContainerRendered(data: {
        adClientResponseItem?: AdClientResponseItem;
        adContainerId: string;
        searchTerm: string;
    }): void;
    /**
     * Called when a `<searchcraft-ad>` is viewed
     */
    handleAdContainerViewed(data: {
        adClientResponseItem?: AdClientResponseItem;
        adContainerId: string;
        searchTerm: string;
    }): void;
    /**
     * Perform various actions when the input is cleared
     */
    handleInputCleared(): void;
    getResponseItems: (props: {
        requestProperties: SearchClientRequestProperties | string;
        shouldCacheResultsForEmptyState: boolean;
    }) => void;
}
//# sourceMappingURL=SearchcraftCore.d.ts.map