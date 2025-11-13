import { p as proxyCustomElement, H, c as createEvent, h } from './p-5365011f.js';
import { r as registry } from './p-e30203b1.js';
import './p-e2a10337.js';

/**
 * Helper function for getting a Node (FacetWithChildrenObject)
 * at a given path. Traverses the node tree to get the node.
 */
const getFacetTreeNodeAtPath = (tree, nodePaths) => {
    let cursor = tree;
    for (const nodePath of nodePaths) {
        cursor = cursor?.children[nodePath];
    }
    return cursor;
};
/**
 * Helper function to perform a deep merge.
 * Used for merging two branches of a facet tree together.
 */
const deepMergeWithSpread = (obj1, obj2) => {
    const result = { ...obj1 };
    for (const key in obj2) {
        // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        if (obj2.hasOwnProperty(key)) {
            if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
                result[key] = deepMergeWithSpread(obj1[key], obj2[key]);
            }
            else {
                result[key] = obj2[key];
            }
        }
    }
    return result;
};
/**
 * Given an array of facet paths, removes parent facet paths so that only the
 * Leaf facets are sent with the search request.
 */
function removeSubstringMatches(arr) {
    return arr.filter((entry, index, array) => !array.some((otherEntry, otherIndex) => otherIndex !== index && otherEntry.includes(entry)));
}
/**
 * Merges a current facet tree with an incoming facet tree.
 *
 * At each branch, the incoming facet tree's facets override current facet tree
 *
 * @param currentTree
 * @param incomingTree
 */
const mergeFacetTrees = (currentTree, incomingTree) => {
    const mergedTree = structuredClone(currentTree);
    const merge = (currentBranch, nodePath) => {
        const mergedBranch = structuredClone(currentBranch);
        const incomingBranch = getFacetTreeNodeAtPath(incomingTree, nodePath);
        if (!incomingBranch) {
            return mergedBranch;
        }
        for (const nodeName of Object.keys(currentBranch.children)) {
            if (incomingBranch.children[nodeName]) {
                mergedBranch.children[nodeName] = {
                    ...deepMergeWithSpread(currentBranch.children[nodeName], incomingBranch.children[nodeName]),
                    count: mergedBranch.children[nodeName]?.count || 0,
                };
            }
            else if (mergedBranch.children[nodeName]) {
                mergedBranch.children[nodeName] = merge(mergedBranch.children[nodeName], [...nodePath, nodeName]);
            }
        }
        return mergedBranch;
    };
    return merge(mergedTree, []);
};
/**
 * A function that converts a FacetWithChidrenArray to a complete FacetTree object.
 *
 * It uses the `path` of each Facet to build the tree.
 *
 * @param facetWithChildArray
 * @param exclude - Optional array of facet values or paths to exclude from the tree.
 *                  - Values starting with "/" are treated as full paths and exclude the path and all children
 *                    (e.g., "/news" excludes "/news", "/news/local", "/news/national", etc.)
 *                  - Values without "/" are treated as segment names (e.g., "local" excludes all paths containing "local")
 */
const facetWithChildrenArrayToCompleteFacetTree = (rootArray, exclude) => {
    // 1) Start with an empty tree at root "/"
    const tree = {
        path: '/',
        count: 0,
        children: {},
    };
    // 2) Recursively collect all nodes except the implicit "/" itself
    const allFacets = [];
    const collect = (node) => {
        if (node.path !== '/') {
            allFacets.push({ path: node.path, count: node.count });
        }
        if (node.children) {
            for (const child of node.children) {
                collect(child);
            }
        }
    };
    collect(rootArray);
    // 3) Insert each flat node into our tree, creating missing ancestors
    for (const { path, count } of allFacets) {
        const segments = path.split('/').filter(Boolean); // "/sports/outdoors" -> ["sports","outdoors"]
        // Skip this facet if it matches any excluded value
        if (exclude && exclude.length > 0) {
            let shouldExclude = false;
            for (const excludeValue of exclude) {
                if (excludeValue.startsWith('/')) {
                    // Full path exclusion: prefix match (excludes the path and all children)
                    if (path === excludeValue || path.startsWith(`${excludeValue}/`)) {
                        shouldExclude = true;
                        break;
                    }
                }
                else {
                    // Segment exclusion: check if any segment matches
                    if (segments.includes(excludeValue)) {
                        shouldExclude = true;
                        break;
                    }
                }
            }
            if (shouldExclude) {
                continue;
            }
        }
        let cursor = tree; // start at the root
        for (const segment of segments) {
            // Build the full path of this level
            const prefixPath = cursor.path === '/' ? `/${segment}` : `${cursor.path}/${segment}`;
            // If this segment doesn't exist yet, create it
            if (!cursor.children[segment]) {
                cursor.children[segment] = {
                    path: prefixPath,
                    count: count,
                    children: {},
                };
            }
            // Descend to the next level deeper
            cursor = cursor.children[segment];
        }
        // 4) Now `cursor` is the node matching `path` assign its real count
        cursor.count = count;
    }
    return tree;
};

const SearchcraftFacetList = /*@__PURE__*/ proxyCustomElement(class SearchcraftFacetList extends H {
    constructor() {
        super();
        this.__registerHost();
        this.facetSelectionUpdated = createEvent(this, "facetSelectionUpdated", 7);
    }
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    /**
     * The name of the field where facets are applied.
     */
    fieldName = '';
    /**
     * Array of facet values to exclude from rendering.
     */
    exclude;
    /**
     * Emitted when the facets are updated.
     */
    facetSelectionUpdated;
    /**
     * The currently selected facet paths.
     */
    selectedPaths = {};
    /**
     * A Tree representing all of the facets collected from search responses.
     */
    facetTreeCollectedFromSearchResponse = {
        path: '/',
        count: 0,
        children: {},
    };
    /**
     * A Tree representing the facet paths that are selected, but were not included
     * in any search response.
     */
    facetTreeFromFacetPathsNotInSearchResponse = {
        path: '/',
        count: 0,
        children: {},
    };
    /**
     * The facet tree that ultimately gets rendered.
     * This is a mergin of the facetTreeCollectedFromSearchResponse and the facetTreeFromFacetPathsNotInSearchResponse tree
     */
    renderedFacetTree = {
        path: '/',
        count: 0,
        children: {},
    };
    // Internal vars used to track when to perform various facet actions.
    lastTimeTaken;
    lastSearchTerm;
    lastSearchMode;
    lastSortType;
    lastRangeValues;
    lastFacetValues;
    unsubscribe;
    cleanupCore;
    get areAnyFacetPathsSelected() {
        return Object.keys(this.selectedPaths).some((key) => this.selectedPaths[key]);
    }
    handleIncomingSearchResponse(state, actionType) {
        // Look at the incoming facet root from the search response, and convert it to a FacetTree
        const incomingFacetRoot = state.searchResponseFacetPrime?.find((facet) => this.fieldName === Object.keys(facet)[0]);
        const incomingFacetsWithChildrenArray = incomingFacetRoot?.[this.fieldName];
        const incomingFacetTree = facetWithChildrenArrayToCompleteFacetTree({
            path: '/',
            count: 0,
            children: incomingFacetsWithChildrenArray || [],
        }, this.exclude);
        // Determine what action to take to accumulate items into the `facetTreeCollectedFromSearchResponse`.
        // This facet tree gets accumulated in different ways depending on what action type occured.
        switch (actionType) {
            case 'SEARCH_TERM_EMPTY':
                this.facetTreeCollectedFromSearchResponse = {
                    path: '/',
                    count: 0,
                    children: {},
                };
                break;
            case 'NEW_SEARCH_TERM':
                this.facetTreeCollectedFromSearchResponse = incomingFacetTree;
                break;
            case 'NEW_SEARCH_TERM_WHILE_FACETS_ACTIVE':
            case 'EXACT_MATCH_UPDATE':
            case 'RANGE_VALUE_UPDATE': {
                if (state.supplementalFacetPrime) {
                    const supplementalFacetRoot = state.supplementalFacetPrime?.find((facet) => this.fieldName === Object.keys(facet)[0]);
                    const supplementalFacetsWithChildrenArray = supplementalFacetRoot?.[this.fieldName];
                    const supplementalFacetTree = facetWithChildrenArrayToCompleteFacetTree({
                        path: '/',
                        count: 0,
                        children: supplementalFacetsWithChildrenArray || [],
                    }, this.exclude);
                    this.facetTreeCollectedFromSearchResponse = mergeFacetTrees(supplementalFacetTree, incomingFacetTree);
                }
                else {
                    this.facetTreeCollectedFromSearchResponse = incomingFacetTree;
                }
                break;
            }
            case 'FACET_UPDATE':
            case 'SORT_ORDER_UPDATE':
                this.facetTreeCollectedFromSearchResponse = mergeFacetTrees(this.facetTreeCollectedFromSearchResponse, incomingFacetTree);
                break;
            default:
                return;
        }
        // Determine if there are any selected facet paths not in the current tree.
        // If there are, we add them to "facetTreeFromFacetPathsNotInSearchResponse"
        this.facetTreeFromFacetPathsNotInSearchResponse = {
            path: '/',
            count: 0,
            children: {},
        };
        const collectedFacetArray = {
            path: '/',
            count: 0,
            children: [],
        };
        for (const pathName of Object.keys(this.selectedPaths).filter((path) => this.selectedPaths[path])) {
            const nodePaths = pathName.startsWith('/')
                ? pathName.substring(1).split('/')
                : pathName.split('/');
            const wasFoundInFacetTree = !!getFacetTreeNodeAtPath(this.facetTreeCollectedFromSearchResponse, nodePaths);
            const pathKeyName = nodePaths.at(-1);
            if (!wasFoundInFacetTree && pathKeyName) {
                collectedFacetArray.children?.push({
                    children: [],
                    count: 0,
                    path: pathName,
                });
            }
        }
        this.facetTreeFromFacetPathsNotInSearchResponse =
            facetWithChildrenArrayToCompleteFacetTree(collectedFacetArray, this.exclude);
        // Merges facetTreeCollectedFromSearchResponse with selectedFacetPathsNotInCurrentFacetTree.
        // This results in a single, final facet tree that gets rendered in as Checkboxes
        this.renderedFacetTree = deepMergeWithSpread(this.facetTreeFromFacetPathsNotInSearchResponse, this.facetTreeCollectedFromSearchResponse);
    }
    handleStateUpdate(_state) {
        const state = { ..._state };
        // Determine what action to take based on the current State
        // Check if this is an initialQuery case (string requestProperties with empty searchTerm)
        const isInitialQuery = typeof state.searchClientRequestProperties === 'string' &&
            state.searchTerm.trim() === '';
        if (state.searchTerm.trim() === '' && !isInitialQuery) {
            this.handleIncomingSearchResponse(state, 'SEARCH_TERM_EMPTY');
            this.lastSearchTerm = '';
        }
        else if (this.lastTimeTaken !== state.searchResponseTimeTaken &&
            state.searchClientRequestProperties) {
            // Handle both object and string requestProperties (string is used for initialQuery)
            if (typeof state.searchClientRequestProperties === 'object') {
                const requestProperties = state.searchClientRequestProperties;
                let actionType = 'UNKNOWN';
                if (this.lastSearchTerm !== requestProperties.searchTerm) {
                    if (this.areAnyFacetPathsSelected) {
                        actionType = 'NEW_SEARCH_TERM_WHILE_FACETS_ACTIVE';
                    }
                    else {
                        actionType = 'NEW_SEARCH_TERM';
                    }
                }
                else if (this.lastRangeValues !==
                    JSON.stringify(requestProperties.rangeValueForIndexFields)) {
                    actionType = 'RANGE_VALUE_UPDATE';
                }
                else if (this.lastFacetValues !==
                    JSON.stringify(requestProperties.facetPathsForIndexFields)) {
                    actionType = 'FACET_UPDATE';
                }
                else if (this.lastSortType !== requestProperties.order_by) {
                    actionType = 'SORT_ORDER_UPDATE';
                }
                else if (this.lastSearchMode !== requestProperties.mode) {
                    actionType = 'EXACT_MATCH_UPDATE';
                }
                this.lastRangeValues = JSON.stringify(requestProperties.rangeValueForIndexFields);
                this.lastFacetValues = JSON.stringify(requestProperties.facetPathsForIndexFields);
                this.lastSortType = requestProperties.order_by;
                this.lastSearchMode = requestProperties.mode;
                this.lastSearchTerm = requestProperties.searchTerm;
                this.lastTimeTaken = state.searchResponseTimeTaken;
                // Handle the incoming response, using the action we have determined.
                this.handleIncomingSearchResponse(state, actionType);
            }
            else if (typeof state.searchClientRequestProperties === 'string') {
                // Handle initialQuery case where requestProperties is a string
                // For initialQuery, searchTerm will be empty but we still want to show facets
                let actionType = 'NEW_SEARCH_TERM';
                // Parse the request to get facet and range filters from the query array
                const requestObj = JSON.parse(state.searchClientRequestProperties);
                const queryArray = Array.isArray(requestObj.query)
                    ? requestObj.query
                    : [requestObj.query];
                // Extract filter queries (those with occur: 'must')
                const filterQueries = queryArray.filter((q) => q.occur === 'must');
                const currentFilters = JSON.stringify(filterQueries);
                // Determine the action type based on what changed
                if (this.lastFacetValues !== undefined && this.lastFacetValues !== currentFilters) {
                    // Filters have changed (not initial load)
                    actionType = 'FACET_UPDATE';
                }
                else if (state.searchTerm.trim() === '' && this.lastSearchTerm === '') {
                    // Initial load or no changes with empty search term
                    actionType = 'NEW_SEARCH_TERM';
                }
                else if (this.lastSearchTerm !== state.searchTerm) {
                    // User has typed a new search term after initialQuery
                    if (this.areAnyFacetPathsSelected) {
                        actionType = 'NEW_SEARCH_TERM_WHILE_FACETS_ACTIVE';
                    }
                    else {
                        actionType = 'NEW_SEARCH_TERM';
                    }
                }
                this.lastFacetValues = currentFilters;
                this.lastSearchTerm = state.searchTerm;
                this.lastTimeTaken = state.searchResponseTimeTaken;
                // Handle the incoming response, using the action we have determined.
                this.handleIncomingSearchResponse(state, actionType);
            }
        }
    }
    onCoreAvailable(core) {
        this.handleStateUpdate(core.store.getState());
        this.unsubscribe = core.store.subscribe((state) => {
            this.handleStateUpdate(state);
        });
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
    }
    handleCheckboxChange(path) {
        const isCheckboxChecked = !this.selectedPaths[path];
        if (isCheckboxChecked) {
            /**
             * Checkbox Checked: Add to the selectedPaths record
             * Uses spread operator here so UI updates.
             */
            this.selectedPaths = {
                ...this.selectedPaths,
                [path]: true,
            };
        }
        else {
            /**
             * Checkbox Uncheck: Remove any paths and sub-paths
             */
            const updatedPaths = Object.keys(this.selectedPaths).filter((testPath) => !testPath.includes(path));
            this.selectedPaths = updatedPaths.reduce((acc, str) => {
                acc[str] = true;
                return acc;
            }, {});
        }
        /**
         * Emit the paths array, with parent paths removed.
         */
        const paths = Object.keys(this.selectedPaths).filter((path) => this.selectedPaths[path]);
        const pathsWithParentPathsRemoved = removeSubstringMatches(paths);
        this.facetSelectionUpdated?.emit({ paths: pathsWithParentPathsRemoved });
    }
    formatFacetName = (name) => {
        const label = name.replace(/^\//, '');
        return `${label.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`;
    };
    renderFacet(keyName, facet) {
        let isChildSelected = false;
        for (const path of Object.keys(this.selectedPaths)) {
            if (this.selectedPaths[path] &&
                path.startsWith(facet.path) &&
                path.length > facet.path.length) {
                isChildSelected = true;
            }
        }
        const isSelected = Object.keys(this.selectedPaths).includes(facet.path);
        const shouldRenderChildren = (Object.keys(facet.children).length > 0 &&
            (isSelected || isChildSelected)) ||
            keyName === '@@root';
        return (h("div", { class: 'searchcraft-facet-list-item' }, keyName !== '@@root' && (h("label", { class: 'searchcraft-facet-list-checkbox-label' }, h("div", { class: 'searchcraft-facet-list-checkbox-input-wrapper' }, h("input", { class: 'searchcraft-facet-list-checkbox-input', checked: this.selectedPaths[facet.path], onChange: (_event) => {
                this.handleCheckboxChange(facet.path);
            }, type: 'checkbox' }), isChildSelected ? (h("div", { class: 'searchcraft-facet-list-checkbox-input-dash-icon' }, h("svg", { viewBox: '0 0 14 3', fill: 'none' }, h("title", null, "Checkbox dash"), h("line", { x1: '1.5', y1: '1.5', x2: '12.5', y2: '1.5', stroke: 'white', "stroke-width": '3', "stroke-linecap": 'round' })))) : (h("div", { class: 'searchcraft-facet-list-checkbox-input-check-icon' }, h("svg", { width: '16', height: '16', viewBox: '0 0 16 16', fill: 'none' }, h("title", null, "Checkbox check"), h("path", { d: 'M13.9999 2L5.74988 10L1.99988 6.36364', stroke: 'white', "stroke-width": '3', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))))), h("span", null, this.formatFacetName(keyName), " (", facet.count, ")"))), shouldRenderChildren && (h("div", { class: 'searchcraft-facet-list', style: {
                paddingLeft: keyName !== '@@root' ? '24px' : '0px',
                paddingTop: keyName !== '@@root' ? '6px' : '0px',
            } }, Object.keys(facet.children).map((key) => {
            if (facet.children[key]) {
                return this.renderFacet(key, facet.children[key]);
            }
        })))));
    }
    render() {
        if (!this.fieldName) {
            return;
        }
        if (Object.keys(this.facetTreeCollectedFromSearchResponse.children).length ===
            0 &&
            (this.lastSearchTerm || '').trim().length === 0) {
            return;
        }
        if (Object.keys(this.facetTreeCollectedFromSearchResponse.children).length ===
            0 &&
            (this.lastSearchTerm || '').trim().length > 0) {
            return (h("p", { class: 'searchcraft-facet-list-message' }, "No facets are available for this search query."));
        }
        return (h("div", { class: 'searchcraft-facet-list' }, this.renderFacet('@@root', this.renderedFacetTree)));
    }
}, [0, "searchcraft-facet-list", {
        "searchcraftId": [1, "searchcraft-id"],
        "fieldName": [1, "field-name"],
        "exclude": [16],
        "selectedPaths": [32],
        "facetTreeCollectedFromSearchResponse": [32],
        "renderedFacetTree": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-facet-list"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-facet-list":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftFacetList);
            }
            break;
    } });
}

export { SearchcraftFacetList as S, defineCustomElement as d };

//# sourceMappingURL=p-e8d97093.js.map