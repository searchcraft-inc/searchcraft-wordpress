/**
 * A data type representing an index field value, along with properties
 * describing how to format and display the index field value.
 */
export type SearchResultFieldName = {
    /**
     * The index field name.
     */
    fieldName: string;
    /**
     * The data type to treat this index field as.
     */
    dataType: 'text' | 'date' | 'number';
    /**
     * The locale to use when formatting dataType: `number`
     */
    numberFormatLocale?: string;
    /**
     * If it's a number, the number format to apply.
     * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
     */
    numberFormatOptions?: Intl.NumberFormatOptions;
    /**
     * A scale factor to apply to a `number` value.
     */
    numberScale?: number;
    /**
     * The locale to use when formatting dataType: `date`.
     */
    dateFormatLocale?: string;
    /**
     * If it's a date, the date format to apply.
     * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
     */
    dateFormatOptions?: Intl.DateTimeFormatOptions;
};
/**
 * A data type representing the mapping of index fields, for the purpose of rendering them
 * in search result item.
 */
export type SearchResultMapping = {
    /**
     * The fields to map to.
     */
    fieldNames: SearchResultFieldName[];
    /**
     * The delimiter used to join them.
     */
    delimiter?: string;
};
export type PopoverResultMappings = {
    title?: SearchResultMapping;
    subtitle?: SearchResultMapping;
    imageSource?: SearchResultMapping;
    imageAlt?: SearchResultMapping;
    href?: SearchResultMapping;
};
//# sourceMappingURL=result-mappings.types.d.ts.map