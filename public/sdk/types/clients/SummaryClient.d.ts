import type { SearchcraftStore } from "../store/index";
export declare class SummaryClient {
    private set;
    private get;
    private abortController;
    private timeout;
    constructor(get: SearchcraftStore['getState'], set: SearchcraftStore['setState']);
    streamSummaryData(): void;
}
//# sourceMappingURL=SummaryClient.d.ts.map