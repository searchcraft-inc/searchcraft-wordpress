import type { FacetTree, FacetWithChildrenArray, FacetWithChildrenObject } from "../types/index";
/**
 * Helper function for getting a Node (FacetWithChildrenObject)
 * at a given path. Traverses the node tree to get the node.
 */
export declare const getFacetTreeNodeAtPath: (tree: FacetTree, nodePaths: string[]) => FacetWithChildrenObject | undefined;
/**
 * Helper function to perform a deep merge.
 * Used for merging two branches of a facet tree together.
 */
export declare const deepMergeWithSpread: (obj1: any, obj2: any) => any;
/**
 * Given an array of facet paths, removes parent facet paths so that only the
 * Leaf facets are sent with the search request.
 */
export declare function removeSubstringMatches(arr: string[]): string[];
/**
 * Merges a current facet tree with an incoming facet tree.
 *
 * At each branch, the incoming facet tree's facets override current facet tree
 *
 * @param currentTree
 * @param incomingTree
 */
export declare const mergeFacetTrees: (currentTree: FacetTree, incomingTree: FacetTree) => FacetTree;
/**
 * A function that converts a FacetWithChidrenArray to a complete FacetTree object.
 *
 * It uses the `path` of each Facet to build the tree.
 *
 * @param facetWithChildArray
 */
export declare const facetWithChildrenArrayToCompleteFacetTree: (rootArray: FacetWithChildrenArray) => FacetTree;
//# sourceMappingURL=facets.d.ts.map