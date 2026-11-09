import type { ADMAd } from '..';
export type TemplateHtml = (strings: TemplateStringsArray, ...values: (string | number | undefined)[]) => string;
/**
 * Options for the `safeUrl` template helper.
 */
export type SafeUrlOptions = {
    /**
     * More URL schemes to allow, such as an app's own scheme (`['myapp']`). A link with such a
     * scheme must be written in the template's own markup. If its markup is placed as a value in
     * the text of another `html` call, DOMPurify removes the URL.
     */
    schemes?: string[];
};
/**
 * Returns `url` unchanged when it is safe to place in an `href` or `src` attribute, and `#` when
 * it is not. Relative URLs, `http:`, `https:`, `mailto:`, `tel:`, `sms:` and `data:image/` URLs
 * are safe, along with any scheme passed in `options.schemes`.
 */
export type SafeUrl = (url: unknown, options?: SafeUrlOptions) => string;
/**
 * The helpers passed to every template.
 */
export type TemplateUtils = {
    /**
     * Builds the template's markup. Values in text are sanitized, and values in attributes are
     * escaped so they stay inside their attribute. Values in event handler attributes such as
     * `onclick`, or in `style`, are not made safe, so never place result values there.
     */
    html: TemplateHtml;
    /**
     * Checks a URL before it is placed in an `href` or `src`. Returns `#` for unsafe URLs,
     * such as `javascript:` URLs.
     */
    safeUrl: SafeUrl;
};
export type SearchResultTemplate<T> = (data: T, index: number, utils: TemplateUtils & {
    source_index?: string;
}) => string;
export type SearchResultTemplateData = any;
export type ResultsInfoTemplate = (data: {
    range: [number, number];
    count: number;
    responseTime: string;
}, utils: TemplateUtils) => string;
export type CustomAdTemplate = (data: {
    adContainerId: string;
    searchTerm: string;
}, utils: TemplateUtils) => string;
export type PopoverButtonTemplate = (data: {
    isPopoverVisible: boolean;
}, utils: TemplateUtils) => string;
export type PopoverNoResultsTemplate = (data: {
    searchTerm: string;
}, utils: TemplateUtils) => string;
export type ADMAdTemplate = (data: ADMAd, utils: TemplateUtils) => string;
//# sourceMappingURL=templates.types.d.ts.map