import type { FacetPrime } from './Facets.types';
/**
 * The structure of a response returned from a Searchcraft operation.
 */
export interface SearchcraftResponse {
    status: number;
    data: SearchcraftResponseData | SearchcraftResponseError;
}
/**
 * Error returned when a search is unsuccessful.
 */
export type SearchcraftResponseError = {
    status: number;
    message?: string;
    code?: number;
    hits?: [];
    facets?: null;
    count?: number;
    time_taken?: number;
};
/**
 * Top-level result returned when a search is successful.
 */
export interface SearchcraftResponseData {
    count?: number;
    facets?: FacetPrime;
    hits?: SearchIndexHit[];
    time_taken?: number;
}
/**
 * Represents an entry in the search index returned as part of a search result.
 */
export interface SearchIndexHit {
    doc?: SearchDocument;
    document_id?: string;
    score?: number;
    source_index?: string;
}
/**
 * Data document returned within a SearchResult.
 */
export interface SearchDocument extends Record<string, string | number> {
    id: number;
    [key: string]: string | number;
}
//# sourceMappingURL=SearchcraftResponse.types.d.ts.map