import type { Components, JSX } from "../types/components";

interface SearchcraftFacetList extends Components.SearchcraftFacetList, HTMLElement {}
export const SearchcraftFacetList: {
    prototype: SearchcraftFacetList;
    new (): SearchcraftFacetList;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
