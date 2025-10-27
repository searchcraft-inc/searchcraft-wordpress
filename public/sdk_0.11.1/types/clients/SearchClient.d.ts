import type { SearchcraftCore } from "../classes/index";
import type { SearchcraftConfig, SearchcraftResponse, SearchClientRequestProperties } from "../types/index";
export declare class SearchClient {
    private config;
    private userId;
    private parent;
    private searchCompletedEventTimeout;
    private abortController;
    private supplementalAbortController;
    constructor(parent: SearchcraftCore, config: SearchcraftConfig, userId: string);
    /**
     * Getter for the base url used by the /search endpoint.
     * Supports both index and federation search endpoints.
     */
    private get baseSearchUrl();
    /**
     * Immediately cancels all pending search requests.
     */
    abortRequests: () => void;
    /**
     * Make the request to get the search results.
     * @param {properties} properties - The properties for the search.
     * @param isSupplemental - Whether or not this is a supplemental search request (for the purpose of getting top-level facet counts)
     * @returns
     */
    getSearchResponseItems: (properties: SearchClientRequestProperties | string, isSupplemental?: boolean) => Promise<SearchcraftResponse>;
    private handleGetSearchResponseItemsWithString;
    private handleGetSearchResponseItemsWithObject;
    /**
     * Builds a query object for the SearchClient request.
     * @param {properties} properties - The properties for the search.
     * @returns {SearchClientQuery} - A properly formatted SearchClient query object.
     */
    private formatParamsForRequest;
}
//# sourceMappingURL=SearchClient.d.ts.map