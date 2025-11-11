import type { SearchResultMapping } from "../types/index";
/**
 * Given a document and a SearchResultMapping, return a mapped value from the document.
 * Applies formatting based on the values specified in the `SearchResultFieldName` values.
 *
 * @param document
 * @param {SearchResultMapping} mapping
 * @returns {string | undefined}
 */
export declare function getDocumentValueFromSearchResultMapping(document: Record<string, unknown> | undefined, mapping: SearchResultMapping | undefined): string | undefined;
/**
 * Convert different units of time to milliseconds.
 *
 * @param unit - The unit of time
 * @returns {number}
 */
export declare function getMillis(unit: 'year' | 'month' | 'day' | 'hour'): number;
/**
 * Format a number with commas as thousands separators.
 *
 * @param number - The number to be formatted.
 * @returns {string} - The formatted number as a string.
 */
export declare function formatNumberWithCommas(number: any): any;
/**
 * Format a date or date string. The string is formatted relative to today's date
 * (e.g. 2 days ago) until the date range is greater than a month.
 *
 * @param dateInput - The date to be formatted.
 * @param locale - The language used for formatting the date.
 * @param options - The non-default options used for formatting the date.
 * @returns {string} - The formatted date as a string.
 */
export declare function formatRelativeDate(dateInput: string | Date, locale?: string, options?: Intl.DateTimeFormatOptions): string;
/**
 * Given a date, returns the timestamp (in ms) for the start of the specified unit.
 *
 * @param unit - The unit to calculate the start of ('year' | 'month' | 'day' | 'hour').
 * @param timestamp - The date to evaluate.
 * @param offset - The number of units to offset by.
 * @returns The timestamp (in ms) for the start of the specified unit.
 */
export declare function getStartOf(timestamp: number, unit: 'year' | 'month' | 'day' | 'hour', offset?: number): number;
/**
 * Given a start and end date, returns the difference in the number of the specified units.
 *
 * @param units - The unit to measure ('year' | 'month' | 'day' | 'hour').
 * @param startDate - The start date.
 * @param endDate - The end date.
 * @returns The difference in the given unit.
 */
export declare function getDifferenceInUnits(unit: 'year' | 'month' | 'day' | 'hour', startTime: number, endTime: number): number;
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
export declare function getFormattedDateString(granularity: 'year' | 'month' | 'day' | 'hour', date: Date): string;
//# sourceMappingURL=units.d.ts.map