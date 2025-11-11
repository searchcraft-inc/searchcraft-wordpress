import type { Components, JSX } from "../types/components";

interface SearchcraftResultsInfo extends Components.SearchcraftResultsInfo, HTMLElement {}
export const SearchcraftResultsInfo: {
    prototype: SearchcraftResultsInfo;
    new (): SearchcraftResultsInfo;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
