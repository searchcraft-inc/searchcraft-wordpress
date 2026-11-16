import type { TemplateHtml } from "../types/index";
/**
 * This allows you to parse a template string with a function.
 *
 * Each value is made safe for where it lands in the markup:
 * - In text, the value is sanitized with DOMPurify, so it can contain markup but no scripts.
 *   DOMPurify also removes URLs it does not allow, so a link with a custom scheme that `safeUrl`
 *   allowed loses its `href` when its markup is placed as a value in text, as in a list built
 *   from nested `html` calls. Write such links in the template's own markup instead.
 * - In a quoted attribute value, the quote that would end the value is escaped. The browser
 *   decodes it again, so quotes display as given. Character references in the value, such as
 *   `&amp;`, are decoded by the browser as before.
 * - In an unquoted attribute value, spaces, quotes and `=<>` are escaped.
 * - Inside a tag but not in an attribute value, such as `<a ${attributes}>`, the value is placed
 *   as is. Use this only for attributes the template writes itself, such as the output of a
 *   nested `html` call, never for indexed data.
 *
 * A template can also be a list of attributes, such as `aria-label="${label}"`, that another
 * template places inside a tag. Until its first tag ends, a value that could be in an attribute
 * value is escaped for that attribute, and `<` is escaped so it cannot start a tag either.
 *
 * Escaping keeps a value inside its attribute but does not make every attribute safe. A value in
 * an event handler such as `onclick` still runs as script, and a value in `style` still applies
 * as CSS. URLs from indexed data should go through `safeUrl` before they are placed in an
 * `href` or `src`.
 */
export declare const html: TemplateHtml;
//# sourceMappingURL=html.d.ts.map