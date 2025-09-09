import type { Components, JSX } from "../types/components";

interface SearchcraftToggleButton extends Components.SearchcraftToggleButton, HTMLElement {}
export const SearchcraftToggleButton: {
    prototype: SearchcraftToggleButton;
    new (): SearchcraftToggleButton;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
