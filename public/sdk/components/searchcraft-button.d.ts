import type { Components, JSX } from "../types/components";

interface SearchcraftButton extends Components.SearchcraftButton, HTMLElement {}
export const SearchcraftButton: {
    prototype: SearchcraftButton;
    new (): SearchcraftButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
