import { p as purify } from './p-BlYgaV0q.js';

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
//# sourceMappingURL=p-_aHgRsRD.js.map

//# sourceMappingURL=p-_aHgRsRD.js.map