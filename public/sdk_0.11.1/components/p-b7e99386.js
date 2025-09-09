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
            this.inputInit?.emit();
        }
    }
    onCoreChange() {
        this.init();
    }
    onCoreAvailable(core) {
        this.core = core;
        this.init();
        this.unsubscribe = core.store.subscribe((state) => {
            this.searchTerm = state.searchTerm;
            this.inputValue = state.searchTerm;
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
        return (h("form", { key: 'c1eea324038f640a9075d5714378d5c4b97168e0', class: 'searchcraft-input-form', onSubmit: this.handleFormSubmit }, h("div", { key: 'f157c00510e5c3e75dd703996be24de5e97bbcd9', class: inputGridClassNames, style: inputGridStyles }, h("div", { key: 'c97f3e5ef9ed6aee103dedc76b3ee1620b69ebba', class: 'searchcraft-input-form-button' }, h("searchcraft-button", { key: '4bb5dfea8b9f8f2f0a7e5fc5c1b199ef9d209278', onButtonClick: this.handleFormSubmit, label: this.buttonLabel })), this.inputLabel && (h("div", { key: 'aa8beca21ce414d645687ee73b7ca29c740438a2', class: 'searchcraft-input-form-label' }, h("searchcraft-input-label", { key: '8c15364abcf2e43354b445be6c7ceb9387ea4a67', label: this.inputLabel }))), this.error && (h("div", { key: '5987b6da22a25da50613ceb277bfe44b31ba8f37', class: 'searchcraft-input-form-error-message' }, h("searchcraft-error-message", { key: 'f2a230f0cf3cf0bbaddbb37ef2f38afdf73b28f6' }, "Something went wrong."))), h("div", { key: 'a0862217135ac6f9a96d9e64e6fca5f772eb8f51', class: 'searchcraft-input-form-input-wrapper' }, h("input", { key: '7071be386f0c73a0230e0815640b134ee5139262', autoComplete: 'off', class: classNames('searchcraft-input-form-input', {
                'searchcraft-placeholder-hide-on-focus': this.placeholderBehavior === 'hide-on-focus',
            }), onFocus: () => this.inputFocus?.emit(), onBlur: () => this.inputBlur?.emit(), onInput: (event) => {
                this.handleInput(event);
            }, placeholder: this.placeholderValue, type: 'text', value: this.inputValue }), h("div", { key: '178a7a21a84f012662312dc2b9145fff0aec6a44', class: 'searchcraft-input-form-input-icon' }, h("svg", { key: '7fb86586c155f7075fb65280482eb2ab5ff8a9db', class: 'searchcraft-input-form-input-search-icon', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', "aria-labelledby": 'searchcraft-title' }, h("title", { key: '0a48667010f2c998917271f941877c5ec826329f' }, "Search icon"), h("path", { key: '94c54dfa1406bdc6c2f87f3b31e1b01862b58e08', d: 'M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))), isShowingClearButton && (h("button", { key: '931fc5e8842de1e8f3bab3fa163261c54c24148c', type: 'button', class: 'searchcraft-input-form-clear-button', onClick: this.handleClearInput }, h("svg", { key: '0676b050222eb9a7bf2f7c7c112ae40c0644ecf7', class: 'searchcraft-input-form-clear-icon', viewBox: '0 0 22 22', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', "aria-labelledby": 'icon-title' }, h("title", { key: '002b23596bc977b5a942776e4f7b513db4584361' }, "Clear icon"), h("path", { key: '05346b8f1ede39b9e1924760f400df10d8b0aa49', d: 'M14 8L8 14M8 8L14 14M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))))))));
    }
    static get watchers() { return {
        "core": ["onCoreChange"]
    }; }
}, [0, "searchcraft-input-form", {
        "searchcraftId": [1, "searchcraft-id"],
        "autoSearch": [4, "auto-search"],
        "buttonPlacement": [1, "button-placement"],
        "buttonLabel": [1, "button-label"],
        "inputLabel": [1, "input-label"],
        "placeholderValue": [1, "placeholder-value"],
        "placeholderBehavior": [1, "placeholder-behavior"],
        "inputValue": [32],
        "searchTerm": [32],
        "error": [32]
    }, undefined, {
        "core": ["onCoreChange"]
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

//# sourceMappingURL=p-b7e99386.js.map