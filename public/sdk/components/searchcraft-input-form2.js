import { p as proxyCustomElement, H, c as createEvent, h, t as transformTag } from './index2.js?scv=0.16.0';
import { c as classNames } from './index3.js?scv=0.16.0';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.16.0';
import { d as defineCustomElement$3 } from './searchcraft-button2.js?scv=0.16.0';
import { d as defineCustomElement$2 } from './searchcraft-error-message2.js?scv=0.16.0';
import { d as defineCustomElement$1 } from './searchcraft-input-label2.js?scv=0.16.0';

const SearchcraftInputForm = /*@__PURE__*/ proxyCustomElement(class SearchcraftInputForm extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
        this.inputFocus = createEvent(this, "inputFocus");
        this.inputBlur = createEvent(this, "inputBlur");
        this.inputInit = createEvent(this, "inputInit");
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
    inputElement;
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
        this.dismissOnScreenKeyboard();
        await this.performSearch();
    };
    /**
     * Closes the on-screen keyboard after a search is submitted on touch devices,
     * so it no longer covers the results. Devices with a mouse keep focus in the
     * input, so the user can keep typing and use the arrow keys.
     */
    dismissOnScreenKeyboard() {
        if (window.matchMedia?.('(hover: none) and (pointer: coarse)').matches) {
            this.inputElement?.blur();
        }
    }
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
        return (h("form", { key: 'e375f04aa3062b93d07a24d6d79a63029d463c6d', class: 'searchcraft-input-form', onSubmit: this.handleFormSubmit }, h("div", { key: '9a9020828ba87f1edd7ec01b67575e824ecd03b9', class: inputGridClassNames, style: inputGridStyles }, h("div", { key: 'b79f9c030c8ca57cbd02034430ca518b1f83b868', class: 'searchcraft-input-form-button' }, h("searchcraft-button", { key: '90f23e6543171cb8aaf4c8e3fcb93979eba85dd4', onButtonClick: this.handleFormSubmit, label: this.buttonLabel })), this.inputLabel && (h("div", { key: '9114a59d7fad2b4b982a9f5e46466ac23c84e56f', class: 'searchcraft-input-form-label' }, h("searchcraft-input-label", { key: '9c3adad40480f97178b9054d28f17648c512ad8d', label: this.inputLabel }))), this.error && (h("div", { key: '95f070e32fe45166798913b73ceef26aaf7e68f0', class: 'searchcraft-input-form-error-message' }, h("searchcraft-error-message", { key: 'd507e9c01b9a7447b49b667d2510bf2b4d1237d1' }, "Something went wrong."))), h("div", { key: '3a5057e699b2ebd2af20ed41504e833023834570', class: 'searchcraft-input-form-input-wrapper' }, h("input", { key: '3bc445b52df4aa0392106b6245d8bddce6a7894f', autoComplete: 'off', class: classNames('searchcraft-input-form-input', {
                'searchcraft-placeholder-hide-on-focus': this.placeholderBehavior === 'hide-on-focus',
            }), enterkeyhint: 'search', ref: (el) => {
                this.inputElement = el;
            }, onFocus: () => this.inputFocus?.emit(), onBlur: () => this.inputBlur?.emit(), onInput: (event) => {
                this.handleInput(event);
            }, placeholder: this.placeholderValue, type: 'text', value: this.inputValue }), h("div", { key: '1f15e09d4a1d1c69105c6d3776fa579e2485d074', class: 'searchcraft-input-form-input-icon' }, h("svg", { key: 'c2290c43f4795235a9092ca65843534b476966d3', class: 'searchcraft-input-form-input-search-icon', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', "aria-labelledby": 'searchcraft-title' }, h("title", { key: 'd039ba9a93b779aedba28fe8df299698d8d19b8c' }, "Search icon"), h("path", { key: '4206937d1f038dca6effee55ca03e9046377c14c', d: 'M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))), isShowingClearButton && (h("button", { key: '3dfa0dfc5d1b6708f79db2c085bd8b5f18e0b67b', type: 'button', class: 'searchcraft-input-form-clear-button', onClick: this.handleClearInput }, h("svg", { key: '3af9c1768c0e0eed6935cc5267d1169b11f08bb4', class: 'searchcraft-input-form-clear-icon', viewBox: '0 0 22 22', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', "aria-labelledby": 'icon-title' }, h("title", { key: '7eb8530a8b89e387231cb509b3f68b4a3bafde20' }, "Clear icon"), h("path", { key: '83d43b2cf2f2e90e9b340e6fdf7c91cffee23c20', d: 'M14 8L8 14M8 8L14 14M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))))))));
    }
    static get watchers() { return {
        "core": ["onCoreChange"],
        "value": ["onValueChange"]
    }; }
}, [768, "searchcraft-input-form", {
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
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftInputForm);
            }
            break;
        case "searchcraft-button":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$3();
            }
            break;
        case "searchcraft-error-message":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$2();
            }
            break;
        case "searchcraft-input-label":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$1();
            }
            break;
    } });
}

export { SearchcraftInputForm as S, defineCustomElement as d };
//# sourceMappingURL=searchcraft-input-form2.js.map

//# sourceMappingURL=searchcraft-input-form2.js.map