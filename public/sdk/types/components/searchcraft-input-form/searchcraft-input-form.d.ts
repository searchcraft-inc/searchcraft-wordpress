import { type EventEmitter } from '../../stencil-public-runtime';
import type { SearchcraftCore } from "../../classes/index";
/**
 * This web component provides a user-friendly interface for querying an indexed dataset, enabling users to easily search large collections of data.
 * It abstracts the complexities of index-based searching, making it accessible to users of all technical levels.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftInputForm } from "@searchcraft/react-sdk";
 * ```
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftInputForm } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <searchcraft-input-form auto-search />
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftInputForm autoSearch />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftInputForm autoSearch />
 * ```
 */
export declare class SearchcraftInputForm {
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    /**
     * Whether or not to automatically submit the search term when the input changes.
     */
    autoSearch?: boolean;
    /**
     * Where to place the search button.
     */
    buttonPlacement?: 'left' | 'right' | 'none';
    /**
     * The label for the submit button.
     */
    buttonLabel?: string;
    /**
     * The label rendered above the input.
     */
    inputLabel?: string;
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
     * The value to display in the input field.
     */
    value?: string;
    /**
     * When the input becomes focused.
     */
    inputFocus?: EventEmitter<void>;
    /**
     * When the input becomes unfocused.
     */
    inputBlur?: EventEmitter<void>;
    /**
     * Event emitted when input initializes.
     */
    inputInit?: EventEmitter<void>;
    inputValue: string;
    searchTerm: string;
    error: boolean;
    private core?;
    private unsubscribe?;
    private cleanupCore?;
    init(): void;
    onCoreChange(): void;
    onValueChange(newValue: string | undefined): void;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleInput: (event: Event) => void;
    private performSearch;
    handleClearInput: () => void;
    handleFormSubmit: (event: Event) => Promise<void>;
    render(): any;
}
//# sourceMappingURL=searchcraft-input-form.d.ts.map