import type { SearchcraftCore } from "../../classes/index";
import type { ResultsInfoTemplate } from "../../types/index";
/**
 * This web component is designed to display the number of results returned from a search query.
 *
 * @react-import
 * ```jsx
 * import { SearchcraftResultsInfo } from "@searchcraft/react-sdk";
 * ```
 *
 * @vue-import
 * ```jsx
 * import { SearchcraftResultsInfo } from "@searchcraft/vue-sdk";
 * ```
 *
 * @js-example
 * ```html
 * <!-- index.html -->
 * <searchcraft-results-info />
 * ```
 *
 * ```js
 * // index.js
 * const resultsInfo = document.querySelector('searchcraft-results-info');
 *
 * resultsInfo.template = (info, { html }) => html`
 *   ${info.range[0]}-${info.range[1]} of ${info.count} results in ${info.responseTime}ms
 * `;
 * ```
 *
 * @react-example
 * ```jsx
 * <SearchcraftResultsInfo
 *   template={(info, { html }) => html`
 *     ${info.range[0]}-${info.range[1]} of ${info.count} results in ${info.responseTime}ms
 *   `}
 * />
 * ```
 *
 * @vue-example
 * ```jsx
 * <SearchcraftResultsInfo
 *   :template={(info, { html }) => html`
 *     ${info.range[0]}-${info.range[1]} of ${info.count} results in ${info.responseTime}ms
 *   `}
 * />
 * ```
 */
export declare class SearchcraftResultsInfo {
    /**
     * A callback function responsible for rendering the results info.
     */
    template?: ResultsInfoTemplate;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    searchTerm: any;
    searchResultsPage: any;
    searchResultsPerPage: any;
    searchResultsCount: any;
    count: number;
    range: number[];
    responseTime: string;
    unsubscribe: () => void;
    private cleanupCore?;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): any;
}
//# sourceMappingURL=searchcraft-results-info.d.ts.map