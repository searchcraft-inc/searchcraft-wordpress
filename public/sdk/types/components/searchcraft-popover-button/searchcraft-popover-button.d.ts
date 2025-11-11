import type { SearchcraftCore } from "../../classes/index";
import type { PopoverButtonTemplate } from "../../types/index";
/**
 * Renders a button which, when clicked, turns on popover visibility.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftPopoverButton } from "@searchcraft/react-sdk";
 * ````
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftPopoverButton } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <!-- index.html -->
 * <searchcraft-popover-button>
 *   Open popover
 * </searchcraft-popover-button>
 * ```
 *
 * ```js
 * // index.js
 * const popoverButton = document.querySelector('searchcraft-popover-button');
 *
 * popoverButton.template = ({ isPopoverVisible }, { html }) => html`
 *   <span>Click me</span>
 * `;
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftPopoverButton
 *   template={({ isPopoverVisible }, { html }) => html`
 *     <span>Click me</span>
 *   `}
 * >
 *   Open popover
 * </SearchcraftPopoverButton>
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftPopoverButton
 *   :template={({ isPopoverVisible }, { html }) => html`
 *     <span>Click me</span>
 *   `}
 * >
 *   Open popover
 * </SearchcraftPopoverButton>
 * ```
 */
export declare class SearchcraftPopoverButton {
    /**
     * A callback function responsible for rendering the button contents.
     */
    template?: PopoverButtonTemplate;
    /**
     * The type of popover button to render.
     */
    type?: 'skeuomorphic';
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    hotkey: any;
    hotkeyModifier: any;
    hotkeyModifierSymbol: any;
    isPopoverVisible: any;
    userAgent: any;
    private unsubscribe;
    private cleanupCore?;
    private core?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    handleOnClick(): void;
    disconnectedCallback(): void;
    setUserAgent(): "window" | "mac" | "other";
    renderOptionSymbol: () => any;
    renderCtrlSymbol: () => any;
    renderWindowsMetaSymbol: () => any;
    renderMacMetaSymbol: () => any;
    setHotkeyModifierSymbol(): any;
    renderSkeuomorphicSlot(): any;
    renderSlot(): any;
    render(): any;
}
//# sourceMappingURL=searchcraft-popover-button.d.ts.map