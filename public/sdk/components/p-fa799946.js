import { p as proxyCustomElement, H, h } from './p-5365011f.js';
import { c as classNames } from './p-5cdc6210.js';

const SearchcraftInputLabel = /*@__PURE__*/ proxyCustomElement(class SearchcraftInputLabel extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    /**
     * The classname applied to the label element.
     */
    inputLabelClassName = '';
    label = '';
    render() {
        return (h("label", { key: '1008f9beb320aaa94026604b283eb65a96023265', class: classNames('searchcraft-input-label', this.inputLabelClassName), htmlFor: 'searchcraft-input-id' }, this.label));
    }
}, [0, "searchcraft-input-label", {
        "inputLabelClassName": [1, "input-label-class-name"],
        "label": [1]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-input-label"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-input-label":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftInputLabel);
            }
            break;
    } });
}

export { SearchcraftInputLabel as S, defineCustomElement as d };

//# sourceMappingURL=p-fa799946.js.map