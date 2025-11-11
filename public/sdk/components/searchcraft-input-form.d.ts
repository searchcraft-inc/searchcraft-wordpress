import type { Components, JSX } from "../types/components";

interface SearchcraftInputForm extends Components.SearchcraftInputForm, HTMLElement {}
export const SearchcraftInputForm: {
    prototype: SearchcraftInputForm;
    new (): SearchcraftInputForm;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
