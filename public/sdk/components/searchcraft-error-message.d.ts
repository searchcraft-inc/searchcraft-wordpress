import type { Components, JSX } from "../types/components";

interface SearchcraftErrorMessage extends Components.SearchcraftErrorMessage, HTMLElement {}
export const SearchcraftErrorMessage: {
    prototype: SearchcraftErrorMessage;
    new (): SearchcraftErrorMessage;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
