export interface SubscriptionEventMap {
    ad_container_rendered: AdContainerRenderedSubscriptionEvent;
    ad_container_viewed: AdContainerViewedSubscriptionEvent;
    query_fetched: QueryFetchedEvent;
    query_submitted: QuerySubmittedEvent;
    initialized: InitializedEvent;
    input_cleared: InputClearedEvent;
    no_results_returned: NoResultsReturnedEvent;
}
export interface AdContainerRenderedSubscriptionEvent extends SubscriptionEvent {
    name: 'ad_container_rendered';
    data: {
        adContainerId: string;
        searchTerm: string;
    };
}
export interface AdContainerViewedSubscriptionEvent extends SubscriptionEvent {
    name: 'ad_container_viewed';
    data: {
        adContainerId: string;
        searchTerm: string;
    };
}
export interface QuerySubmittedEvent extends SubscriptionEvent {
    name: 'query_submitted';
    data: {
        searchTerm: string;
    };
}
export interface QueryFetchedEvent extends SubscriptionEvent {
    name: 'query_fetched';
    data: {
        searchTerm: string;
    };
}
export interface InputClearedEvent extends SubscriptionEvent {
    name: 'input_cleared';
}
export interface NoResultsReturnedEvent extends SubscriptionEvent {
    name: 'no_results_returned';
}
export interface InitializedEvent extends SubscriptionEvent {
    name: 'initialized';
}
export type SubscriptionEventName = keyof SubscriptionEventMap;
export type SubscriptionEventCallback<T extends SubscriptionEventName> = (event: SubscriptionEventMap[T]) => void;
export type UnsubscribeFunction = () => void;
export interface SubscriptionEvent {
    name: SubscriptionEventName;
}
//# sourceMappingURL=SubscriptionEvents.types.d.ts.map