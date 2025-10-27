import type { ADMAdTemplate, CustomAdTemplate } from '../sdk-types';
export interface CustomAdConfig {
    /**
     * The amount of debounce delay to add before calling the ad_container_rendered event
     */
    adContainerRenderedDebounceDelay?: number;
    /**
     * The number of custom ads to render at the start of the search results page.
     */
    adStartQuantity?: number;
    /**
     * The number of custom ads to render at the end of the search results page.
     */
    adEndQuantity?: number;
    /**
     * Renders a custom ad in between search results, at the specified interval.
     */
    adInterstitialInterval?: number;
    /**
     * Specifies the number of ads to be rendered in each interstitial in between search results.
     */
    adInterstitialQuantity?: number;
    /**
     * A callback function responsible for rendering the custom ad containers.
     */
    template: CustomAdTemplate;
}
export interface NativoAdConfig {
    /**
     * The placement id to use for Nativo ads.
     */
    placementId?: number;
    /**
     * The class name for nativo ad containers.
     */
    adClassName?: string;
    /**
     * The number of custom ads to render at the start of the search results page.
     */
    adStartQuantity?: number;
    /**
     * The number of custom ads to render at the end of the search results page.
     */
    adEndQuantity?: number;
    /**
     * Renders a custom ad in between search results, at the specified interval.
     */
    adInterstitialInterval?: number;
    /**
     * Specify how many normal search results to render before rendering the first interstitial ad grouping.
     */
    adInterstialStartIndex?: number;
    /**
     * Specifies the number of ads to be rendered in each interstitial in between search results.
     */
    adInterstitialQuantity?: number;
}
export interface ADMAdConfig {
    /**
     * The number of product ads to request.
     */
    productAdQuantity?: number;
    /**
     * The number of text ads to request.
     */
    textAdQuantity?: number;
    /**
     * The adm sub value.
     */
    sub?: string;
    /**
     * A callback function responsible for rendering the ADM ad containers.
     */
    template?: ADMAdTemplate;
}
//# sourceMappingURL=SearchcraftAdConfig.types.d.ts.map