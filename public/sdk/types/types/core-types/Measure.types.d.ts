/**
 * Types of measure requests that can be sent to the /measure/event endpoint.
 */
export type MeasureEventName = 'sdk_initialized' | 'search_requested' | 'search_response_received' | 'search_completed' | 'document_clicked';
/**
 * The type used for sending multiple measure events in a single network request.
 * Uses /measure/batch request.
 */
export interface BatchMeasureRequest {
    items: MeasureRequest[];
}
/**
 * The type representing a measure request.
 */
export interface MeasureRequest {
    event_name: MeasureEventName;
    properties: MeasureRequestProperties;
    user: MeasureRequestUser;
}
/**
 * Properties attached to a measure request.
 */
export interface MeasureRequestProperties {
    searchcraft_organization_id?: string;
    searchcraft_application_id?: string;
    searchcraft_index_names: string[];
    searchcraft_federation_name?: string;
    search_term?: string;
    number_of_documents?: number;
    external_document_id?: string;
    document_position?: number;
    session_id?: string;
}
/**
 * User properties attached to a measure request.
 */
export interface MeasureRequestUser {
    user_id: string;
    country?: string;
    city?: string;
    device_id?: string;
    client_ip?: string;
    locale?: string;
    os?: string;
    platform?: string;
    region?: string;
    sdk_name?: string;
    sdk_version?: string;
    user_agent?: string;
    latitude?: number;
    longitude?: number;
}
//# sourceMappingURL=Measure.types.d.ts.map