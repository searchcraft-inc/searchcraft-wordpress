import type { SafeUrl } from "../types/index";
/**
 * Returns `url` unchanged when it is safe to place in an `href` or `src` attribute, and `#`
 * when it is not.
 *
 * Relative URLs, `http:`, `https:`, `mailto:`, `tel:`, `sms:` and `data:image/` URLs are safe,
 * along with any scheme passed in `options.schemes`. Every other scheme, such as `javascript:`,
 * is blocked, including when it is written in mixed case, has leading spaces or contains tabs,
 * newlines or character references.
 *
 * ```js
 * html`<a href="${safeUrl(item.url)}">${item.title}</a>`;
 * html`<a href="${safeUrl(item.appUrl, { schemes: ['myapp'] })}">Open in app</a>`;
 * ```
 */
export declare const safeUrl: SafeUrl;
//# sourceMappingURL=safeUrl.d.ts.map