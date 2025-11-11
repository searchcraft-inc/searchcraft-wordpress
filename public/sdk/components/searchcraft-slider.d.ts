import type { Components, JSX } from "../types/components";

interface SearchcraftSlider extends Components.SearchcraftSlider, HTMLElement {}
export const SearchcraftSlider: {
    prototype: SearchcraftSlider;
    new (): SearchcraftSlider;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
