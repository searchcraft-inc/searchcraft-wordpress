import type { Components, JSX } from "../types/components";

interface SearchcraftSearchResults extends Components.SearchcraftSearchResults, HTMLElement {}
export const SearchcraftSearchResults: {
    prototype: SearchcraftSearchResults;
    new (): SearchcraftSearchResults;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
