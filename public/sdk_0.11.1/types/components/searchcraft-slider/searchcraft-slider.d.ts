import { type EventEmitter } from '../../stencil-public-runtime';
/**
 * This web component is designed to allow users to select a value from a range defined by a minimum and maximum value. The component renders a slider interface, which can be used to visually choose a value between two boundaries.
 *
 * @internal
 */
export declare class SearchcraftSlider {
    /**
     * The maximum value allowed.
     */
    max: number;
    /**
     * The minimum value allowed.
     */
    min: number;
    /**
     * The step amount for the slider inputs.
     */
    step: number;
    /** The type of data the sliders are using. */
    dataType: 'number' | 'date';
    /** The date granularity to use. Used to format date labels. */
    dateGranularity?: 'year' | 'month' | 'day' | 'hour';
    lowerBound: number;
    upperBound: number;
    endValue: number;
    startValue: number;
    lastFocusedHandle: 'min' | 'max';
    throttledEmitUpdate: () => void;
    /**
     * When the range has changed.
     * */
    rangeChanged: EventEmitter<{
        startValue: number;
        endValue: number;
    }> | undefined;
    connectedCallback(): void;
    private emitUpdate;
    private handleStartValueChange;
    private handleEndValueChange;
    private getLabel;
    render(): any;
}
//# sourceMappingURL=searchcraft-slider.d.ts.map