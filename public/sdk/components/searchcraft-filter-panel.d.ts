import type { Components, JSX } from "../types/components";

interface SearchcraftFilterPanel extends Components.SearchcraftFilterPanel, HTMLElement {}
export const SearchcraftFilterPanel: {
    prototype: SearchcraftFilterPanel;
    new (): SearchcraftFilterPanel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
