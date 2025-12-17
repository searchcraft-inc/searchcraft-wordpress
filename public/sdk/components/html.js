import { p as purify } from './purify.es.js?v=0.13.2';

/**
 * This allows you to parse a template string with a function.
 */
const html = (strings, ...values) => {
    let result = strings[0];
    for (let i = 0; i < values.length; i++) {
        result +=
            purify.sanitize(values[i] ? String(values[i]) : '') + strings[i + 1];
    }
    return result || '';
};

export { html as h };
//# sourceMappingURL=html.js.map

//# sourceMappingURL=html.js.map