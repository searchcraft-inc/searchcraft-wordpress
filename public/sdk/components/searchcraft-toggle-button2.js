import { p as proxyCustomElement, H, c as createEvent, h, t as transformTag } from './index2.js?scv=0.15.1';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.15.1';
import { c as classNames } from './index3.js?scv=0.15.1';

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
        return (h("div", { key: 'ab1d5ee21c7aaa28af1c405edc986556858366e8', class: classNames('searchcraft-toggle-button', {
                'searchcraft-toggle-button-active': this.isActive,
            }) }, h("div", { key: '44f86a16d796d448bdb2fb3af72d4d8e1484364b' }, h("p", { key: '9fedb38795d6379cae56dc005ab8e4a944b4261b', class: 'searchcraft-toggle-button-label' }, this.label), this.subLabel && (h("p", { key: '44f3d17175184032275fec89a4cfe7f8266b7014', class: 'searchcraft-toggle-button-sub-label' }, this.subLabel))), h("button", { key: '15fc18906ff2fb21fe646a4e3a8a2ace4a37cae2', class: 'searchcraft-toggle-button-background', onClick: this.handleToggle, type: 'button' }, h("div", { key: '716d29c65a199f63f5fd294dc3e3ad2ea4d53aa3', class: 'searchcraft-toggle-button-handle' }))));
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