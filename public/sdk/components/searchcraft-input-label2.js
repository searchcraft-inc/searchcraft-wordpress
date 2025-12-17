import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?v=0.13.2';
import { c as classNames } from './index3.js?v=0.13.2';

const SearchcraftInputLabel = /*@__PURE__*/ proxyCustomElement(class SearchcraftInputLabel extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
    }
    /**
     * The classname applied to the label element.
     */
    inputLabelClassName = '';
    label = '';
    render() {
        return (h("label", { key: '1008f9beb320aaa94026604b283eb65a96023265', class: classNames('searchcraft-input-label', this.inputLabelClassName), htmlFor: 'searchcraft-input-id' }, this.label));
    }
}, [768, "searchcraft-input-label", {
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
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftInputLabel);
            }
            break;
    } });
}

export { SearchcraftInputLabel as S, defineCustomElement as d };
//# sourceMappingURL=searchcraft-input-label2.js.map

//# sourceMappingURL=searchcraft-input-label2.js.map