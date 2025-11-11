import type { Components, JSX } from "../types/components";

interface SearchcraftLoading extends Components.SearchcraftLoading, HTMLElement {}
export const SearchcraftLoading: {
    prototype: SearchcraftLoading;
    new (): SearchcraftLoading;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
