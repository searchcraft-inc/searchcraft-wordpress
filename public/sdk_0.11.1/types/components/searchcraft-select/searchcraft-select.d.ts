import { type EventEmitter } from '../../stencil-public-runtime';
export type SearchcraftSelectOption = {
    label: string;
    value: string | number;
    selected?: boolean;
};
/**
 * This web component is designed to allow users to select between a group of options.
 *
 * @js-example
 * ```html
 * <!-- index.html -->
 * <searchcraft-select
 *  inputId="searchcraft-select"
 *  name="searchcraft-select"
 *  options="[{ label: 'label', value: 'value' }]"
 * />
 * ```
 *
 * @internal
 */
export declare class SearchcraftSelect {
    /**
     * The caption displayed below the select input.
     */
    caption?: string;
    /**
     * Whether the select input is disabled.
     */
    disabled?: boolean;
    /**
     * The ID for the select input.
     */
    inputId: string;
    /**
     * The label of the select input.
     */
    label?: string;
    /**
     * The ID for the label of the select input.
     */
    labelId?: string;
    /**
     * The name of the select input.
     */
    name: string;
    /**
     * The options for the select input.
     */
    options: SearchcraftSelectOption[] | string;
    /**
     * The event fired when the select is changed.
     */
    selectChange: EventEmitter<string>;
    searchResultsPerPage: any;
    setSearchResultsPage: (page: number) => void;
    setSearchResultsPerPage: (perPage: number) => void;
    private handleSelectChange;
    handleGoToPage(page: number): void;
    render(): any;
}
//# sourceMappingURL=searchcraft-select.d.ts.map