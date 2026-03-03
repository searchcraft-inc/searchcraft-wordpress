import { p as proxyCustomElement, H, c as createEvent, h, t as transformTag } from './index2.js?scv=0.14.0';
import { a as getDifferenceInUnits, b as getStartOf, c as getFormattedDateString } from './units.js?scv=0.14.0';
import './purify.es.js';
import { c as classNames } from './index3.js?scv=0.14.0';

/**
 * Creates a throttled version of the given function that only invokes
 * the original function at most once every specified number of milliseconds.
 *
 * The logic is written in a way that the last invocation is always called, after the
 * throttle cooldown period has ended.
 *
 * @template Arguments - The argument types for the function to throttle
 * @param callback - The function to throttle
 * @param delayInMilliseconds - The number of milliseconds to wait before allowing the next invocation
 * @returns A throttled version of the original function
 */
function throttle(callback, delayInMilliseconds) {
    let isThrottleOnCooldown = false;
    let trailingCallArgs = null;
    const invokeAction = (args) => {
        callback(...args);
        isThrottleOnCooldown = true;
        setTimeout(() => {
            isThrottleOnCooldown = false;
            if (trailingCallArgs) {
                const nextArgs = trailingCallArgs;
                trailingCallArgs = null;
                invokeAction(nextArgs);
            }
        }, delayInMilliseconds);
    };
    return (...args) => {
        if (!isThrottleOnCooldown) {
            invokeAction(args);
        }
        else {
            trailingCallArgs = args;
        }
    };
}

const SearchcraftSlider = /*@__PURE__*/ proxyCustomElement(class SearchcraftSlider extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
        this.rangeChanged = createEvent(this, "rangeChanged");
    }
    /**
     * The maximum value allowed.
     */
    max = 100;
    /**
     * The minimum value allowed.
     */
    min = 0;
    /**
     * The step amount for the slider inputs.
     */
    step = 1;
    /** The type of data the sliders are using. */
    dataType = 'number';
    /** The date granularity to use. Used to format date labels. */
    dateGranularity;
    lowerBound = 0;
    upperBound = 1;
    endValue = 0;
    startValue = 0;
    lastFocusedHandle = 'max';
    throttledEmitUpdate = () => { };
    /**
     * When the range has changed.
     * */
    rangeChanged;
    connectedCallback() {
        switch (this.dataType) {
            case 'number':
                this.startValue = this.min;
                this.endValue = this.max;
                this.lowerBound = this.min;
                this.upperBound = this.max;
                break;
            case 'date': {
                this.startValue = 0;
                this.endValue = getDifferenceInUnits(this.dateGranularity || 'year', this.min, this.max);
                this.lowerBound = 0;
                this.upperBound = this.endValue;
                break;
            }
        }
        this.throttledEmitUpdate = throttle(this.emitUpdate, 120);
    }
    emitUpdate = async () => {
        switch (this.dataType) {
            case 'number':
                this.rangeChanged?.emit({
                    startValue: this.startValue,
                    endValue: this.endValue,
                });
                break;
            case 'date': {
                const granularity = this.dateGranularity || 'year';
                const startTimestamp = getStartOf(this.min, granularity, this.lowerBound + this.startValue);
                const endTimestamp = getStartOf(this.min, granularity, this.lowerBound + this.endValue + 1);
                this.rangeChanged?.emit({
                    startValue: startTimestamp,
                    endValue: endTimestamp,
                });
                break;
            }
        }
    };
    handleStartValueChange = (event) => {
        const inputElement = event.target;
        const value = Number.parseInt(inputElement.value, 10);
        this.lastFocusedHandle = 'min';
        if (value <= this.endValue) {
            this.startValue = value;
            this.throttledEmitUpdate();
        }
        else {
            this.startValue = this.endValue;
            inputElement.value = `${this.endValue}`;
        }
    };
    handleEndValueChange = (event) => {
        const inputElement = event.target;
        const value = Number.parseInt(inputElement.value, 10);
        this.lastFocusedHandle = 'max';
        if (value >= this.startValue) {
            this.endValue = value;
            this.throttledEmitUpdate();
        }
        else {
            this.endValue = this.startValue;
            inputElement.value = `${this.startValue}`;
        }
    };
    getLabel = (value) => {
        switch (this.dataType) {
            case 'number':
                return `${this.startValue}`;
            case 'date': {
                const granularity = this.dateGranularity || 'year';
                const dateOffset = this.lowerBound + value;
                const timestamp = getStartOf(this.min, granularity, dateOffset);
                return getFormattedDateString(this.dateGranularity || 'year', new Date(timestamp));
            }
        }
    };
    render() {
        const startPercent = ((this.startValue - this.lowerBound) /
            (this.upperBound - this.lowerBound)) *
            100;
        const endPercent = ((this.endValue - this.lowerBound) /
            (this.upperBound - this.lowerBound)) *
            100;
        const startLabel = this.getLabel(this.startValue);
        const endLabel = this.getLabel(this.endValue);
        return (h("div", { key: '59b07f5c8a14f6cbad8bae6faebf12e9a511bcbb', class: 'searchcraft-slider' }, h("div", { key: '603c0bc39c6fe018016caf17b3b73f5b3c410fba', class: 'searchcraft-slider-range' }, h("div", { key: '31d4097f29aa13d0ab14ec861ecea803e8190ed0', class: 'searchcraft-slider-active-range', style: {
                left: `${startPercent}%`,
                width: `${endPercent - startPercent}%`,
            } }), h("input", { key: '40299fe0d7b973b448151a045b7a7f6c3b8846fd', class: classNames('searchcraft-slider-input', 'searchcraft-slider-input-min-handle'), max: this.upperBound, min: this.lowerBound, onInput: this.handleStartValueChange.bind(this), step: this.step, style: { zIndex: this.lastFocusedHandle === 'min' ? '2' : '1' }, type: 'range', value: this.startValue }), h("input", { key: 'd46ad0cee946b168cd6004f8a2f819f6e46c50e4', class: classNames('searchcraft-slider-input', 'searchcraft-slider-input-max-handle'), max: this.upperBound, min: this.lowerBound, onInput: this.handleEndValueChange.bind(this), step: this.step, style: { zIndex: this.lastFocusedHandle === 'max' ? '2' : '1' }, type: 'range', value: this.endValue })), h("div", { key: 'e65452bc456b0fa69d0dc0dd1276e19b9cf521e6', class: 'searchcraft-slider-label' }, h("span", { key: '2b5aec3e96d9bc9420b047a1d00cce40f361c729', class: 'searchcraft-slider-start-label' }, startLabel), h("span", { key: 'fce2109bd481b3df9ac4beee3731a24c012e4512', class: 'searchcraft-slider-end-label' }, endLabel))));
    }
}, [768, "searchcraft-slider", {
        "max": [2],
        "min": [2],
        "step": [2],
        "dataType": [1, "data-type"],
        "dateGranularity": [1, "date-granularity"],
        "lowerBound": [32],
        "upperBound": [32],
        "endValue": [32],
        "startValue": [32],
        "lastFocusedHandle": [32]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-slider"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-slider":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftSlider);
            }
            break;
    } });
}

export { SearchcraftSlider as S, defineCustomElement as d };
//# sourceMappingURL=searchcraft-slider2.js.map

//# sourceMappingURL=searchcraft-slider2.js.map