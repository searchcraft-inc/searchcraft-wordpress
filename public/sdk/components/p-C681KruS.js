import { p as proxyCustomElement, H, c as createEvent, h, F as Fragment } from './p-DO5g2x-l.js';
import { c as classNames } from './p-BfTCfPZ1.js';

const SearchcraftButton = /*@__PURE__*/ proxyCustomElement(class SearchcraftButton extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
        this.buttonClick = createEvent(this, "buttonClick");
    }
    /**
     * Controls the visual representation of the button.
     */
    hierarchy = 'primary';
    /**
     * Whether the button is disabled.
     */
    disabled = false;
    /**
     * The icon element.
     */
    icon;
    /**
     * Should the button only display an icon.
     */
    iconOnly = false;
    /**
     * The position of the icon.
     */
    iconPosition = 'left';
    /**
     * The label for the button.
     */
    label = 'Search';
    /**
     * The type of the button.
     */
    type = 'button';
    /**
     * The event fired when the button is clicked.
     */
    buttonClick;
    handleButtonClick = () => {
        this.buttonClick.emit();
    };
    render() {
        return (h("button", { key: 'e54b4566e0286265bc0c8b6bb4e9ef26108575da', "aria-label": this.label, class: classNames('searchcraft-button', {
                'searchcraft-button-primary': this.hierarchy === 'primary',
                'searchcraft-button-tertiary': this.hierarchy === 'tertiary',
                'searchcraft-button-disabled': this.disabled,
            }), disabled: this.disabled, onClick: this.handleButtonClick, type: this.type }, this.iconOnly ? (this.icon) : (h(Fragment, null, this.iconPosition === 'left' && this.icon, h("span", null, this.label), this.iconPosition === 'right' && this.icon))));
    }
}, [768, "searchcraft-button", {
        "hierarchy": [1],
        "disabled": [4],
        "icon": [16],
        "iconOnly": [4, "icon-only"],
        "iconPosition": [1, "icon-position"],
        "label": [1],
        "type": [1]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-button"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-button":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, SearchcraftButton);
            }
            break;
    } });
}

export { SearchcraftButton as S, defineCustomElement as d };
//# sourceMappingURL=p-C681KruS.js.map

//# sourceMappingURL=p-C681KruS.js.map