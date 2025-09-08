import type { SearchcraftCore } from "../../classes/index";
import { type EventEmitter } from '../../stencil-public-runtime';
/**
 * This web component simulates a light switch functionality, providing a simple and intuitive toggle between two states—on and off.
 *
 * @internal
 */
export declare class SearchcraftToggleButton {
    /**
     * The label.
     */
    label: string;
    /**
     * The secondary label displayed below the main label.
     */
    subLabel: string | undefined;
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId?: string;
    /**
     * When the toggle element is changed.
     */
    toggleUpdated?: EventEmitter<boolean>;
    isActive: boolean;
    lastSearchTerm: string | undefined;
    private unsubscribe;
    private cleanupCore?;
    private handleToggle;
    onCoreAvailable(core: SearchcraftCore): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): any;
}
//# sourceMappingURL=searchcraft-toggle-button.d.ts.map