import type { MeasureEventName, MeasureRequestProperties, MeasureRequestUser, SearchcraftConfig, SearchcraftSDKInfo } from "../types/index";
export declare class MeasureClient {
    private measureRequestTimeout;
    private measureRequestsBatched;
    private config;
    private sdkInfo;
    private userId;
    sessionId: string;
    constructor(config: SearchcraftConfig, sdkInfo: SearchcraftSDKInfo, userId: string);
    /**
     * Getter for the base url used by the /measure endpoints.
     */
    private get baseMeasureUrl();
    /**
     * Getter for the measure request user. Uses config values + navigator values.
     */
    private get measureRequestUser();
    /**
     * Sends a measure event to the `/measure/event` endpoint for analytics purposes.
     *
     * @param {MeasureEventName} eventName - Name of the event.
     * @param {Partial<MeasureRequestProperties>} properties - Additional properties to send with the event.
     * @param {Partial<MeasureRequestUser>} user - Additional user properites to send with the event.
     */
    sendMeasureEvent: (eventName: MeasureEventName, properties?: Partial<MeasureRequestProperties>, user?: Partial<MeasureRequestUser>) => Promise<void>;
}
//# sourceMappingURL=MeasureClient.d.ts.map