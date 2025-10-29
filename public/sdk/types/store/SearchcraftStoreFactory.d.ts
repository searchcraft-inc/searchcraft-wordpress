import { type StoreApi } from 'zustand';
import type { SearchcraftState, SearchcraftStateValues } from './SearchcraftStore.types';
/**
 * This is a factory function for creating new searchcraft stores.
 *
 * Searchcraft Stores contain the state information used by a SearchcraftCore instance.
 *
 * This factory function only needs to be called when a new SearchcraftCore is instantiated.
 * @returns
 */
declare const createSearchcraftStore: (searchcraftId: string | undefined, initialState?: Partial<SearchcraftStateValues>) => StoreApi<SearchcraftState>;
export { createSearchcraftStore };
//# sourceMappingURL=SearchcraftStoreFactory.d.ts.map