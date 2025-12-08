import type { AdClientResponseItem, SearchClientRequestProperties, SearchcraftConfig, SearchcraftResponse } from "../../types/index";
export declare class AdClient {
    config: SearchcraftConfig;
    constructor(config: SearchcraftConfig);
    getAds(_properties: SearchClientRequestProperties): Promise<AdClientResponseItem[]>;
    onQuerySubmitted(_properties: SearchClientRequestProperties): Promise<void>;
    onQueryFetched(_properties: SearchClientRequestProperties, _response: SearchcraftResponse): Promise<void>;
    onInputCleared(): Promise<void>;
    onAdContainerRendered(_data: {
        adClientResponseItem?: AdClientResponseItem;
        adContainerId: string;
        searchTerm: string;
    }): Promise<void>;
    onAdContainerViewed(_data: {
        adClientResponseItem?: AdClientResponseItem;
        adContainerId: string;
        searchTerm: string;
    }): Promise<void>;
}
//# sourceMappingURL=AdClient.d.ts.map