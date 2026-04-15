import type { SearchcraftStore } from "../store/index";
import type { SearchClientRequestProperties } from "../types/index";
export declare class SummaryClient {
    private set;
    private get;
    private abortController;
    private timeout;
    private hasWarnedAboutDeprecatedCortexURL;
    constructor(get: SearchcraftStore['getState'], set: SearchcraftStore['setState']);
    streamSummaryData(requestProperties: SearchClientRequestProperties | string): void;
    private setSummaryUnavailable;
    private warnIfUsingDeprecatedCortexURL;
    private buildSearchClientRequest;
    private formatParamsForRequest;
    private processSseBuffer;
    private handleSseFrame;
    private parseSseFrame;
}
//# sourceMappingURL=SummaryClient.d.ts.map