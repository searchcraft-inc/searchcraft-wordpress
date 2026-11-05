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
        return (h("div", { key: 'db31c8615adbfaaf4084339c3f8068dd8801a6fd', class: classNames('searchcraft-toggle-button', {
                'searchcraft-toggle-button-active': this.isActive,
            }) }, h("div", { key: '173fdc97a748c3da728dc1945f1013f71fc7317c' }, h("p", { key: 'a447d01caca671c032722c9fbb96fe9d266cb969', class: 'searchcraft-toggle-button-label' }, this.label), this.subLabel && (h("p", { key: '2148570d4c43ac0d0849ab4f2b76b555d3f36582', class: 'searchcraft-toggle-button-sub-label' }, this.subLabel))), h("button", { key: '66dc829d0f1997aeda7eceb9133b058715d46f0b', class: 'searchcraft-toggle-button-background', onClick: this.handleToggle, type: 'button' }, h("div", { key: '37d02f7340b57b11ab9f160df033eb39fb44bb13', class: 'searchcraft-toggle-button-handle' }))));
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