import { type EventEmitter } from '../../stencil-public-runtime';
import type { FacetWithChildrenObject } from "../../types/index";
import type { SearchcraftCore } from "../../classes/index";
import type { SearchcraftState } from "../../store/index";
type HandlerActionType = 'SEARCH_TERM_EMPTY' | 'NEW_SEARCH_TERM' | 'NEW_SEARCH_TERM_WHILE_FACETS_ACTIVE' | 'RANGE_VALUE_UPDATE' | 'EXACT_MATCH_UPDATE' | 'SORT_ORDER_UPDATE' | 'FACET_UPDATE' | 'UNKNOWN';
/**
 * This web component is designed to display facets in a search interface, allowing users to refine their search results by applying filters based on various attributes.
 * It is consumed within the `searchcraft-filter-panel`.
 *
 * @js-example
 * ```html
 * <!-- index.html -->
 * <searchcraft-facet-list field-name="title" />
 * ```
 *
 * ```js
 * // index.js
 * const facetList = document.querySelector('searchcraft-facet-list');
 *
 * facetList.addEventListener('facetSelectionUpdated', () => {
 *   console.log('Facet selection updated');
 * });
 * ```
 *
 * @internal
 */
export declare class SearchcraftFacetList {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    /**
     * The name of the field where facets are applied.
     */
    fieldName: string;
    /**
     * Array of facet values to exclude from rendering.
     */
    exclude?: string[];
    /**
     * Emitted when the facets are updated.
     */
    facetSelectionUpdated?: EventEmitter<{
        paths: string[];
    }>;
    /**
     * The currently selected facet paths.
     */
    selectedPaths: Record<string, boolean>;
    /**
     * A Tree representing all of the facets collected from search responses.
     */
    facetTreeCollectedFromSearchResponse: FacetWithChildrenObject;
    /**
     * A Tree representing the facet paths that are selected, but were not included
     * in any search response.
     */
    facetTreeFromFacetPathsNotInSearchResponse: FacetWithChildrenObject;
    /**
     * The facet tree that ultimately gets rendered.
     * This is a mergin of the facetTreeCollectedFromSearchResponse and the facetTreeFromFacetPathsNotInSearchResponse tree
     */
    renderedFacetTree: FacetWithChildrenObject;
    private lastTimeTaken?;
    private lastSearchTerm?;
    private lastSearchMode?;
    private lastSortType?;
    private lastRangeValues?;
    private lastFacetValues?;
    private unsubscribe?;
    private cleanupCore?;
    get areAnyFacetPathsSelected(): boolean;
    handleIncomingSearchResponse(state: SearchcraftState, actionType: HandlerActionType): void;
    handleStateUpdate(_state: SearchcraftState): void;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleCheckboxChange(path: string): void;
    formatFacetName: (name: string) => string;
    renderFacet(keyName: string, facet: FacetWithChildrenObject): any;
    render(): any;
}
export {};
//# sourceMappingURL=searchcraft-facet-list.d.ts.map