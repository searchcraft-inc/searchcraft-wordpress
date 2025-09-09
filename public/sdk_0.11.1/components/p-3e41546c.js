import { p as proxyCustomElement, H, c as createEvent, h } from './p-5365011f.js';
import { r as registry } from './p-e30203b1.js';
import { c as classNames } from './p-5cdc6210.js';

const SearchcraftToggleButton = /*@__PURE__*/ proxyCustomElement(class SearchcraftToggleButton extends H {
    constructor() {
        super();
        this.__registerHost();
        this.toggleUpdated = createEvent(this, "toggleUpdated", 7);
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
        return (h("div", { key: '22a346c471a467b0b38b4cfde59ea70e0941cc93', class: classNames('searchcraft-toggle-button', {
                'searchcraft-toggle-button-active': this.isActive,
            }) }, h("div", { key: '99a2ad545500218f85006a9a0f8bbf18b8f42ed7' }, h("p", { key: '5e4a9e3f27af75d0d480dc6b3668963bfcb0d1a2', class: 'searchcraft-toggle-button-label' }, this.label), this.subLabel && (h("p", { key: 'c9df9f08270b58a167831d59ae3f9178eb3f6175', class: 'searchcraft-toggle-button-sub-label' }, this.subLabel))), h("button", { key: '6eebeb90660122d2c12ec91091ed5987478bbec4', class: 'searchcraft-toggle-button-background', onClick: this.handleToggle, type: 'button' }, h("div", { key: '62f9b1397354322986a24e8fe9e8cee62bc96600', class: 'searchcraft-toggle-button-handle' }))));
    }
}, [0, "searchcraft-toggle-button", {
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
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftToggleButton);
            }
            break;
    } });
}

export { SearchcraftToggleButton as S, defineCustomElement as d };

//# sourceMappingURL=p-3e41546c.js.map