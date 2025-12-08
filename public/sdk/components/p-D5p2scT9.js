import { p as proxyCustomElement, H, c as createEvent, h } from './p-DO5g2x-l.js';
import { r as registry } from './p-D0j0UFpV.js';
import { c as classNames } from './p-BfTCfPZ1.js';

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
        return (h("div", { key: '7dad6f4e4422a62f6403724ff16fe25e042ae2ac', class: classNames('searchcraft-toggle-button', {
                'searchcraft-toggle-button-active': this.isActive,
            }) }, h("div", { key: '2faa2ee1eb5cb78dc39f523415f2be96bc23fed1' }, h("p", { key: '29ea63c281b8f1ae041ba75a149ce1b60e936662', class: 'searchcraft-toggle-button-label' }, this.label), this.subLabel && (h("p", { key: 'e51efaae5ca79eede71852e6dec8eff4575139fe', class: 'searchcraft-toggle-button-sub-label' }, this.subLabel))), h("button", { key: 'd590da981692db162df9b8086ba2444d6a56ef9d', class: 'searchcraft-toggle-button-background', onClick: this.handleToggle, type: 'button' }, h("div", { key: '5be6ee1dd7dc58bd67fff18923569caee37b4936', class: 'searchcraft-toggle-button-handle' }))));
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
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftToggleButton);
            }
            break;
    } });
}

export { SearchcraftToggleButton as S, defineCustomElement as d };
//# sourceMappingURL=p-D5p2scT9.js.map

//# sourceMappingURL=p-D5p2scT9.js.map