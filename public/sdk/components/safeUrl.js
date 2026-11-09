import { p as purify } from './purify.es.js?scv=0.16.0';

/**
 * States of a small HTML tokenizer, used to find where each value lands in the markup. The
 * states from `TAG_OPEN` to `AFTER_ATTRIBUTE_NAME` are inside a tag but not in a value.
 */
const TEXT = 0;
const TAG_OPEN = 1;
const END_TAG_OPEN = 2;
const TAG_NAME = 3;
const BEFORE_ATTRIBUTE_NAME = 4;
const ATTRIBUTE_NAME = 5;
const AFTER_ATTRIBUTE_NAME = 6;
const BEFORE_VALUE = 7;
const DOUBLE_QUOTED_VALUE = 8;
const SINGLE_QUOTED_VALUE = 9;
const UNQUOTED_VALUE = 10;
const MARKUP_DECLARATION = 11;
const COMMENT = 12;
const BOGUS_COMMENT = 13;
const RAW_TEXT = 14;
/**
 * Elements whose content is read as text up to their end tag.
 */
const RAW_TEXT_ELEMENTS = [
    'iframe',
    'noembed',
    'noframes',
    'noscript',
    'script',
    'style',
    'textarea',
    'title',
    'xmp',
];
const SPACE_PATTERN = /[\t\n\f\r ]/;
const LETTER_PATTERN = /[a-z]/i;
/**
 * Characters that cannot appear as is in an unquoted attribute value.
 */
const UNQUOTED_VALUE_SPECIAL_PATTERN = /[\s"'=<>`]/g;
const createTokenizer = (state) => ({
    state,
    position: 0,
    tagName: '',
    isEndTag: false,
    commentStart: 0,
});
/**
 * Reads the markup from where the last call stopped, so `tokenizer.state` tells where the next
 * character lands. It follows the HTML tokenizer closely enough to tell text, tags and
 * attribute values apart, including after comments and inside elements such as `<style>`.
 * It does not follow the tree the browser builds, so inside `<svg>` or `<math>`, elements such
 * as `<style>` and `<title>` are still read as text.
 */
const tokenize = (tokenizer, markup) => {
    while (tokenizer.position < markup.length) {
        const index = tokenizer.position++;
        const character = markup.charAt(index);
        const isSpace = SPACE_PATTERN.test(character);
        switch (tokenizer.state) {
            case TEXT:
                if (character === '<') {
                    tokenizer.state = TAG_OPEN;
                }
                break;
            case TAG_OPEN:
            case END_TAG_OPEN:
                if (LETTER_PATTERN.test(character)) {
                    tokenizer.isEndTag = tokenizer.state === END_TAG_OPEN;
                    tokenizer.tagName = character;
                    tokenizer.state = TAG_NAME;
                }
                else if (tokenizer.state === END_TAG_OPEN) {
                    tokenizer.state = character === '>' ? TEXT : BOGUS_COMMENT;
                }
                else if (character === '/') {
                    tokenizer.state = END_TAG_OPEN;
                }
                else if (character === '!') {
                    tokenizer.state = MARKUP_DECLARATION;
                }
                else if (character === '?') {
                    tokenizer.state = BOGUS_COMMENT;
                }
                else {
                    // The `<` is text, so read this character again as text.
                    tokenizer.state = TEXT;
                    tokenizer.position = index;
                }
                break;
            case TAG_NAME:
                if (isSpace || character === '/') {
                    tokenizer.state = BEFORE_ATTRIBUTE_NAME;
                }
                else if (character === '>') {
                    endTag(tokenizer);
                }
                else {
                    tokenizer.tagName += character;
                }
                break;
            case BEFORE_ATTRIBUTE_NAME:
                if (character === '>') {
                    endTag(tokenizer);
                }
                else if (!isSpace && character !== '/') {
                    tokenizer.state = ATTRIBUTE_NAME;
                }
                break;
            case ATTRIBUTE_NAME:
            case AFTER_ATTRIBUTE_NAME:
                if (character === '>') {
                    endTag(tokenizer);
                }
                else if (character === '=') {
                    tokenizer.state = BEFORE_VALUE;
                }
                else if (character === '/') {
                    tokenizer.state = BEFORE_ATTRIBUTE_NAME;
                }
                else if (isSpace) {
                    tokenizer.state = AFTER_ATTRIBUTE_NAME;
                }
                else {
                    tokenizer.state = ATTRIBUTE_NAME;
                }
                break;
            case BEFORE_VALUE:
                if (character === '>') {
                    endTag(tokenizer);
                }
                else if (character === '"') {
                    tokenizer.state = DOUBLE_QUOTED_VALUE;
                }
                else if (character === "'") {
                    tokenizer.state = SINGLE_QUOTED_VALUE;
                }
                else if (!isSpace) {
                    tokenizer.state = UNQUOTED_VALUE;
                }
                break;
            case DOUBLE_QUOTED_VALUE:
            case SINGLE_QUOTED_VALUE:
                if (character === (tokenizer.state === DOUBLE_QUOTED_VALUE ? '"' : "'")) {
                    tokenizer.state = BEFORE_ATTRIBUTE_NAME;
                }
                break;
            case UNQUOTED_VALUE:
                if (character === '>') {
                    endTag(tokenizer);
                }
                else if (isSpace) {
                    tokenizer.state = BEFORE_ATTRIBUTE_NAME;
                }
                break;
            case MARKUP_DECLARATION:
                if (markup.startsWith('--', index)) {
                    tokenizer.state = COMMENT;
                    tokenizer.position = index + 2;
                    tokenizer.commentStart = index + 2;
                }
                else {
                    tokenizer.state = BOGUS_COMMENT;
                    tokenizer.position = index;
                }
                break;
            case COMMENT: {
                // A comment ends at `-->` or `--!>`, and `<!-->` and `<!--->` end at once.
                const comment = markup.slice(Math.max(tokenizer.commentStart, index - 3), index);
                if (character === '>' &&
                    (index - tokenizer.commentStart < 2
                        ? /^-?$/.test(comment)
                        : /--!?$/.test(comment))) {
                    tokenizer.state = TEXT;
                }
                break;
            }
            case BOGUS_COMMENT:
                if (character === '>') {
                    tokenizer.state = TEXT;
                }
                break;
            case RAW_TEXT: {
                const endTagPattern = new RegExp(`</${tokenizer.tagName}[\\t\\n\\f\\r />]`, 'gi');
                endTagPattern.lastIndex = index;
                const match = endTagPattern.exec(markup);
                if (!match) {
                    // Read the end again next time, in case the end tag is only partly written yet.
                    tokenizer.position = Math.max(index, markup.length - tokenizer.tagName.length - 2);
                    return;
                }
                tokenizer.state = TAG_NAME;
                tokenizer.isEndTag = true;
                tokenizer.position = match.index + tokenizer.tagName.length + 2;
                break;
            }
        }
    }
};
const endTag = (tokenizer) => {
    const tagName = tokenizer.tagName.toLowerCase();
    if (!tokenizer.isEndTag && RAW_TEXT_ELEMENTS.includes(tagName)) {
        tokenizer.state = RAW_TEXT;
        tokenizer.tagName = tagName;
    }
    else {
        tokenizer.state = TEXT;
    }
};
const encodeCharacter = (character) => `&#${character.charCodeAt(0)};`;
const isTagState = (state) => state >= TAG_OPEN && state <= AFTER_ATTRIBUTE_NAME;
const isValueState = (state) => state >= BEFORE_VALUE && state <= UNQUOTED_VALUE;
/**
 * Makes a value safe for where it lands in the markup. With more than one state, the markup
 * may be read in more than one way, so the value is made safe for each of them.
 */
const placeValue = (value, states) => {
    if (states.every(isTagState)) {
        return value;
    }
    if (!states.some(isValueState)) {
        return value && purify.sanitize(value);
    }
    let escaped = value;
    for (const state of states) {
        if (state === DOUBLE_QUOTED_VALUE) {
            escaped = escaped.replace(/"/g, '&quot;');
        }
        else if (state === SINGLE_QUOTED_VALUE) {
            escaped = escaped.replace(/'/g, '&#39;');
        }
        else if (isValueState(state)) {
            escaped = escaped.replace(UNQUOTED_VALUE_SPECIAL_PATTERN, encodeCharacter);
        }
    }
    if (!states.every(isValueState)) {
        // The value may be read as text too, so it must not start a tag.
        return escaped.replace(/</g, '&lt;');
    }
    // With no value, the next attribute would be read as this attribute's value.
    return escaped || (states.includes(BEFORE_VALUE) ? '""' : '');
};
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
const html = (strings, ...values) => {
    const tokenizer = createTokenizer(TEXT);
    // A template can also be a list of attributes that a parent template places inside a tag,
    // so until the two readings meet, its values are made safe for both.
    let attributeTokenizer = createTokenizer(BEFORE_ATTRIBUTE_NAME);
    let result = strings[0] ?? '';
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        tokenize(tokenizer, result);
        if (attributeTokenizer) {
            tokenize(attributeTokenizer, result);
            if (tokenizer.state === TEXT && attributeTokenizer.state === TEXT) {
                attributeTokenizer = undefined;
            }
        }
        result +=
            placeValue(value || value === 0 ? String(value) : '', attributeTokenizer
                ? [tokenizer.state, attributeTokenizer.state]
                : [tokenizer.state]) + (strings[i + 1] ?? '');
    }
    return result;
};

/**
 * Schemes that are always allowed. `data:` URLs are allowed separately, for images only.
 */
const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel', 'sms'];
/**
 * Returned in place of a URL that is not allowed.
 */
const BLOCKED_URL = '#';
/**
 * A scheme is only recognized when its `:` comes before any `/`, `?` or `#`.
 */
const SCHEME_PATTERN = /^([a-z][a-z\d+.-]*):/i;
const DATA_IMAGE_PATTERN = /^data:image\//i;
/**
 * Character references the browser decodes in an attribute before it reads the URL.
 * Named references are limited to the ones that can help spell out a scheme.
 */
const CHARACTER_REFERENCE_PATTERN = /&#[xX]([\da-fA-F]+);?|&#(\d+);?|&(colon|Tab|NewLine);/g;
const NAMED_CHARACTER_REFERENCES = {
    colon: ':',
    Tab: '\t',
    NewLine: '\n',
};
const fromCodePoint = (codePoint) => codePoint > 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : '�';
const decodeCharacterReferences = (value) => value.replace(CHARACTER_REFERENCE_PATTERN, (_match, hex, decimal, name) => {
    if (hex) {
        return fromCodePoint(Number.parseInt(hex, 16));
    }
    if (decimal) {
        return fromCodePoint(Number.parseInt(decimal, 10));
    }
    return NAMED_CHARACTER_REFERENCES[name ?? ''] ?? '';
});
/**
 * Reads a URL the way the browser does before it looks for a scheme: character references
 * are decoded, tabs and newlines are removed, and leading spaces and control characters
 * are ignored.
 */
const normalizeUrl = (value) => {
    const decoded = decodeCharacterReferences(value).replace(/[\t\n\r]/g, '');
    let start = 0;
    while (start < decoded.length && decoded.charCodeAt(start) <= 0x20) {
        start++;
    }
    return decoded.slice(start);
};
const normalizeScheme = (scheme) => scheme.trim().toLowerCase().replace(/:$/, '');
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
const safeUrl = (url, options) => {
    if (url === undefined || url === null) {
        return '';
    }
    const value = String(url);
    const normalizedUrl = normalizeUrl(value);
    const scheme = normalizedUrl.match(SCHEME_PATTERN)?.[1]?.toLowerCase();
    if (!scheme) {
        return value;
    }
    if (ALLOWED_SCHEMES.includes(scheme) ||
        options?.schemes?.some((allowed) => normalizeScheme(allowed) === scheme)) {
        return value;
    }
    if (scheme === 'data' && DATA_IMAGE_PATTERN.test(normalizedUrl)) {
        return value;
    }
    return BLOCKED_URL;
};

export { html as h, safeUrl as s };
//# sourceMappingURL=safeUrl.js.map

//# sourceMappingURL=safeUrl.js.map