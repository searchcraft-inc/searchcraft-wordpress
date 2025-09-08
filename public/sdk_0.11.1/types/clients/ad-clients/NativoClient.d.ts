import type { AdClientResponseItem, SearchcraftConfig, SearchcraftResponse, SearchClientRequestProperties } from "../../types/index";
import { AdClient } from './AdClient';
export declare class NativoClient extends AdClient {
    adCallTimeout?: NodeJS.Timeout;
    constructor(config: SearchcraftConfig);
    onQuerySubmitted(_properties: SearchClientRequestProperties): Promise<void>;
    onQueryFetched(_properties: SearchClientRequestProperties, response: SearchcraftResponse): Promise<void>;
    onInputCleared(): Promise<void>;
    performAdCall(delay: number): void;
    getAds(_properties: SearchClientRequestProperties): Promise<AdClientResponseItem[]>;
    private addScriptTagToDocument;
    private removeScriptTagFromDocument;
}
//# sourceMappingURL=NativoClient.d.ts.map