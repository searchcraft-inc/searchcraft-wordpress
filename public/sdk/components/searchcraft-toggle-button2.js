import { p as proxyCustomElement, H, c as createEvent, h, t as transformTag } from './index2.js?scv=0.14.0';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.14.0';
import { c as classNames } from './index3.js?scv=0.14.0';

const SearchcraftToggleButton = /*@__PURE__*/ proxyCustomElement(class SearchcraftToggleButton extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
        this.toggleUpdated = createEvent(this, "toggleUpdated");
    }
    /**
     * The label.
     */
    label = 'Toggle';
    /**
     * The secondary label displayed below the main label.
     */
    subLabel;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    /**
     * When the toggle element is changed.
     */
    toggleUpdated;
    isActive = false;
    lastSearchTerm;
    unsubscribe;
    cleanupCore;
    handleToggle = async () => {
        this.isActive = !this.isActive;
        this.toggleUpdated?.emit(this.isActive);
    };
    onCoreAvailable(core) {
        /** When the query changes, sets toggle button state back to inactive. */
        this.unsubscribe = core.store.subscribe((state) => {
            if (state.searchTerm !== this.lastSearchTerm &&
                state.searchTerm.trim().length === 0) {
                this.isActive = false;
            }
            this.lastSearchTerm = state.searchTerm;
        });
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
    }
    render() {
        return (h("div", { key: '27d05b370fcb2a4ca440abc3ef777c264f6139a6', class: classNames('searchcraft-toggle-button', {
                'searchcraft-toggle-button-active': this.isActive,
            }) }, h("div", { key: 'e3079a80acf706576a36efb04c52c84bda90be8a' }, h("p", { key: 'cbd732b19bd408e9b3dc3602b16a47060603e4f6', class: 'searchcraft-toggle-button-label' }, this.label), this.subLabel && (h("p", { key: '7b68d0c50b9498e9f64968987b0d433b6bdf6327', class: 'searchcraft-toggle-button-sub-label' }, this.subLabel))), h("button", { key: '05366d9f252746d4860909de37b01e908f85f2fb', class: 'searchcraft-toggle-button-background', onClick: this.handleToggle, type: 'button' }, h("div", { key: '26d3ab13df50e18e6f7ec76da55089feed6d53b9', class: 'searchcraft-toggle-button-handle' }))));
    }
}, [768, "searchcraft-toggle-button", {
        "label": [1],
        "subLabel": [1, "sub-label"],
        "searchcraftId": [1, "searchcraft-id"],
        "isActive": [32],
        "lastSearchTerm": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-toggle-button"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-toggle-button":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftToggleButton);
            }
            break;
    } });
}

export { SearchcraftToggleButton as S, defineCustomElement as d };
//# sourceMappingURL=searchcraft-toggle-button2.js.map

//# sourceMappingURL=searchcraft-toggle-button2.js.map