import { p as proxyCustomElement, H, h, t as transformTag } from './index2.js?scv=0.16.0';
import { r as registry } from './CoreInstanceRegistry.js?scv=0.16.0';
import { s as safeUrl, h as html } from './safeUrl.js?scv=0.16.0';
import { c as classNames } from './index3.js?scv=0.16.0';
import { p as purify } from './purify.es.js?scv=0.16.0';
import { d as defineCustomElement$b } from './searchcraft-ad2.js?scv=0.16.0';
import { d as defineCustomElement$a } from './searchcraft-button2.js?scv=0.16.0';
import { d as defineCustomElement$9 } from './searchcraft-error-message2.js?scv=0.16.0';
import { d as defineCustomElement$8 } from './searchcraft-input-form2.js?scv=0.16.0';
import { d as defineCustomElement$7 } from './searchcraft-input-label2.js?scv=0.16.0';
import { d as defineCustomElement$6 } from './searchcraft-loading2.js?scv=0.16.0';
import { d as defineCustomElement$5 } from './searchcraft-popover-footer2.js?scv=0.16.0';
import { d as defineCustomElement$4 } from './searchcraft-popover-list-item2.js?scv=0.16.0';
import { d as defineCustomElement$3 } from './searchcraft-popover-list-view2.js?scv=0.16.0';
import { d as defineCustomElement$2 } from './searchcraft-results-summary2.js?scv=0.16.0';

const SearchcraftPopoverForm$1 = /*@__PURE__*/ proxyCustomElement(class SearchcraftPopoverForm extends H {
    constructor(registerHost) {
        super();
        if (registerHost !== false) {
            this.__registerHost();
        }
    }
    /**
     * The type of popover form to render.
     * - `inline` - Renders inline with the rest of the content on the page. The search results pop over the page content.
     * - `fullscreen` - Renders in fullscreen view. Used together with the `searchcraft-popover-button` component.
     * - `modal` - Renders in a modal view. Used together with the `searchcraft-popover-button` component.
     */
    type = 'inline';
    /**
     * Formats the content rendered for each result.
     */
    popoverResultMappings;
    /**
     * A callback function responsible for rendering a result. When provided, it is used instead of `popoverResultMappings`.
     * Pass URLs from the result through the `safeUrl` helper before placing them in an `href` or `src`.
     * Never place result values in event handler attributes such as `onclick`, or in `style`.
     */
    template;
    /**
     * A callback function responsible for rendering the message shown when a search returns no results.
     * When it is not provided, the popover shows `No results found for "<search term>".`
     * The returned markup is sanitized with DOMPurify, which removes scripts, event handler
     * attributes such as `onclick`, and links with schemes it does not allow, such as an app's own scheme.
     */
    noResultsTemplate;
    /**
     * The hotkey that activates the popover.
     */
    hotkey = 'k';
    /**
     * The hotkey modifier that activates the popover. Used together with the `hotkey` prop.
     */
    hotkeyModifier = 'meta';
    /**
     * The id of the Searchcraft instance that this component should use.
     */
    searchcraftId;
    /**
     * The input element's placeholder value.
     */
    placeholderValue = 'Enter Search';
    /**
     * The placeholder's render behavior.
     * 'hide-on-focus' - Hide the placeholder text immediately when the input form gains focus.
     * 'hide-on-text-entered' - Only hide the placeholder when the input form has text entered into it.
     */
    placeholderBehavior;
    /**
     * Base URL for the "View all" footer link. The current search term will be appended (URL encoded).
     *
     * For example, in a CMS-backed site you might set this to `/?s=` so the final URL becomes `/?s=<search-term>`.
     */
    viewAllResultsBaseUrl;
    /**
     * Optional label for the "View All" footer button. Defaults to "View All".
     */
    viewAllResultsLabel;
    /**
     * Whether to display the AI generative summary box before the search results.
     * NOTE: This requires the usage of a read key that has "SUMMARY" permissions and either a subscription to Searchcraft Cloud with AI features enabled or a self-hosted model connected.
     */
    showSummaryBox = false;
    /**
     * The SDK variant used to render this component. Used for UTM attribution on the footer link.
     *
     * @internal
     */
    sdkVariant = 'js';
    isPopoverVisibleInState = false;
    searchClientResponseItems = [];
    adClientResponseItems = [];
    searchTerm;
    isSearchInProgress = false;
    /**
     * The search term of the most recent search response.
     */
    completedSearchTerm;
    isFocused = false;
    breakpointSm = 576;
    breakpointMd = 768;
    breakpointLg = 992;
    searchResultsPage;
    searchResultsPerPage;
    modalElement;
    get hostElement() { return this; }
    unsubscribe;
    cleanupCore;
    core;
    onCoreAvailable(core) {
        this.core = core;
        // Loads the breakpoint values into state
        const computedStyle = getComputedStyle(document.documentElement);
        this.breakpointSm = Number.parseFloat(computedStyle.getPropertyValue('--sc-breakpoint-sm').trim());
        this.breakpointMd = Number.parseFloat(computedStyle.getPropertyValue('--sc-breakpoint-md').trim());
        this.breakpointLg = Number.parseFloat(computedStyle.getPropertyValue('--sc-breakpoint-lg').trim());
        // Set popover visiblity in state
        this.isPopoverVisibleInState = core.store.getState().isPopoverVisible;
        // Add event listeners
        document.addEventListener('click', this.handleDocumentClick);
        document.addEventListener('keydown', this.handleDocumentKeyDown);
        // Subscribe to state events
        this.unsubscribe = core.store.subscribe((state) => {
            if (this.isPopoverVisibleInState !== state.isPopoverVisible) {
                this.handlePopoverVisibilityChange(state.isPopoverVisible);
            }
            this.searchClientResponseItems = [...state.searchClientResponseItems];
            this.adClientResponseItems = [...state.adClientResponseItems];
            this.searchTerm = state.searchTerm;
            this.isSearchInProgress = state.isSearchInProgress;
            const requestProperties = state.searchClientRequestProperties;
            this.completedSearchTerm =
                requestProperties && typeof requestProperties === 'object'
                    ? requestProperties.searchTerm
                    : undefined;
            this.searchResultsPage = state.searchResultsPage;
            this.searchResultsPerPage = state.searchResultsPerPage;
        });
        // Set hotkey and hotkeyModifier in state.
        core.store
            .getState()
            .setHotKeyAndHotKeyModifier(this.hotkey, this.hotkeyModifier);
    }
    connectedCallback() {
        this.cleanupCore = registry.useCoreInstance(this.searchcraftId, this.onCoreAvailable.bind(this));
    }
    disconnectedCallback() {
        this.unsubscribe?.();
        this.cleanupCore?.();
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('keydown', this.handleDocumentKeyDown);
    }
    handleDocumentClick = (event) => {
        if (!this.hostElement.contains(event.target)) {
            this.isFocused = false;
        }
    };
    /**
     * Handles when popover visibility is changed in state
     */
    handlePopoverVisibilityChange(isVisible) {
        this.isPopoverVisibleInState = isVisible;
        document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    }
    /**
     * Actions to perform when various keys are pressed within the popover form.
     */
    handleDocumentKeyDown = (event) => {
        // Document-scoped actions
        if (event.key === this.hotkey) {
            this.handleHotkeyPressed(event);
        }
        // Document-scoped -> Popover-scoped keyboard event boundary
        if (!this.hostElement.contains(document.activeElement)) {
            return;
        }
        // Popover-scoped actions
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault();
                this.focusOnNextListItem(event.key);
                break;
            case 'Escape':
                this.core?.store.getState().setPopoverVisibility(false);
                break;
            case 'Enter':
                if ((event.metaKey || event.ctrlKey) &&
                    this.viewAllResultsHref &&
                    this.hasResultsToShow) {
                    event.preventDefault();
                    this.navigateToViewAllResults();
                }
                break;
            default:
                return;
        }
    };
    handleInputInit = () => {
        const input = this.hostElement.querySelector('.searchcraft-input-form-input');
        input?.focus();
    };
    /**
     * When popover is `inline` and the viewport is at the smallest breakpoint,
     * focusing on the input will open a modal version of the popover form.
     */
    handleInputFocus() {
        this.isFocused = true;
        if (this.type === 'inline' &&
            window.visualViewport &&
            window.visualViewport.width < this.breakpointSm) {
            this.core?.store.getState().setPopoverVisibility(true);
            // Appends a popover form of type=`modal` to the body
            if (!this.modalElement) {
                this.modalElement = document.createElement('searchcraft-popover-form');
                this.modalElement.popoverResultMappings = this.popoverResultMappings;
                this.modalElement.template = this.template;
                this.modalElement.noResultsTemplate = this.noResultsTemplate;
                this.modalElement.setAttribute('type', 'fullscreen');
                this.modalElement.setAttribute('searchcraft-id', this.searchcraftId);
                if (this.placeholderValue) {
                    this.modalElement.setAttribute('placeholder-value', this.placeholderValue);
                }
                if (this.placeholderBehavior) {
                    this.modalElement.setAttribute('placeholder-behavior', this.placeholderBehavior);
                }
                if (this.viewAllResultsBaseUrl) {
                    this.modalElement.setAttribute('view-all-results-base-url', this.viewAllResultsBaseUrl);
                }
                if (this.viewAllResultsLabel) {
                    this.modalElement.setAttribute('view-all-results-label', this.viewAllResultsLabel);
                }
                document.body.appendChild(this.modalElement);
            }
        }
    }
    /**
     * Passes result rendering changes on to the fullscreen form created for small viewports,
     * which only receives these props when it is first created.
     */
    syncModalElementResultRendering() {
        if (this.modalElement) {
            this.modalElement.popoverResultMappings = this.popoverResultMappings;
            this.modalElement.template = this.template;
            this.modalElement.noResultsTemplate = this.noResultsTemplate;
        }
    }
    handleModalBackdropClick(_event) {
        this.core?.store.getState().setPopoverVisibility(false);
    }
    /**
     * When a hotkey is pressed, tests if the modifiers also match.
     * If modifiers match, toggles visibility of the popover modal.
     */
    handleHotkeyPressed(event) {
        if ((event.ctrlKey && this.hotkeyModifier === 'ctrl') ||
            (event.altKey && this.hotkeyModifier === 'alt') ||
            (event.metaKey && this.hotkeyModifier === 'meta')) {
            event.preventDefault();
            if (this.type === 'inline' && !this.isPopoverVisibleInState) {
                const hostElementInput = this.hostElement.querySelector('.searchcraft-input-form-input');
                hostElementInput?.focus();
            }
            else {
                this.core?.store
                    .getState()
                    .setPopoverVisibility(!this.isPopoverVisibleInState);
            }
        }
    }
    handleCancelButtonClick() {
        this.core?.store.getState().setPopoverVisibility(false);
    }
    /**
     * Moves focus to the next/previous list item in the list view. If you are at the top
     * of the list view, it moves focus back to the input.
     *
     * @param direction
     */
    focusOnNextListItem(direction) {
        // Results rendered by a `template` are reached through the first link in the template.
        const links = Array.from(document.querySelectorAll('.searchcraft-popover-list-item-link, .searchcraft-popover-list-item-template')).map((el) => el.classList.contains('searchcraft-popover-list-item-template')
            ? el.querySelector('a')
            : el);
        const listItems = Array.from(new Set(links)).filter((el) => !!el && !el.hasAttribute('disabled') && el.offsetParent !== null);
        // Focus may be on another link inside a templated result, so match on the result too.
        const activeElement = document.activeElement;
        const currentIndex = listItems.findIndex((el) => el === activeElement ||
            !!el
                .closest('.searchcraft-popover-list-item-template')
                ?.contains(activeElement));
        if (direction === 'ArrowDown') {
            listItems[(currentIndex + 1) % listItems.length]?.focus();
        }
        else if (direction === 'ArrowUp') {
            if (currentIndex >= 1) {
                listItems[currentIndex - 1]?.focus();
            }
            else {
                const input = document.querySelector('.searchcraft-input-form-input');
                if (input) {
                    input.focus();
                    requestAnimationFrame(() => {
                        input.selectionEnd = input.value.length;
                        input.selectionStart = input.value.length;
                    });
                }
            }
        }
    }
    get hasResultsToShow() {
        return (this.searchTerm &&
            this.searchTerm?.trim()?.length > 0 &&
            this.searchClientResponseItems.length > 0);
    }
    /**
     * Whether the search for the current search term finished without results.
     */
    get hasNoResultsToShow() {
        const searchTerm = this.searchTerm?.trim();
        return (!!searchTerm &&
            !this.isSearchInProgress &&
            this.searchClientResponseItems.length === 0 &&
            this.completedSearchTerm?.trim() === searchTerm);
    }
    renderNoResults() {
        const searchTerm = this.searchTerm?.trim() || '';
        if (this.noResultsTemplate) {
            try {
                return (h("div", { class: 'searchcraft-popover-form-no-results', innerHTML: purify.sanitize(this.noResultsTemplate({ searchTerm }, { html, safeUrl })) }));
            }
            catch (error) {
                console.error('Invalid popover no results template:', error);
            }
        }
        return (h("div", { class: 'searchcraft-popover-form-no-results' }, h("p", { class: 'searchcraft-popover-form-no-results-message' }, "No results found for \"", searchTerm, "\".")));
    }
    get viewAllResultsHref() {
        const baseUrl = this.viewAllResultsBaseUrl;
        if (!baseUrl) {
            return undefined;
        }
        const term = this.searchTerm?.trim();
        if (!term) {
            return baseUrl;
        }
        return `${baseUrl}${encodeURIComponent(term).replace(/%20/g, '+')}`;
    }
    get resolvedViewAllResultsLabel() {
        return this.viewAllResultsLabel ?? 'View All';
    }
    navigateToViewAllResults() {
        const href = this.viewAllResultsHref;
        if (!href || !this.hasResultsToShow) {
            return;
        }
        if (typeof window !== 'undefined') {
            window.location.href = href;
        }
    }
    renderInlinePopover() {
        const isListViewVisible = this.hasResultsToShow && this.isFocused;
        const isNoResultsVisible = this.hasNoResultsToShow && this.isFocused;
        const isDropdownVisible = isListViewVisible || isNoResultsVisible;
        return (h("div", { class: classNames('searchcraft-popover-form searchcraft-popover-form-inline', {
                'searchcraft-popover-form-active': isDropdownVisible,
            }) }, h("div", { class: 'searchcraft-popover-form-input searchcraft-popover-form-inline-input' }, h("searchcraft-input-form", { onInputFocus: this.handleInputFocus.bind(this), searchcraftId: this.searchcraftId, placeholderValue: this.placeholderValue, placeholderBehavior: this.placeholderBehavior })), isDropdownVisible && (h("div", { class: 'searchcraft-popover-form-inline-wrapper' }, h("div", { class: 'searchcraft-popover-form-inline-scroll-area' }, isListViewVisible && this.showSummaryBox && (h("searchcraft-results-summary", { searchcraftId: this.searchcraftId })), isListViewVisible ? (h("searchcraft-popover-list-view", { popoverResultMappings: this.popoverResultMappings, template: this.template, searchClientResponseItems: this.searchClientResponseItems, adClientResponseItems: this.adClientResponseItems, searchResultsPage: this.searchResultsPage, searchResultsPerPage: this.searchResultsPerPage, searchcraftId: this.searchcraftId })) : (this.renderNoResults())), h("searchcraft-popover-footer", { searchcraftId: this.searchcraftId, sdkVariant: this.sdkVariant, viewAllResultsHref: this.viewAllResultsHref, viewAllResultsLabel: this.resolvedViewAllResultsLabel })))));
    }
    renderModalPopover() {
        if (this.isPopoverVisibleInState) {
            return (h("div", { class: classNames('searchcraft-popover-form searchcraft-popover-form-modal', {
                    'searchcraft-popover-form-active': this.hasResultsToShow || this.hasNoResultsToShow,
                }) }, h("div", { class: 'searchcraft-popover-form-modal-backdrop', onClick: this.handleModalBackdropClick }), h("div", { class: 'searchcraft-popover-form-modal-wrapper' }, h("div", { class: 'searchcraft-popover-form-input searchcraft-popover-form-modal-input' }, h("searchcraft-input-form", { onInputFocus: this.handleInputFocus.bind(this), onInputInit: this.handleInputInit.bind(this), searchcraftId: this.searchcraftId, placeholderValue: this.placeholderValue, placeholderBehavior: this.placeholderBehavior }), h("button", { type: 'button', class: 'searchcraft-popover-form-cancel-button searchcraft-popover-form-modal-cancel-button', onClick: this.handleCancelButtonClick.bind(this) }, "Cancel")), h("div", { class: 'searchcraft-popover-form-modal-popover-list-view' }, this.showSummaryBox && this.hasResultsToShow && (h("searchcraft-results-summary", { searchcraftId: this.searchcraftId })), this.hasResultsToShow && (h("searchcraft-popover-list-view", { popoverResultMappings: this.popoverResultMappings, template: this.template, searchClientResponseItems: this.searchClientResponseItems, adClientResponseItems: this.adClientResponseItems, searchResultsPage: this.searchResultsPage, searchResultsPerPage: this.searchResultsPerPage, searchcraftId: this.searchcraftId })), this.hasNoResultsToShow && this.renderNoResults()), h("searchcraft-popover-footer", { searchcraftId: this.searchcraftId, sdkVariant: this.sdkVariant, viewAllResultsHref: this.viewAllResultsHref, viewAllResultsLabel: this.resolvedViewAllResultsLabel }))));
        }
    }
    renderFullscreenPopover() {
        if (this.isPopoverVisibleInState) {
            return (h("div", { class: classNames('searchcraft-popover-form searchcraft-popover-form-fullscreen', {
                    'searchcraft-popover-form-active': this.hasResultsToShow || this.hasNoResultsToShow,
                }) }, h("div", { class: 'searchcraft-popover-form-input searchcraft-popover-form-fullscreen-input' }, h("searchcraft-input-form", { onInputFocus: this.handleInputFocus.bind(this), onInputInit: this.handleInputInit.bind(this), searchcraftId: this.searchcraftId, placeholderValue: this.placeholderValue, placeholderBehavior: this.placeholderBehavior }), h("button", { type: 'button', class: 'searchcraft-popover-form-cancel-button searchcraft-popover-form-fullscreen-cancel-button', onClick: this.handleCancelButtonClick.bind(this) }, "Cancel")), h("div", { class: 'searchcraft-popover-form-fullscreen-popover-list-view' }, this.showSummaryBox && this.hasResultsToShow && (h("searchcraft-results-summary", { searchcraftId: this.searchcraftId })), this.hasResultsToShow && (h("searchcraft-popover-list-view", { popoverResultMappings: this.popoverResultMappings, template: this.template, searchClientResponseItems: this.searchClientResponseItems, adClientResponseItems: this.adClientResponseItems, searchResultsPage: this.searchResultsPage, searchResultsPerPage: this.searchResultsPerPage, searchcraftId: this.searchcraftId })), this.hasNoResultsToShow && this.renderNoResults()), h("searchcraft-popover-footer", { searchcraftId: this.searchcraftId, sdkVariant: this.sdkVariant, viewAllResultsHref: this.viewAllResultsHref, viewAllResultsLabel: this.resolvedViewAllResultsLabel })));
        }
    }
    render() {
        switch (this.type) {
            case 'inline':
                return this.renderInlinePopover();
            case 'modal':
                return this.renderModalPopover();
            case 'fullscreen':
                return this.renderFullscreenPopover();
        }
    }
    static get watchers() { return {
        "popoverResultMappings": ["syncModalElementResultRendering"],
        "template": ["syncModalElementResultRendering"],
        "noResultsTemplate": ["syncModalElementResultRendering"]
    }; }
}, [768, "searchcraft-popover-form", {
        "type": [1],
        "popoverResultMappings": [16],
        "template": [16],
        "noResultsTemplate": [16],
        "hotkey": [1],
        "hotkeyModifier": [1, "hotkey-modifier"],
        "searchcraftId": [1, "searchcraft-id"],
        "placeholderValue": [1, "placeholder-value"],
        "placeholderBehavior": [1, "placeholder-behavior"],
        "viewAllResultsBaseUrl": [1, "view-all-results-base-url"],
        "viewAllResultsLabel": [1, "view-all-results-label"],
        "showSummaryBox": [4, "show-summary-box"],
        "sdkVariant": [1, "sdk-variant"],
        "isPopoverVisibleInState": [32],
        "searchClientResponseItems": [32],
        "adClientResponseItems": [32],
        "searchTerm": [32],
        "isSearchInProgress": [32],
        "completedSearchTerm": [32],
        "isFocused": [32],
        "breakpointSm": [32],
        "breakpointMd": [32],
        "breakpointLg": [32],
        "searchResultsPage": [32],
        "searchResultsPerPage": [32],
        "modalElement": [32]
    }, undefined, {
        "popoverResultMappings": ["syncModalElementResultRendering"],
        "template": ["syncModalElementResultRendering"],
        "noResultsTemplate": ["syncModalElementResultRendering"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["searchcraft-popover-form", "searchcraft-ad", "searchcraft-button", "searchcraft-error-message", "searchcraft-input-form", "searchcraft-input-label", "searchcraft-loading", "searchcraft-popover-footer", "searchcraft-popover-form", "searchcraft-popover-list-item", "searchcraft-popover-list-view", "searchcraft-results-summary"];
    components.forEach(tagName => { switch (tagName) {
        case "searchcraft-popover-form":
            if (!customElements.get(transformTag(tagName))) {
                customElements.define(transformTag(tagName), SearchcraftPopoverForm$1);
            }
            break;
        case "searchcraft-ad":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$b();
            }
            break;
        case "searchcraft-button":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$a();
            }
            break;
        case "searchcraft-error-message":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$9();
            }
            break;
        case "searchcraft-input-form":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$8();
            }
            break;
        case "searchcraft-input-label":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$7();
            }
            break;
        case "searchcraft-loading":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$6();
            }
            break;
        case "searchcraft-popover-footer":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$5();
            }
            break;
        case "searchcraft-popover-form":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$1();
            }
            break;
        case "searchcraft-popover-list-item":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$4();
            }
            break;
        case "searchcraft-popover-list-view":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$3();
            }
            break;
        case "searchcraft-results-summary":
            if (!customElements.get(transformTag(tagName))) {
                defineCustomElement$2();
            }
            break;
    } });
}

const SearchcraftPopoverForm = SearchcraftPopoverForm$1;
const defineCustomElement = defineCustomElement$1;

export { SearchcraftPopoverForm, defineCustomElement };
//# sourceMappingURL=searchcraft-popover-form.js.map

//# sourceMappingURL=searchcraft-popover-form.js.map