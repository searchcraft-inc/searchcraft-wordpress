import { SearchcraftCore } from "./classes/index";
import type { SearchcraftConfig } from "./types/index";
/**
 * @fileoverview entry point for your component library
 *
 * This is the entry point for your component library. Use this file to export utilities,
 * constants or data structure that accompany your components.
 *
 * DO NOT use this file to export your components. Instead, use the recommended approaches
 * to consume components of this package as outlined in the `README.md`.
 */
/**
 * The consumer-facing `Searchcraft` class.
 */
export declare class Searchcraft extends SearchcraftCore {
    constructor(config: SearchcraftConfig, searchcraftId?: string | undefined);
}
/**
 * Exports the shared types that all SDKs need
 */
export type { SearchcraftConfig };
export type { Components, JSX } from './components';
export { SearchcraftCore };
export type * from '@types';
//# sourceMappingURL=index.d.ts.map