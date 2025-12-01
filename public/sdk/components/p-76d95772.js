import { p as proxyCustomElement, H, c as createEvent, h } from './p-5365011f.js';
import { c as classNames } from './p-5cdc6210.js';
import { r as registry } from './p-e30203b1.js';
import { d as defineCustomElement$3 } from './p-acf23bab.js';
import { d as defineCustomElement$2 } from './p-f2585cdf.js';
import { d as defineCustomElement$1 } from './p-fa799946.js';

const SearchcraftInputForm = /*@__PURE__*/ proxyCustomElement(class SearchcraftInputForm extends H {
    constructor() {
        super();
        this.__registerHost();
        this.inputFocus = createEvent(this, "inputFocus", 7);
        this.inputBlur = createEvent(this, "inputBlur", 7);
        this.inputInit = createEvent(this, "inputInit", 7);
    }
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    /**
     * Whether or not to automatically submit the search term when the input changes.
     */
    autoSearch = true;
    /**
     * Where to place the search button.
     */
    buttonPlacement = 'none';
    /**
     * The label for the submit button.
     */
    buttonLabel;
    /**
     * The label rendered above the input.
     */
    inputLabel;
    /**
     * The input element's placeholder value.
     */
    placeholderValue = 'Enter Search';
    /**
     * The placeholder's render behavior.
     * 'hide-on-focus' - Hide the placeholder text immediately when the input form gains focus.
     * 'hide-on-text-entered' - Only hide the placeholder when the input form has text entered into it.
     */
    placeholderBehavior;
    /**
     * The value to display in the input field.
     */
    value;
    /**
     * When the input becomes focused.
     */
    inputFocus;
    /**
     * When the input becomes unfocused.
     */
    inputBlur;
    /**
     * Event emitted when input initializes.
     */
    inputInit;
    inputValue = '';
    searchTerm = '';
    error = false;
    core;
    unsubscribe;
    cleanupCore;
    init() {
        if (this.core) {
            // Initialize inputValue from prop if provided
            if (this.value !== undefined && this.value.trim().length > 0) {
                this.inputValue = this.value;
                this.core.store.getState().setSearchTerm(this.value);
                // Trigger search if autoSearch is enabled
                if (this.autoSearch) {
                    this.core.store.getState().search();
                }
            }
            this.inputInit?.emit();
        }
    }
    onCoreChange() {
        this.init();
    }
    onValueChange(newValue) {
        if (newValue !== undefined && newValue !== this.inputValue) {
            this.inputValue = newValue;
            this.core?.store.getState().setSearchTerm(newValue);
            // Trigger search if autoSearch is enabled and value is not empty
            if (this.autoSearch && newValue.trim().length > 0) {
                this.core?.store.getState().search();
            }
        }
    }
    onCoreAvailable(core) {
        this.core = core;
        this.init();
        this.unsubscribe = core.store.subscribe((state) => {
            this.searchTerm = state.searchTerm;
            // Only update inputValue from store if value prop is not set
            // OR if the store was cleared (empty string)
            if (this.value === undefined || state.searchTerm === '') {
                this.inputValue = state.searchTerm;
            }
        });
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
    }
    handleInput = (event) => {
        const input = event.target;
        this.inputValue = input.value;
        this.core?.store.getState().setSearchTerm(input.value);
        if (!this.autoSearch) {
            return;
        }
        this.performSearch();
    };
    performSearch = async () => {
        this.error = false;
        try {
            await this.core?.store.getState().search();
        }
        catch (error) {
            this.error = true;
        }
    };
    handleClearInput = () => {
        // Clear the input value even if controlled by prop
        this.inputValue = '';
        this.core?.store.getState().resetSearchValues();
        this.error = false;
    };
    handleFormSubmit = async (event) => {
        event.preventDefault();
        await this.performSearch();
    };
    render() {
        const isShowingClearButton = this.inputValue.length > 0;
        const inputGridClassNames = classNames('searchcraft-input-form-grid', {
            'searchcraft-input-form-grid-button-left': this.buttonPlacement === 'left',
            'searchcraft-input-form-grid-button-right': this.buttonPlacement === 'right',
            'searchcraft-input-form-grid-button-none': this.buttonPlacement === 'none',
        });
        const shouldHaveVerticalGap = this.inputLabel || this.error;
        const inputGridStyles = {
            gap: shouldHaveVerticalGap ? '4px 8px' : '0px 8px',
        };
        return (h("form", { key: '8ba91615394f95c0d5bd26a3006d3e8b454f047e', class: 'searchcraft-input-form', onSubmit: this.handleFormSubmit }, h("div", { key: 'd9025a1c041e3132280b22e5a1b039df0196cea5', class: inputGridClassNames, style: inputGridStyles }, h("div", { key: 'a8c3a80a0ccb718f974902fb1d163d5c3ee6194a', class: 'searchcraft-input-form-button' }, h("searchcraft-button", { key: 'a12ff9a8cdb9a4ce3c3fd54b1c2ae084edd37069', onButtonClick: this.handleFormSubmit, label: this.buttonLabel })), this.inputLabel && (h("div", { key: '866e7162c402524eaca864bb6e950a244245dc48', class: 'searchcraft-input-form-label' }, h("searchcraft-input-label", { key: 'c57217cd5924c827df08e22a728067e3bfc63a26', label: this.inputLabel }))), this.error && (h("div", { key: '4a54728bf366db50de39470cf31860a6307dafea', class: 'searchcraft-input-form-error-message' }, h("searchcraft-error-message", { key: '5fa5b5f5677350338d15c8e6614b0d9f584141b0' }, "Something went wrong."))), h("div", { key: '67be766103a3bca11cff6f83a2a6dea7c6c6f106', class: 'searchcraft-input-form-input-wrapper' }, h("input", { key: '931609a4e8fc55d688077ec6cb04f2bb9b86b5fe', autoComplete: 'off', class: classNames('searchcraft-input-form-input', {
                'searchcraft-placeholder-hide-on-focus': this.placeholderBehavior === 'hide-on-focus',
            }), onFocus: () => this.inputFocus?.emit(), onBlur: () => this.inputBlur?.emit(), onInput: (event) => {
                this.handleInput(event);
            }, placeholder: this.placeholderValue, type: 'text', value: this.inputValue }), h("div", { key: '7feb32348b7faec4104137a142ba8150149498a5', class: 'searchcraft-input-form-input-icon' }, h("svg", { key: '8b9abd236d4896b8dbd5c14e06019c116e3675be', class: 'searchcraft-input-form-input-search-icon', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', "aria-labelledby": 'searchcraft-title' }, h("title", { key: '4d3b6724f6532920f5531d2e15b28a06f0770688' }, "Search icon"), h("path", { key: '65a46a1916c1f020c9bebffd42aa016b59177376', d: 'M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))), isShowingClearButton && (h("button", { key: '65278eb0ab49415dce79c874adf90adcb5854db5', type: 'button', class: 'searchcraft-input-form-clear-button', onClick: this.handleClearInput }, h("svg", { key: '0016263afe32250ace58cc4b98ff6106d7d9d4a0', class: 'searchcraft-input-form-clear-icon', viewBox: '0 0 22 22', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', "aria-labelledby": 'icon-title' }, h("title", { key: '9b40d806455ab9c19c0cddb4c76101debdb0266c' }, "Clear icon"), h("path", { key: '2954ee1496d6736d6e780755034902c76adb81e9', d: 'M14 8L8 14M8 8L14 14M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))))))));
    }
    static get watchers() { return {
        "core": ["onCoreChange"],
        "value": ["onValueChange"]
    }; }
}, [0, "searchcraft-input-form", {
        "searchcraftId": [1, "searchcraft-id"],
        "autoSearch": [4, "auto-search"],
        "buttonPlacement": [1, "button-placement"],
        "buttonLabel": [1, "button-label"],
        "inputLabel": [1, "input-label"],
        "placeholderValue": [1, "placeholder-value"],
        "placeholderBehavior": [1, "placeholder-behavior"],
        "value": [1],
        "inputValue": [32],
        "searchTerm": [32],
        "error": [32]
    }, undefined, {
        "core": ["onCoreChange"],
        "value": ["onValueChange"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-input-form", "searchcraft-button", "searchcraft-error-message", "searchcraft-input-label"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-input-form":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftInputForm);
            }
            break;
        case "searchcraft-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "searchcraft-error-message":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
        case "searchcraft-input-label":
            if (!customElements.get(tagName)) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { SearchcraftInputForm as S, defineCustomElement as d };

//# sourceMappingURL=p-76d95772.js.map