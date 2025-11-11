import type { Components, JSX } from "../types/components";

interface SearchcraftSummaryBox extends Components.SearchcraftSummaryBox, HTMLElement {}
export const SearchcraftSummaryBox: {
    prototype: SearchcraftSummaryBox;
    new (): SearchcraftSummaryBox;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
