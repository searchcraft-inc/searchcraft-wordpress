import type { Components, JSX } from "../types/components";

interface SearchcraftSelect extends Components.SearchcraftSelect, HTMLElement {}
export const SearchcraftSelect: {
    prototype: SearchcraftSelect;
    new (): SearchcraftSelect;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
