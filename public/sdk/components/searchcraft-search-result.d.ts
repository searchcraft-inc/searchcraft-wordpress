import type { Components, JSX } from "../types/components";

interface SearchcraftSearchResult extends Components.SearchcraftSearchResult, HTMLElement {}
export const SearchcraftSearchResult: {
    prototype: SearchcraftSearchResult;
    new (): SearchcraftSearchResult;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
