import { D as DOMPurify } from './p-e2a10337.js';

/**
 * This allows you to parse a template string with a function.
 */
const html = (strings, ...values) => {
    let result = strings[0];
    for (let i = 0; i < values.length; i++) {
        result +=
            DOMPurify.sanitize(values[i] ? String(values[i]) : '') + strings[i + 1];
    }
    return result || '';
};

export { html as h };

//# sourceMappingURL=p-b4b67072.js.map