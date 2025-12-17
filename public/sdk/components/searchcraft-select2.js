import { p as proxyCustomElement, H, c as createEvent, h, t as transformTag } from './index2.js?v=0.13.2';

const SearchcraftSelect = /*@__PURE__*/ proxyCustomElement(class SearchcraftSelect extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
        this.selectChange = createEvent(this, "selectChange");
    }
    /**
     * The caption displayed below the select input.
     */
    caption;
    /**
     * Whether the select input is disabled.
     */
    disabled = false;
    /**
     * The ID for the select input.
     */
    inputId;
    /**
     * The label of the select input.
     */
    label;
    /**
     * The ID for the label of the select input.
     */
    labelId;
    /**
     * The name of the select input.
     */
    name;
    /**
     * The options for the select input.
     */
    options = [];
    /**
     * The event fired when the select is changed.
     */
    selectChange;
    searchResultsPerPage;
    setSearchResultsPage = () => { };
    setSearchResultsPerPage = () => { };
    handleSelectChange = (event) => {
        this.selectChange.emit(event.target.value);
    };
    handleGoToPage(page) {
        this.setSearchResultsPage(page);
    }
    render() {
        return (h("div", { key: '15ecbf48c824a161cd83bdab99dace8e44f1ab39', class: 'searchcraft-select' }, this.label && (h("label", { key: 'aba433ae9c27c9405099cffcef923c3ad22d7fda', class: 'searchcraft-select-label', id: this.labelId || `${this.inputId}-label`, htmlFor: this.inputId }, this.label)), h("div", { key: '8df8a2ff05924c9c55cdd6e3827cd927cddab82a', class: 'searchcraft-select-input-wrapper' }, h("select", { key: '1d5f492c2255f8ca1b6ea5e04a2726dda2f2c52f', "aria-labelledby": this.label ? this.labelId || `${this.inputId}-label` : undefined, class: 'searchcraft-select-input', disabled: this.disabled, id: this.inputId, name: this.name, onChange: this.handleSelectChange }, (typeof this.options === 'string'
            ? JSON.parse(this.options)
            : this.options).map(({ label, value, selected }) => {
            return (h("option", { key: value, value: value, selected: selected }, label));
        })), h("svg", { key: '0ec6892b529f2e70027aadea47208582a65a97b7', class: 'searchcraft-select-input-icon', width: '20', height: '20', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, h("title", { key: 'bced6b62378491d1d1c629b602d7d033d912c761' }, "Select dropdown icon"), h("path", { key: '659f8ebf9129e2e7941da949d29688c41c1472bb', d: 'M5 7.5L10 12.5L15 7.5', stroke: 'currentColor', "stroke-width": '1.5', "stroke-linecap": 'round', "stroke-linejoin": 'round' }))), this.caption && (h("p", { key: '51217d926f68f79b6c3514f5fd769b56549fdce9', class: 'searchcraft-select-caption' }, this.caption))));
    }
}, [768, "searchcraft-select", {
        "caption": [1],
        "disabled": [4],
        "inputId": [1, "input-id"],
        "label": [1],
        "labelId": [1, "label-id"],
        "name": [1],
        "options": [1],
        "searchResultsPerPage": [32],
        "setSearchResultsPage": [32],
        "setSearchResultsPerPage": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-select"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-select":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftSelect);
            }
            break;
    } });
}

export { SearchcraftSelect as S, defineCustomElement as d };
//# sourceMappingURL=searchcraft-select2.js.map

//# sourceMappingURL=searchcraft-select2.js.map