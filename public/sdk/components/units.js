/**
 * Given a document and a SearchResultMapping, return a mapped value from the document.
 * Applies formatting based on the values specified in the `SearchResultFieldName` values.
 *
 * @param document
 * @param {SearchResultMapping} mapping
 * @returns {string | undefined}
 */
function getDocumentValueFromSearchResultMapping(document, mapping) {
    if (document && mapping) {
        return mapping.fieldNames
            .map((fieldNameDetails) => {
            let valueFound = document[fieldNameDetails.fieldName];
            if (valueFound) {
                switch (fieldNameDetails.dataType) {
                    case 'date': {
                        valueFound = formatRelativeDate(valueFound, fieldNameDetails.dateFormatLocale, fieldNameDetails.dateFormatOptions);
                        break;
                    }
                    case 'number': {
                        valueFound = Intl.NumberFormat(fieldNameDetails.numberFormatLocale, fieldNameDetails.numberFormatOptions).format(valueFound * (fieldNameDetails.numberScale || 1));
                        break;
                    }
                }
            }
            return valueFound;
        })
            .filter((value) => !!value)
            .join(mapping.delimiter || ' ');
    }
}
/**
 * Format a number with commas as thousands separators.
 *
 * @param number - The number to be formatted.
 * @returns {string} - The formatted number as a string.
 */
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
/**
 * Format a date or date string. The string is formatted relative to today's date
 * (e.g. 2 days ago) until the date range is greater than a month.
 *
 * @param dateInput - The date to be formatted.
 * @param locale - The language used for formatting the date.
 * @param options - The non-default options used for formatting the date.
 * @returns {string} - The formatted date as a string.
 */
function formatRelativeDate(dateInput, locale = 'en-US', options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
}) {
    const date = new Date(dateInput);
    const now = new Date();
    const diffMillis = now.getTime() - date.getTime();
    const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000; // Approx. 1 month in ms
    if (diffMillis < oneMonthInMillis) {
        const diffSeconds = Math.trunc(diffMillis / 1000);
        const diffMinutes = Math.trunc(diffSeconds / 60);
        const diffHours = Math.trunc(diffMinutes / 60);
        const diffDays = Math.trunc(diffHours / 24);
        const relativeTimeFormat = new Intl.RelativeTimeFormat(locale, options);
        if (diffDays >= 1) {
            return relativeTimeFormat.format(-diffDays, 'day');
        }
        if (diffHours >= 1) {
            return relativeTimeFormat.format(-diffHours, 'hour');
        }
        if (diffMinutes >= 1) {
            return relativeTimeFormat.format(-diffMinutes, 'minute');
        }
        return relativeTimeFormat.format(0, 'second');
    }
    return new Intl.DateTimeFormat(locale, options).format(date);
}
/**
 * Given a date, returns the timestamp (in ms) for the start of the specified unit.
 *
 * @param unit - The unit to calculate the start of ('year' | 'month' | 'day' | 'hour').
 * @param timestamp - The date to evaluate.
 * @param offset - The number of units to offset by.
 * @returns The timestamp (in ms) for the start of the specified unit.
 */
function getStartOf(timestamp, unit, offset = 0) {
    const d = new Date(timestamp);
    switch (unit) {
        case 'year':
            return new Date(d.getFullYear() + offset, 0, 1, 0, 0, 0, 0).getTime();
        case 'month':
            return new Date(d.getFullYear(), d.getMonth() + offset, 1, 0, 0, 0, 0).getTime();
        case 'day':
            return new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset, 0, 0, 0, 0).getTime();
        case 'hour':
            return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + offset, 0, 0, 0).getTime();
        default:
            throw new Error(`Unsupported unit: ${unit}`);
    }
}
/**
 * Given a start and end date, returns the difference in the number of the specified units.
 *
 * @param units - The unit to measure ('year' | 'month' | 'day' | 'hour').
 * @param startDate - The start date.
 * @param endDate - The end date.
 * @returns The difference in the given unit.
 */
function getDifferenceInUnits(unit, startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    switch (unit) {
        case 'year':
            return Math.abs(end.getFullYear() - start.getFullYear());
        case 'month':
            return Math.abs(end.getFullYear() * 12 +
                end.getMonth() -
                (start.getFullYear() * 12 + start.getMonth()));
        case 'day':
            return Math.floor(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        case 'hour':
            return Math.floor(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60));
        default:
            throw new Error(`Unsupported unit: ${unit}`);
    }
}
/**
 * Returns the ordinal representation of a day of the month.
 */
const getOrdinal = (n) => {
    if (n >= 11 && n <= 13)
        return `${n}th`;
    switch (n % 10) {
        case 1:
            return `${n}st`;
        case 2:
            return `${n}nd`;
        case 3:
            return `${n}rd`;
        default:
            return `${n}th`;
    }
};
/**
 * Given a granularity level, returns a formatted, human-readable, date string.
 *
 * @param granularity - The granularity level to display. The granularity level dictates how the date is formatted.
 * @param date - The date to format.
 *
 * @returns A formatted string representing the date at the specified granularity.
 *
 * @example
 * getFormattedDateString('year', new Date('2023-01-01')) // "2023"
 * getFormattedDateString('month', new Date('2023-01-01')) // "Jan 2023"
 * getFormattedDateString('day', new Date('2023-01-31')) // "Jan 31st, 2023"
 * getFormattedDateString('hour', new Date('2023-01-31T12:00:00')) // "Jan 31st, 12:00 PM"
 */
function getFormattedDateString(granularity, date) {
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
    switch (granularity) {
        case 'year':
            return date.getFullYear().toString();
        case 'month':
            return `${monthFormatter.format(date)} ${date.getFullYear()}`;
        case 'day':
            return `${monthFormatter.format(date)} ${getOrdinal(date.getDate())}, ${date.getFullYear()}`;
        case 'hour': {
            const timeFormatter = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
            return `${monthFormatter.format(date)} ${getOrdinal(date.getDate())}, ${timeFormatter.format(date)}`;
        }
        default:
            throw new Error(`Unsupported granularity: ${granularity}`);
    }
}

export { getDifferenceInUnits as a, getStartOf as b, getFormattedDateString as c, formatNumberWithCommas as f, getDocumentValueFromSearchResultMapping as g };
//# sourceMappingURL=units.js.map

//# sourceMappingURL=units.js.map