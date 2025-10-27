import type { Components, JSX } from "../types/components";

interface SearchcraftPagination extends Components.SearchcraftPagination, HTMLElement {}
export const SearchcraftPagination: {
    prototype: SearchcraftPagination;
    new (): SearchcraftPagination;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
