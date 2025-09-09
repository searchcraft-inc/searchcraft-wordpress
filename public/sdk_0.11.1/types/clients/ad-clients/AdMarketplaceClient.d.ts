import type { AdClientResponseItem, SearchClientRequestProperties } from "../../types/index";
import { AdClient } from './AdClient';
export declare class AdMarketplaceClient extends AdClient {
    /**
     * Gets ads from the adMarketplace API based on the search term.
     */
    getAds(_properties: SearchClientRequestProperties): Promise<AdClientResponseItem[]>;
    onAdContainerViewed(data: {
        adClientResponseItem?: AdClientResponseItem;
        adContainerId: string;
        searchTerm: string;
    }): Promise<void>;
}
//# sourceMappingURL=AdMarketplaceClient.d.ts.map