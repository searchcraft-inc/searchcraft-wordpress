export type Facet = {
    /**
     * The path of the facet. The path represents where in the facet tree structure
     * this facet exists. There is an arbitrary number of levels in a facet tree.
     *
     * @example
     *
     * '/sports/college' - Represents that this is the facet node exists at [root] -> [sports] -> [college] in the facet tree.
     * '/weather' - Represents that this facet exists at [root] -> [weather] in the facet tree
     * '/news/local' - [root] -> [news] -> [local]
     */
    path: string;
    /**
     * The count value just represents an arbitrary `count` metadata for this facet node.
     */
    count: number;
};
export type FacetWithChildrenArray = Facet & {
    children: FacetWithChildrenArray[] | null | undefined;
};
export type FacetWithChildrenObject = Facet & {
    children: Record<string, FacetWithChildrenObject>;
};
/**
 * A Facet object returned in a search response.
 */
export type FacetRoot = {
    [key: string]: FacetWithChildrenArray[];
};
export type FacetPrime = FacetRoot[];
/**
 * A structured Facet tree.
 *
 * A Facet tree is the root node of a "complete view" of the facet node tree.
 * Nodes are structured based on the `path` of each facet
 *
 */
export type FacetTree = FacetWithChildrenObject;
//# sourceMappingURL=Facets.types.d.ts.map