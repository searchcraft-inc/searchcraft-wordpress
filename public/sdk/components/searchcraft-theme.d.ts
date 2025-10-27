import type { Components, JSX } from "../types/components";

interface SearchcraftTheme extends Components.SearchcraftTheme, HTMLElement {}
export const SearchcraftTheme: {
    prototype: SearchcraftTheme;
    new (): SearchcraftTheme;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
