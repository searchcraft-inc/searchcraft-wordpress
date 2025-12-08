import type { SearchcraftCore } from "../../classes/index";
import type { AdClientResponseItem, PopoverResultMappings, SearchClientResponseItem } from "../../types/index";
/**
 * This web component is designed to display search results in a popover container that dynamically appears when the user interacts with a search input field, or when a popover-button is pressed.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftPopoverForm } from "@searchcraft/react-sdk";
 * ```
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftPopoverForm } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <!-- index.html -->
 * <searchcraft-popover-form type="inline" />
 * ```
 *
 * ```js
 * // index.js
 * const popoverForm = document.querySelector('searchcraft-popover-form');
 *
 * popoverForm.popoverResultMappings = {};
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftPopoverForm type="inline" popoverResultMappings={[]} />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftPopoverForm type="inline" :popoverResultMappings="[]"" />
 * ```
 *
 */
export declare class SearchcraftPopoverForm {
    /**
     * The type of popover form to render.
     * - `inline` - Renders inline with the rest of the content on the page. The search results pop over the page content.
     * - `fullscreen` - Renders in fullscreen view. Used together with the `searchcraft-popover-button` component.
     * - `modal` - Renders in a modal view. Used together with the `searchcraft-popover-button` component.
     */
    type?: 'inline' | 'fullscreen' | 'modal';
    /**
     * Formats the content rendered for each result.
     */
    popoverResultMappings?: PopoverResultMappings;
    /**
     * The hotkey that activates the popover.
     */
    hotkey?: string;
    /**
     * The hotkey modifier that activates the popover. Used together with the `hotkey` prop.
     */
    hotkeyModifier?: 'ctrl' | 'meta' | 'alt' | 'option';
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    /**
     * The input element's placeholder value.
     */
    placeholderValue?: string;
    /**
     * The placeholder's render behavior.
     * 'hide-on-focus' - Hide the placeholder text immediately when the input form gains focus.
     * 'hide-on-text-entered' - Only hide the placeholder when the input form has text entered into it.
     */
    placeholderBehavior?: 'hide-on-focus' | 'hide-on-text-entered';
    isPopoverVisibleInState: boolean;
    searchClientResponseItems: SearchClientResponseItem[];
    adClientResponseItems: AdClientResponseItem[];
    searchTerm: string | undefined;
    isFocused: boolean;
    breakpointSm: number;
    breakpointMd: number;
    breakpointLg: number;
    searchResultsPage: any;
    searchResultsPerPage: any;
    modalElement: any;
    hostElement: HTMLElement;
    private unsubscribe;
    private cleanupCore?;
    core?: SearchcraftCore;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleDocumentClick: (event: MouseEvent) => void;
    /**
     * Handles when popover visibility is changed in state
     */
    handlePopoverVisibilityChange(isVisible: boolean): void;
    /**
     * Actions to perform when various keys are pressed within the popover form.
     */
    handleDocumentKeyDown: (event: KeyboardEvent) => void;
    handleInputInit: () => void;
    /**
     * When popover is `inline` and the viewport is at the smallest breakpoint,
     * focusing on the input will open a modal version of the popover form.
     */
    handleInputFocus(): void;
    handleModalBackdropClick(_event: MouseEvent): void;
    /**
     * When a hotkey is pressed, tests if the modifiers also match.
     * If modifiers match, toggles visibility of the popover modal.
     */
    handleHotkeyPressed(event: KeyboardEvent): void;
    handleCancelButtonClick(): void;
    /**
     * Moves focus to the next/previous list item in the list view. If you are at the top
     * of the list view, it moves focus back to the input.
     *
     * @param direction
     */
    focusOnNextListItem(direction: 'ArrowDown' | 'ArrowUp'): void;
    get hasResultsToShow(): boolean | "" | undefined;
    renderInlinePopover(): any;
    renderModalPopover(): any;
    renderFullscreenPopover(): any;
    render(): any;
}
//# sourceMappingURL=searchcraft-popover-form.d.ts.map