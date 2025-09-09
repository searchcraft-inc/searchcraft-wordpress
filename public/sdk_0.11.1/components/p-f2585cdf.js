import { p as proxyCustomElement, H, h } from './p-5365011f.js';

const SearchcraftErrorMessage = /*@__PURE__*/ proxyCustomElement(class SearchcraftErrorMessage extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    render() {
        return (h("div", { key: 'd42f7abf8dfb2620622b8012d868d32f04b2f354', class: 'searchcraft-error-message' }, h("slot", { key: '75a7811576ea8afe80a7ae739f5cf2d411f976df' }, "Search term is required.")));
    }
}, [4, "searchcraft-error-message"]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-error-message"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-error-message":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftErrorMessage);
            }
            break;
    } });
}

export { SearchcraftErrorMessage as S, defineCustomElement as d };

//# sourceMappingURL=p-f2585cdf.js.map