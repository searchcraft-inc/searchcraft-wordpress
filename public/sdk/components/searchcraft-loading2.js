import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?v=0.13.2';

const SearchcraftInputLabel = /*@__PURE__*/ proxyCustomElement(class SearchcraftInputLabel extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
    }
    label;
    render() {
        return (h("div", { key: '5bda164202246eeb2e56bb6a25bede9931898e7a', class: 'searchcraft-loading' }, h("div", { key: 'e33a5abc6686f9983c718a2532aa2d46902d98a2', class: 'searchcraft-loading-bars' }, h("div", { key: '85ff7af527b8f419c9bfd6e84331dd68772e6fdd', class: 'searchcraft-loading-bar-1' }), h("div", { key: '1485d17e9262dbec6d2e5976a63149878137821c', class: 'searchcraft-loading-bar-2' }), h("div", { key: 'd2939b9f7bc0599df7d96db91802ebfcbf232f3e', class: 'searchcraft-loading-bar-3' }), h("div", { key: '7a73bd5baf25ec789c3170e066d1333b905bfe7b', class: 'searchcraft-loading-bar-4' }), h("div", { key: 'b644b618766727773b21d288945c21b6ef0be958', class: 'searchcraft-loading-bar-5' }), h("div", { key: '4f5123a786fc40891ca54edc538dd56f683b26ce', class: 'searchcraft-loading-bar-6' })), h("p", { key: '967c1a6fb41231c8d713b78facca98e7f5a80709', class: 'searchcraft-loading-label' }, this.label)));
    }
}, [768, "searchcraft-loading", {
        "label": [1]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-loading"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-loading":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftInputLabel);
            }
            break;
    } });
}

export { SearchcraftInputLabel as S, defineCustomElement as d };
//# sourceMappingURL=searchcraft-loading2.js.map

//# sourceMappingURL=searchcraft-loading2.js.map