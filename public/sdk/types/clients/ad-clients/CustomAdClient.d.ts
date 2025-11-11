import type { AdClientResponseItem, SearchClientRequestProperties } from "../../types/index";
import { AdClient } from './AdClient';
export declare class CustomAdClient extends AdClient {
    getAds(_properties: SearchClientRequestProperties): Promise<AdClientResponseItem[]>;
}
//# sourceMappingURL=CustomAdClient.d.ts.map