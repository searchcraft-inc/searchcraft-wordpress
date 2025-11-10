import { p as proxyCustomElement, H, c as createEvent, h } from './p-5365011f.js';
import { c as classNames } from './p-5cdc6210.js';
import { r as registry } from './p-e30203b1.js';
import { d as defineCustomElement$3 } from './p-acf23bab.js';
import { d as defineCustomElement$2 } from './p-f2585cdf.js';
import { d as defineCustomElement$1 } from './p-1adf78b9.js';

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
        return (h("form", { key: 'd214ace44e9209154d215e803de088aefa58a285', class: 'searchcraft-input-form', onSubmit: this.handleFormSubmit }, h("div", { key: '5699f5dca28caf5e9584401f1883d2e08d26e3ec', class: inputGridClassNames, style: inputGridStyles }, h("div", { key: 'ef792a946414a680e9c99c145246d00b9b8f2ffb', class: 'searchcraft-input-form-button' }, h("searchcraft-button", { key: 'ba5a8cb98889bb486781af4915a21c94a0b1498a', onButtonClick: this.handleFormSubmit, label: this.buttonLabel })), this.inputLabel && (h("div", { key: 'a9e770ef967f7ab1c6ddf8f87f23cea509894536', class: 'searchcraft-input-form-label' }, h("searchcraft-input-label", { key: '93b29e630e71a3c7724921aa9586aab76e592f4f', label: this.inputLabel }))), this.error && (h("div", { key: '641ef4f468d527c24a1635d49dcbbba03030686f', class: 'searchcraft-input-form-error-message' }, h("searchcraft-error-message", { key: '2d839d17b702fe1b41d7e49aacfc52fb53315766' }, "Something went wrong."))), h("div", { key: 'af0c73478de21447c992bd0037ba007d54f53a86', class: 'searchcraft-input-form-input-wrapper' }, h("input", { key: '3de1be1aa71c143b58cd6080d422410bd400e4e5', autoComplete: 'off', class: classNames('searchcraft-input-form-input', {
                'searchcraft-placeholder-hide-on-focus': this.placeholderBehavior === 'hide-on-focus',
            }), onFocus: () => this.inputFocus?.emit(), onBlur: () => this.inputBlur?.emit(), onInput: (event) => {
                this.handleInput(event);
            }, placeholder: this.placeholderValue, type: 'text', value: this.inputValue }), h("div", { key: 'fe9043c046e3b1b91129299f0860919ba8a8416b', class: 'searchcraft-input-form-input-icon' }, h("svg", { key: '31ae1553cd214d5e2f97c9e3699862dff51a0916', class: 'searchcraft-input-form-input-search-icon', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', "aria-labelledby": 'searchcraft-title' }, h("title", { key: '9db677da65283ff15b0d4e79b5d9daf89637b33f' }, "Search icon"), h("path", { key: '2a002eae6ed3725a432e7c3e4649c0bd2ffff7a0', d: 'M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))), isShowingClearButton && (h("button", { key: 'b7e92b22c3234eb31d85b0aa98d7c682b2fc0021', type: 'button', class: 'searchcraft-input-form-clear-button', onClick: this.handleClearInput }, h("svg", { key: 'bfbeb742f197da0cac6dd5df2627db9df5349207', class: 'searchcraft-input-form-clear-icon', viewBox: '0 0 22 22', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', "aria-labelledby": 'icon-title' }, h("title", { key: 'c62b9d237b3762609fed72e0520322fb5eabe979' }, "Clear icon"), h("path", { key: '198a13760ce8b076ef8e791dec933b210ff3017a', d: 'M14 8L8 14M8 8L14 14M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))))))));
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

//# sourceMappingURL=p-870f81fd.js.map