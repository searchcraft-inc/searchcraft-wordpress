import type { SearchcraftCore } from "../../classes/index";
import type { AdClientResponseItem, PopoverNoResultsTemplate, PopoverResultMappings, SearchClientResponseItem, SearchResultTemplate, SearchResultTemplateData } from "../../types/index";
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
 *
 * // Or render each result with a template instead of `popoverResultMappings`.
 * popoverForm.template = (item, index, { html, safeUrl }) => html`
 *  <a href="${safeUrl(item.url)}">${item.title}</a>
 * `;
 *
 * // Change the message shown when a search returns no results.
 * popoverForm.noResultsTemplate = ({ searchTerm }, { html }) => html`
 *  <p>Nothing matched "${searchTerm}".</p>
 * `;
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
     * A callback function responsible for rendering a result. When provided, it is used instead of `popoverResultMappings`.
     * Pass URLs from the result through the `safeUrl` helper before placing them in an `href` or `src`.
     * Never place result values in event handler attributes such as `onclick`, or in `style`.
     */
    template?: SearchResultTemplate<SearchResultTemplateData>;
    /**
     * A callback function responsible for rendering the message shown when a search returns no results.
     * When it is not provided, the popover shows `No results found for "<search term>".`
     * The returned markup is sanitized with DOMPurify, which removes scripts, event handler
     * attributes such as `onclick`, and links with schemes it does not allow, such as an app's own scheme.
     */
    noResultsTemplate?: PopoverNoResultsTemplate;
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
    /**
     * Base URL for the "View all" footer link. The current search term will be appended (URL encoded).
     *
     * For example, in a CMS-backed site you might set this to `/?s=` so the final URL becomes `/?s=<search-term>`.
     */
    viewAllResultsBaseUrl?: string;
    /**
     * Optional label for the "View All" footer button. Defaults to "View All".
     */
    viewAllResultsLabel?: string;
    /**
     * Whether to display the AI generative summary box before the search results.
     * NOTE: This requires the usage of a read key that has "SUMMARY" permissions and either a subscription to Searchcraft Cloud with AI features enabled or a self-hosted model connected.
     */
    showSummaryBox?: boolean;
    /**
     * The SDK variant used to render this component. Used for UTM attribution on the footer link.
     *
     * @internal
     */
    sdkVariant?: 'js' | 'react' | 'vue';
    isPopoverVisibleInState: boolean;
    searchClientResponseItems: SearchClientResponseItem[];
    adClientResponseItems: AdClientResponseItem[];
    searchTerm: string | undefined;
    isSearchInProgress: boolean;
    /**
     * The search term of the most recent search response.
     */
    completedSearchTerm: string | undefined;
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
    /**
     * Passes result rendering changes on to the fullscreen form created for small viewports,
     * which only receives these props when it is first created.
     */
    syncModalElementResultRendering(): void;
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
    /**
     * Whether the search for the current search term finished without results.
     */
    get hasNoResultsToShow(): boolean;
    renderNoResults(): any;
    get viewAllResultsHref(): string | undefined;
    get resolvedViewAllResultsLabel(): string;
    navigateToViewAllResults(): void;
    renderInlinePopover(): any;
    renderModalPopover(): any;
    renderFullscreenPopover(): any;
    render(): any;
}
//# sourceMappingURL=searchcraft-popover-form.d.ts.map