import { p as proxyCustomElement, H, h } from './p-5365011f.js';

const SearchcraftInputLabel = /*@__PURE__*/ proxyCustomElement(class SearchcraftInputLabel extends H {
    constructor() {
        super();
        this.__registerHost();
    }
    label;
    render() {
        return (h("div", { key: '507cde7e8f74682d0535a65fbc787b18fa4c49f7', class: 'searchcraft-loading' }, h("div", { key: 'de8d4db44bd0d54baa276403063327b040a39ee4', class: 'searchcraft-loading-bars' }, h("div", { key: '3ef1ad066aef5582de0afe08c598747e48533f0a', class: 'searchcraft-loading-bar-1' }), h("div", { key: '0e9b5bfb8c031b1d788b0f39a63b1b325f123aad', class: 'searchcraft-loading-bar-2' }), h("div", { key: 'b342f47a3869301d17e66f0ae79cbea6b2a7ed41', class: 'searchcraft-loading-bar-3' }), h("div", { key: 'c11c58254a005b80c54b98f6713acb4c7f376a58', class: 'searchcraft-loading-bar-4' }), h("div", { key: 'c53ff4d003ed8e1d17fdc2ab8d61b2d3313dd5ac', class: 'searchcraft-loading-bar-5' }), h("div", { key: '3f517f20a24a844c04562cbb95b3a39502905405', class: 'searchcraft-loading-bar-6' })), h("p", { key: '11a63145472d8ded9d28bf7e9cfde9097e6a02e2', class: 'searchcraft-loading-label' }, this.label)));
    }
}, [0, "searchcraft-loading", {
        "label": [1]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-loading"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-loading":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftInputLabel);
            }
            break;
    } });
}

export { SearchcraftInputLabel as S, defineCustomElement as d };

//# sourceMappingURL=p-919734fe.js.map