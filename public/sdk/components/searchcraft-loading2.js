import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?scv=0.14.0';

const SearchcraftInputLabel = /*@__PURE__*/ proxyCustomElement(class SearchcraftInputLabel extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
    }
    label;
    render() {
        const accessibleLabel = this.label ?? 'Loading';
        return (h("div", { key: 'd749250c5f56c703da7f1cba4a226a202ae269c0', class: 'searchcraft-loading',
            // biome-ignore lint/a11y/useSemanticElements: <output> is semantically incorrect for a loading indicator
            role: 'status', "aria-live": 'polite', "aria-label": accessibleLabel }, h("div", { key: '0f834793686bcf8dff56769ad65311c1f591e8dd', class: 'searchcraft-loading-dots', "aria-hidden": 'true' }, h("div", { key: '2174c333eecf0630ce984b2dece74675356259d9', class: 'searchcraft-loading-dot-1' }), h("div", { key: '927fee69cd86dbd9ae57776c2a15fa6956707fac', class: 'searchcraft-loading-dot-2' }), h("div", { key: 'cfd37c9a9a12dfc9963aa53c3979fb59dc7a132c', class: 'searchcraft-loading-dot-3' })), this.label ? (h("p", { class: 'searchcraft-loading-label' }, this.label)) : null));
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