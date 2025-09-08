import { type EventEmitter } from '../../stencil-public-runtime';
/**
 * This web component represents a button.
 * It provides a clear, interactive way for users to submit search queries or trigger actions in a search interface.
 *
 * @internal
 */
export declare class SearchcraftButton {
    /**
     * Controls the visual representation of the button.
     */
    hierarchy?: 'primary' | 'tertiary';
    /**
     * Whether the button is disabled.
     */
    disabled?: boolean;
    /**
     * The icon element.
     */
    icon?: Element;
    /**
     * Should the button only display an icon.
     */
    iconOnly?: boolean;
    /**
     * The position of the icon.
     */
    iconPosition?: 'left' | 'right';
    /**
     * The label for the button.
     */
    label: string;
    /**
     * The type of the button.
     */
    type?: 'submit' | 'reset' | 'button';
    /**
     * The event fired when the button is clicked.
     */
    buttonClick: EventEmitter<void>;
    private handleButtonClick;
    render(): any;
}
//# sourceMappingURL=searchcraft-button.d.ts.map