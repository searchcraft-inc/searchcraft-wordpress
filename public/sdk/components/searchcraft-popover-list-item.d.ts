import type { Components, JSX } from "../types/components";

interface SearchcraftPopoverListItem extends Components.SearchcraftPopoverListItem, HTMLElement {}
export const SearchcraftPopoverListItem: {
    prototype: SearchcraftPopoverListItem;
    new (): SearchcraftPopoverListItem;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
