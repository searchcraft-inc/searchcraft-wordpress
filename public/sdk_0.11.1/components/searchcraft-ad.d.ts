import type { Components, JSX } from "../types/components";

interface SearchcraftAd extends Components.SearchcraftAd, HTMLElement {}
export const SearchcraftAd: {
    prototype: SearchcraftAd;
    new (): SearchcraftAd;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
