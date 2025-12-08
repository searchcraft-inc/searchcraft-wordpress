import type { AdClientResponseItem, FacetPathsForIndexField, FacetPrime, RangeValueForIndexField, SearchClientRequest, SearchClientRequestProperties, SearchClientResponseItem } from "../types/index";
import type { StoreApi } from 'zustand';
import type { SearchcraftCore } from "../classes/index";
import type { SummaryClient } from "../clients/SummaryClient";
/**
 * Callable functions made available by the SearchcraftStore.
 */
export interface SearchcraftStateFunctions {
    addFacetPathsForIndexField: (field: FacetPathsForIndexField) => void;
    addRangeValueForIndexField: (field: RangeValueForIndexField) => void;
    removeFacetPathsForIndexField: (fieldName: string) => void;
    removeRangeValueForIndexField: (fieldName: string) => void;
    resetSearchValues: () => void;
    search: (options?: {
        skipSummary?: boolean;
    }) => Promise<void>;
    setFilterPanelVisibility: (isVisible: boolean) => void;
    setPopoverVisibility: (isVisible: boolean) => void;
    setSearchResultsCount: (count: number) => void;
    setSearchResultsPage: (page: number) => void;
    setSearchResultsPerPage: (perPage: number) => void;
    setSearchTerm: (searchTerm: string) => void;
    setSearchMode: (mode: 'fuzzy' | 'exact') => void;
    setSortOrder: (props: {
        orderByField: string | null;
        sortType: 'asc' | 'desc' | null;
    }) => void;
    setHotKeyAndHotKeyModifier: (hotkey?: string, hotkeyModifier?: 'ctrl' | 'meta' | 'alt' | 'option') => void;
}
/**
 * Values stored in SearchcraftStore.
 */
export interface SearchcraftStateValues {
    adClientResponseItems: AdClientResponseItem[];
    cachedAdClientResponseItems: AdClientResponseItem[];
    core: SearchcraftCore | undefined;
    hotkey: string;
    hotkeyModifier: 'ctrl' | 'meta' | 'alt' | 'option';
    facetPathsForIndexFields: Record<string, FacetPathsForIndexField>;
    isFilterPanelVisible: boolean;
    isPopoverVisible: boolean;
    isSearchInProgress: boolean;
    rangeValueForIndexFields: Record<string, RangeValueForIndexField>;
    searchMode: 'fuzzy' | 'exact';
    searchClientRequest?: SearchClientRequest;
    searchClientRequestProperties: SearchClientRequestProperties | string | undefined | null;
    searchClientResponseItems: SearchClientResponseItem[];
    cachedSearchClientResponseItems: SearchClientResponseItem[];
    cachedSearchResponseFacetPrime: FacetPrime | undefined | null;
    cachedSupplementalFacetPrime: FacetPrime | undefined | null;
    cachedSearchResponseTimeTaken: number | undefined;
    cachedSearchResultsCount: number | undefined;
    cachedSearchClientRequestProperties: SearchClientRequestProperties | string | undefined | null;
    searchResponseTimeTaken: number | undefined;
    searchResponseFacetPrime: FacetPrime | undefined | null;
    supplementalFacetPrime: FacetPrime | undefined | null;
    searchResultsCount: number;
    searchResultsPage: number;
    searchResultsPerPage: number;
    searchTerm: string;
    orderByField: string | undefined | null;
    sortType: 'asc' | 'desc' | undefined | null;
    summary: string;
    hasSummaryBox: boolean;
    isSummaryLoading: boolean;
    summaryClient?: SummaryClient;
    isSummaryNotEnabled: boolean;
}
export interface SearchcraftState extends SearchcraftStateFunctions, SearchcraftStateValues {
}
export type SearchcraftStore = StoreApi<SearchcraftState>;
//# sourceMappingURL=SearchcraftStore.types.d.ts.map