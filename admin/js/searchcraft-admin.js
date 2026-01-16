/**
 * Searchcraft Admin JavaScript
 *
 * @package Searchcraft
 * @since 1.0.0
 */


/**
 * Initialize color picker functionality
 */
function initColorPickers() {
	const colorPickers = document.querySelectorAll('.searchcraft-color-picker');

	colorPickers.forEach((colorPicker) => {
		const hexInput = document.getElementById(`${colorPicker.id}_hex`);

		if (hexInput) {
			// Sync color picker to hex input
			colorPicker.addEventListener('input', () => {
				hexInput.value = colorPicker.value.toUpperCase();
			});

			// Sync hex input to color picker
			hexInput.addEventListener('input', () => {
				if (/^#[0-9A-Fa-f]{6}$/.test(hexInput.value)) {
					colorPicker.value = hexInput.value;
				}
			});

			// Use hex input value for form submission
			const form = colorPicker.closest('form');
			if (form) {
				form.addEventListener('submit', () => {
					colorPicker.name = '';
					hexInput.name = colorPicker.id;
				});
			}
		}
	});
}

/**
 * Initialize password toggle functionality
 */
function initPasswordToggle() {
	const toggleElements = document.querySelectorAll('[data-toggle-password-visibility]');

	toggleElements.forEach((element) => {
		const input = element.querySelector('input:not([type="hidden"])');
		const button = element.querySelector('button');

		if (input && button) {
			button.addEventListener('click', () => {
				const isVisible = input.type !== 'password';

				// Toggle aria-label
				button.setAttribute('aria-label', isVisible ? 'Show' : 'Hide');

				// Toggle icon class on first child
				const icon = button.firstElementChild;
				if (icon) {
					icon.classList.toggle('dashicons-visibility');
					icon.classList.toggle('dashicons-hidden');
				}

				// Toggle input type
				input.type = isVisible ? 'password' : 'text';
			});
		}
	});
}

/**
 * Initialize button with spinner functionality
 * Handles all forms that contain .searchcraft-button-with-spinner elements
 */
function initButtonWithSpinner() {
	const buttonContainers = document.querySelectorAll('.searchcraft-button-with-spinner');

	buttonContainers.forEach((container) => {
		// Find the form that contains this button container
		const form = container.closest('form');

		if (!form) {
			return;
		}

		// Find the button and spinner within this container
		const button = container.querySelector('input[type="submit"], button[type="submit"]');
		const spinner = container.querySelector('.searchcraft-spinner');

		if (button && spinner) {
			// Add submit event listener to the form
			form.addEventListener('submit', () => {
				// Disable the button and show spinner
				button.disabled = true;
				button.style.display = 'none';
				spinner.style.display = 'inline-block';
			});
		}
	});
}
// Layout tab form toggling
function toggleFormFields() {
	const fullRadio = document.querySelector('input[name="searchcraft_search_experience"][value="full"]');
	const fullOnlyRows = document.querySelectorAll('.searchcraft-full-only');
	const popoverOnlyRows = document.querySelectorAll('.searchcraft-popover-only');

	const isFullSelected = fullRadio?.checked ?? false;

	// Show/hide full experience fields
	fullOnlyRows.forEach((row) => {
		row.classList.toggle('hidden', !isFullSelected);
	});

	// Show/hide popover fields
	popoverOnlyRows.forEach((row) => {
		row.classList.toggle('hidden', isFullSelected);
	});
}

/**
 * Toggle filter panel options visibility
 */
function toggleFilterPanelOptions() {
	const filterPanelCheckbox = document.getElementById('searchcraft_include_filter_panel');
	const filterPanelOptions = document.querySelector('.searchcraft-filter-panel-options');

	if (filterPanelCheckbox && filterPanelOptions) {
		filterPanelOptions.style.display = filterPanelCheckbox.checked ? '' : 'none';
	}
}

/**
 * Helper function to escape HTML
 */
function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

/**
 * Update search input container description and UI mode based on search behavior
 */
function updateSearchInputContainerDescription() {
	const standAloneRadio = document.querySelector('input[name="searchcraft_search_behavior"][value="stand_alone"]');
	const inputContainerDescription = document.querySelector('.searchcraft-container-id-wrapper + .description');
	const containerWrapper = document.querySelector('.searchcraft-container-id-wrapper');

	if (!standAloneRadio || !inputContainerDescription || !containerWrapper) {
		return;
	}

	const isStandAlone = standAloneRadio.checked;
	const tagsContainer = containerWrapper.querySelector('.searchcraft-container-id-tags');
	const mainInput = containerWrapper.querySelector('#searchcraft_search_input_container_id');

	if (isStandAlone) {
		// Switch to multi-ID tag mode
		containerWrapper.classList.remove('single-mode');
		inputContainerDescription.innerHTML = 'If specified, the search box input form will load as the first element inside of the HTML element that matches this <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/id" target="_blank">ID</a>. <strong>Multiple IDs supported:</strong> When "Submit to Search Page" is selected, you can add multiple element IDs to display the search input in multiple locations. Leave empty to use the default auto-detection behavior.';

		// Populate tags from the text input value
		if (tagsContainer && mainInput && mainInput.value.trim()) {
			tagsContainer.innerHTML = '';

			const ids = mainInput.value.split(',').map(id => id.trim()).filter(id => id !== '');
			ids.forEach(id => {
				const tag = document.createElement('span');
				tag.className = 'searchcraft-tag';
				tag.innerHTML = `
					<span class="searchcraft-tag-text">${escapeHtml(id)}</span>
					<button type="button" class="searchcraft-tag-remove" aria-label="Remove ${escapeHtml(id)}">×</button>
				`;

				// Attach remove handler to the new tag
				const removeButton = tag.querySelector('.searchcraft-tag-remove');
				removeButton?.addEventListener('click', () => {
					tag.remove();
					updateMainInputFromTags();
				});

				tagsContainer.appendChild(tag);
			});

			mainInput.value = ids.join(',');
		}
	} else {
		// Switch to single-ID text input mode
		containerWrapper.classList.add('single-mode');
		inputContainerDescription.innerHTML = 'If specified, the search box input form will load as the first element inside of the HTML element that matches this <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/id" target="_blank">ID</a>. Note: this element must be present on every page you want the search input to appear on. Leave empty to use the default auto-detection behavior.';

		// Sync only the first tag value to the text input
		if (tagsContainer && mainInput) {
			const firstTag = tagsContainer.querySelector('.searchcraft-tag-text');
			mainInput.value = firstTag?.textContent.trim() ?? '';
		}
	}
}

/**
 * Update main input value from tags
 */
function updateMainInputFromTags() {
	const wrapper = document.querySelector('.searchcraft-container-id-wrapper');
	if (!wrapper) return;

	const tagsContainer = wrapper.querySelector('.searchcraft-container-id-tags');
	const mainInput = wrapper.querySelector('#searchcraft_search_input_container_id');

	if (tagsContainer && mainInput) {
		const tags = Array.from(tagsContainer.querySelectorAll('.searchcraft-tag-text'))
			.map(tag => tag.textContent?.trim() ?? '')
			.filter(text => text !== '');
		mainInput.value = tags.join(',');
	}
}

/**
 * Initialize container ID tag UI
 */
function initContainerIdTagUI() {
	const wrapper = document.querySelector('.searchcraft-container-id-wrapper');
	if (!wrapper) {
		return;
	}

	const inputArea = wrapper.querySelector('.searchcraft-container-id-input-area');
	const tagsContainer = wrapper.querySelector('.searchcraft-container-id-tags');
	const input = wrapper.querySelector('.searchcraft-container-id-input');
	const mainInput = wrapper.querySelector('#searchcraft_search_input_container_id');

	if (!inputArea || !tagsContainer || !input || !mainInput) {
		return;
	}

	// Validate element ID format
	function isValidElementId(id) {
		// HTML ID must start with a letter and can contain letters, digits, hyphens, and underscores
		return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(id);
	}

	// Add a new tag
	function addTag(text) {
		text = text.trim();

		if (!text) {
			return false;
		}

		// Validate element ID
		if (!isValidElementId(text)) {
			input.style.borderColor = '#d63638';
			setTimeout(() => {
				input.style.borderColor = '';
			}, 1000);
			return false;
		}

		// Check for duplicates
		const existingTags = Array.from(tagsContainer.querySelectorAll('.searchcraft-tag-text'))
			.map(tag => tag.textContent?.trim() ?? '');

		if (existingTags.includes(text)) {
			return false;
		}

		// Create tag element
		const tag = document.createElement('span');
		tag.className = 'searchcraft-tag';
		tag.innerHTML = `
			<span class="searchcraft-tag-text">${escapeHtml(text)}</span>
			<button type="button" class="searchcraft-tag-remove" aria-label="Remove ${escapeHtml(text)}">×</button>
		`;

		// Attach remove handler
		const removeButton = tag.querySelector('.searchcraft-tag-remove');
		removeButton?.addEventListener('click', () => {
			tag.remove();
			updateMainInputFromTags();
			input.focus();
		});

		tagsContainer.appendChild(tag);
		updateMainInputFromTags();
		return true;
	}

	// Handle keyboard input
	input.addEventListener('keydown', (e) => {
		const value = input.value.trim();

		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			if (addTag(value)) {
				input.value = '';
			}
		} else if (e.key === 'Backspace' && value === '') {
			// Backspace on empty input removes last tag
			const tags = tagsContainer.querySelectorAll('.searchcraft-tag');
			if (tags.length > 0) {
				tags[tags.length - 1].remove();
				updateMainInputFromTags();
			}
		}
	});

	// Handle paste with comma-separated values
	input.addEventListener('paste', (e) => {
		e.preventDefault();
		const pastedText = e.clipboardData?.getData('text') ?? '';
		const ids = pastedText.split(/[,\s]+/).filter(id => id.trim() !== '');

		ids.forEach((id) => {
			addTag(id);
		});

		input.value = '';
	});

	// Click on input area to focus the input field
	inputArea.addEventListener('click', (e) => {
		if (e.target === inputArea || e.target === tagsContainer) {
			input.focus();
		}
	});

	// Attach remove handlers to existing tags (from server-rendered HTML)
	tagsContainer.querySelectorAll('.searchcraft-tag-remove').forEach((button) => {
		button.addEventListener('click', () => {
			button.closest('.searchcraft-tag')?.remove();
			updateMainInputFromTags();
		});
	});
}

/**
 * Toggle facets options visibility
 */
function toggleFacetsOptions() {
	const facetsCheckbox = document.getElementById('searchcraft_enable_facets');
	const facetsOptions = document.querySelector('.searchcraft-facets-options');

	if (facetsCheckbox && facetsOptions) {
		facetsOptions.style.display = facetsCheckbox.checked ? '' : 'none';
	}
}

/**
 * Toggle AI summary banner text visibility
 */
function toggleAiSummaryLayout() {
	const aiSummaryCheckbox = document.getElementById('searchcraft_enable_ai_summary');
	const aiSummarySettings = document.querySelectorAll('.searchcraft-ai-summary-row');

	if (!aiSummaryCheckbox || !aiSummarySettings) {
		return;
	}
	const isChecked = aiSummaryCheckbox.checked;
	aiSummarySettings.forEach((element) => {
		element.style.display = isChecked ? '' : 'none';
	});
}

/**
 * Toggle column orientation options visibility
 * Hides options when grid is selected, shows them when column is selected
 */
function toggleResultOrientationOptions() {
	const columnRadio = document.querySelector('input[name="searchcraft_result_orientation"][value="column"]');
	const columnOrientationOptions = document.querySelectorAll('.searchcraft-column-orientation-option');

	if (!columnRadio || !columnOrientationOptions.length) {
		return;
	}

	const isColumnSelected = columnRadio.checked;

	columnOrientationOptions.forEach((element) => {
		element.style.display = isColumnSelected ? '' : 'none';
	});
}

/**
 * Toggle custom fields option visibility for custom post types
 */
function toggleCustomFieldsOption(checkbox) {
	const postType = checkbox.getAttribute('data-post-type');
	const customFieldsOption = document.querySelector(`.searchcraft-custom-fields-option[data-post-type="${postType}"]`);

	if (customFieldsOption) {
		const customFieldsCheckbox = customFieldsOption.querySelector('input[type="checkbox"]');

		if (checkbox.checked) {
			customFieldsOption.style.display = '';
		} else {
			customFieldsOption.style.display = 'none';
			if (customFieldsCheckbox) {
				customFieldsCheckbox.checked = false;
			}
		}
	}
}

/**
 * Initialize custom post type checkboxes
 */
function initCustomPostTypeCheckboxes() {
	const customPostTypeCheckboxes = document.querySelectorAll('.searchcraft-custom-post-type-checkbox');

	customPostTypeCheckboxes.forEach((checkbox) => {
		// Set initial state
		toggleCustomFieldsOption(checkbox);

		// Add event listener
		checkbox.addEventListener('change', () => {
			toggleCustomFieldsOption(checkbox);
		});
	});
}

/**
 * Initialize excerpt override custom dropdowns
 */
function initExcerptOverrideInputs() {
	const wrappers = document.querySelectorAll('.searchcraft-excerpt-select-wrapper');

	wrappers.forEach((wrapper) => {
		const input = wrapper.querySelector('.searchcraft-excerpt-override-input');
		const hiddenInput = wrapper.querySelector('.searchcraft-excerpt-override-value');
		const toggleBtn = wrapper.querySelector('.searchcraft-excerpt-toggle-btn');
		const clearBtn = wrapper.querySelector('.searchcraft-excerpt-clear-btn');
		const dropdown = wrapper.querySelector('.searchcraft-excerpt-dropdown');
		const options = wrapper.querySelectorAll('.searchcraft-excerpt-option');

		if (!input || !hiddenInput || !toggleBtn || !clearBtn || !dropdown) {
			return;
		}

		// Store all options for filtering
		const allOptions = Array.from(options);

		// Update button visibility based on value
		function updateButtons() {
			const hasValue = hiddenInput.value.trim() !== '';
			toggleBtn.style.display = hasValue ? 'none' : 'flex';
			clearBtn.style.display = hasValue ? 'flex' : 'none';
		}

		// Initialize button state
		updateButtons();

		// Toggle dropdown
		toggleBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			const isOpen = dropdown.style.display === 'block';

			// Close all other dropdowns
			document.querySelectorAll('.searchcraft-excerpt-dropdown').forEach(d => {
				d.style.display = 'none';
			});

			if (!isOpen) {
				dropdown.style.display = 'block';
				input.removeAttribute('readonly');
				input.focus();
				// Show all options
				allOptions.forEach(opt => opt.style.display = 'block');
			}
		});

		// Clear selection
		clearBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			input.value = '';
			hiddenInput.value = '';
			updateButtons();
			dropdown.style.display = 'none';
		});

		// Filter options as user types
		input.addEventListener('input', () => {
			const searchTerm = input.value.toLowerCase();
			let hasVisibleOptions = false;

			allOptions.forEach((option) => {
				const text = option.textContent.toLowerCase();
				const matches = text.includes(searchTerm);
				option.style.display = matches ? 'block' : 'none';
				if (matches) hasVisibleOptions = true;
			});

			// Show dropdown if typing and has results
			if (searchTerm && hasVisibleOptions) {
				dropdown.style.display = 'block';
			}
		});

		// Select option
		allOptions.forEach((option) => {
			option.addEventListener('click', (e) => {
				e.stopPropagation();
				const value = option.getAttribute('data-value');
				const text = value === '' ? '' : option.textContent.trim();

				input.value = text;
				hiddenInput.value = value;
				dropdown.style.display = 'none';
				input.setAttribute('readonly', 'readonly');
				updateButtons();
			});
		});

		// Close dropdown when clicking outside
		document.addEventListener('click', (e) => {
			if (!wrapper.contains(e.target)) {
				dropdown.style.display = 'none';
				// Restore value if user was typing but didn't select
				const currentValue = hiddenInput.value;
				if (currentValue) {
					const selectedOption = allOptions.find(opt => opt.getAttribute('data-value') === currentValue);
					input.value = selectedOption ? selectedOption.textContent.trim() : '';
				} else {
					input.value = '';
				}
				input.setAttribute('readonly', 'readonly');
			}
		});

		// Handle keyboard navigation
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				dropdown.style.display = 'none';
				input.setAttribute('readonly', 'readonly');
			}
		});
	});
}

/**
 * Initialize drag and drop for filter panel items
 */
function initFilterPanelDragDrop() {
	const container = document.getElementById('searchcraft-filter-panel-items');
	if (!container) {
		return;
	}

	const items = container.querySelectorAll('.searchcraft-filter-item');
	let draggedElement = null;

	items.forEach((item) => {
		// Dragstart event
		item.addEventListener('dragstart', function(e) {
			draggedElement = this;
			this.classList.add('dragging');
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', this.innerHTML);
		});

		// Dragend event
		item.addEventListener('dragend', function() {
			this.classList.remove('dragging');
			// Remove all drag-over classes
			items.forEach((item) => {
				item.classList.remove('drag-over');
			});
			draggedElement = null;
			// Update the hidden input with new order
			updateFilterPanelOrder();
		});

		// Dragover event
		item.addEventListener('dragover', function(e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';

			if (this === draggedElement) {
				return false;
			}

			// Remove drag-over from all items
			items.forEach((item) => {
				item.classList.remove('drag-over');
			});

			// Add drag-over to current item
			this.classList.add('drag-over');

			return false;
		});

		// Dragleave event
		item.addEventListener('dragleave', function() {
			this.classList.remove('drag-over');
		});

		// Drop event
		item.addEventListener('drop', function(e) {
			e.stopPropagation();

			if (draggedElement !== this) {
				// Get the bounding rectangles
				const draggedRect = draggedElement.getBoundingClientRect();
				const targetRect = this.getBoundingClientRect();

				// Determine if we should insert before or after
				if (draggedRect.top < targetRect.top) {
					// Dragging from top to bottom - insert after
					this.parentNode.insertBefore(draggedElement, this.nextSibling);
				} else {
					// Dragging from bottom to top - insert before
					this.parentNode.insertBefore(draggedElement, this);
				}
			}

			this.classList.remove('drag-over');
			return false;
		});
	});
}

/**
 * Update the hidden input field with the current order of filter panel items
 */
function updateFilterPanelOrder() {
	const container = document.getElementById('searchcraft-filter-panel-items');
	const hiddenInput = document.getElementById('searchcraft_filter_panel_order');

	if (!container || !hiddenInput) {
		return;
	}

	const items = container.querySelectorAll('.searchcraft-filter-item');
	const order = [];

	items.forEach((item) => {
		const filterKey = item.getAttribute('data-filter-key');
		if (filterKey) {
			order.push(filterKey);
		}
	});

	hiddenInput.value = order.join(',');
}

document.addEventListener('DOMContentLoaded', () => {
	// Initialize color pickers
	initColorPickers();

	// Initialize password toggle functionality
	initPasswordToggle();

	// Initialize button with spinner functionality
	initButtonWithSpinner();

	// Initialize custom post type checkboxes
	initCustomPostTypeCheckboxes();

	// Initialize excerpt override inputs with datalist
	initExcerptOverrideInputs();

	// layout tab functionality
	if (document.querySelector('.searchcraft-layout')) {
		const fullRadio = document.querySelector('input[name="searchcraft_search_experience"][value="full"]');
		const popoverRadio = document.querySelector('input[name="searchcraft_search_experience"][value="popover"]');

		// Initial state
		toggleFormFields();

		// Add event listeners
		fullRadio?.addEventListener('change', toggleFormFields);
		popoverRadio?.addEventListener('change', toggleFormFields);

		// Filter panel options toggle
		const filterPanelCheckbox = document.getElementById('searchcraft_include_filter_panel');
		if (filterPanelCheckbox) {
			// Initial state
			toggleFilterPanelOptions();

			// Add event listener
			filterPanelCheckbox.addEventListener('change', toggleFilterPanelOptions);
		}

		// Search behavior toggle for input container description
		const onPageRadio = document.querySelector('input[name="searchcraft_search_behavior"][value="on_page"]');
		const standAloneRadio = document.querySelector('input[name="searchcraft_search_behavior"][value="stand_alone"]');

		// Initialize container ID tag UI
		initContainerIdTagUI();

		// Initial state
		updateSearchInputContainerDescription();

		// Add event listeners
		onPageRadio?.addEventListener('change', updateSearchInputContainerDescription);
		standAloneRadio?.addEventListener('change', updateSearchInputContainerDescription);

		// Facets options toggle
		const facetsCheckbox = document.getElementById('searchcraft_enable_facets');
		if (facetsCheckbox) {
			// Initial state
			toggleFacetsOptions();

			// Add event listener
			facetsCheckbox.addEventListener('change', toggleFacetsOptions);
		}

		// AI summary banner text toggle
		const aiSummaryCheckbox = document.getElementById('searchcraft_enable_ai_summary');
		if (aiSummaryCheckbox) {
			// Initial state
			toggleAiSummaryLayout();

			// Add event listener
			aiSummaryCheckbox.addEventListener('change', toggleAiSummaryLayout);
		}

		// Result orientation options toggle
		const columnRadio = document.querySelector('input[name="searchcraft_result_orientation"][value="column"]');
		const gridRadio = document.querySelector('input[name="searchcraft_result_orientation"][value="grid"]');
		if (columnRadio && gridRadio) {
			// Initial state
			toggleResultOrientationOptions();

			// Add event listeners
			columnRadio.addEventListener('change', toggleResultOrientationOptions);
			gridRadio.addEventListener('change', toggleResultOrientationOptions);
		}

		// Initialize drag and drop for filter panel items
		initFilterPanelDragDrop();
	}

	// Initialize custom fields modal (config tab)
	if (document.querySelector('.searchcraft-config-section')) {
		initCustomFieldsModal();
	}
});

/**
 * Initialize custom fields modal functionality
 */
function initCustomFieldsModal() {
	const modal = document.getElementById('searchcraft-custom-fields-modal');
	if (!modal) {
		return;
	}

	// Check if searchcraftMetaKeys is defined
	if (typeof searchcraftMetaKeys === 'undefined') {
		return;
	}

	const modalTitle = document.getElementById('searchcraft-modal-title');
	const fieldsList = document.getElementById('searchcraft-custom-fields-list');
	const searchInput = document.getElementById('searchcraft-field-search');
	const selectAllBtn = modal.querySelector('.searchcraft-select-all-fields');
	const deselectAllBtn = modal.querySelector('.searchcraft-deselect-all-fields');
	const saveBtn = modal.querySelector('.searchcraft-save-field-selection');
	const cancelBtn = modal.querySelector('.searchcraft-cancel-field-selection');
	const closeBtn = modal.querySelector('.searchcraft-modal-close');
	const overlay = modal.querySelector('.searchcraft-modal-overlay');

	let currentPostType = null;
	let currentButton = null;

	// Open modal when "Select Fields" button is clicked
	document.addEventListener('click', (e) => {
		if (e.target.classList.contains('searchcraft-select-fields-button')) {
			e.preventDefault();
			currentPostType = e.target.getAttribute('data-post-type');
			currentButton = e.target;
			openModal(currentPostType);
		}
	});

	// Toggle custom fields checkbox visibility
	document.addEventListener('change', (e) => {
		if (e.target.classList.contains('searchcraft-enable-custom-fields-checkbox')) {
			const postType = e.target.getAttribute('data-post-type');
			const selector = document.querySelector(`.searchcraft-custom-fields-selector[data-post-type="${postType}"]`);
			if (selector) {
				selector.style.display = e.target.checked ? '' : 'none';
			}
		}
	});

	function openModal(postType) {
		// Find post type data
		const postTypeData = searchcraftMetaKeys.find((pt) => pt.name === postType);

		if (!postTypeData) {
			return;
		}

		// Set modal title
		modalTitle.textContent = `Select Custom Fields for ${postTypeData.label}`;

		// Get currently selected fields
		const selectedFieldsContainer = document.querySelector(`.searchcraft-selected-fields-container[data-post-type="${postType}"]`);
		const selectedFields = [];
		if (selectedFieldsContainer) {
			const inputs = selectedFieldsContainer.querySelectorAll('input[type="hidden"]');
			inputs.forEach((input) => {
				selectedFields.push(input.value);
			});
		}

		// Populate fields list
		fieldsList.innerHTML = '';
		const metaKeys = Object.keys(postTypeData.meta_keys);

		if (metaKeys.length === 0) {
			fieldsList.textContent = 'No custom fields found for this post type.';
			fieldsList.style.padding = '12px';
			fieldsList.style.margin = '0';
			fieldsList.style.color = '#646970';
		} else {
			// Sort field names alphabetically
			metaKeys.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

			metaKeys.forEach((fieldName) => {
				const label = document.createElement('label');
				const checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.value = fieldName;
				checkbox.checked = selectedFields.length === 0 || selectedFields.includes(fieldName);

				label.appendChild(checkbox);
				label.appendChild(document.createTextNode(` ${fieldName}`));
				fieldsList.appendChild(label);
			});
		}

		// Clear search input
		if (searchInput) {
			searchInput.value = '';
		}

		// Show modal
		modal.style.display = 'block';
		document.body.style.overflow = 'hidden';

		// Focus search input
		setTimeout(() => {
			if (searchInput) {
				searchInput.focus();
			}
		}, 100);
	}

	function closeModal() {
		modal.style.display = 'none';
		document.body.style.overflow = '';
		currentPostType = null;
		currentButton = null;
	}

	function filterFields(searchTerm) {
		const labels = fieldsList.querySelectorAll('label');
		const normalizedSearch = searchTerm.toLowerCase().trim();
		let visibleCount = 0;

		labels.forEach((label) => {
			const fieldName = label.textContent.trim().toLowerCase();
			const matches = fieldName.includes(normalizedSearch);

			if (matches) {
				label.classList.remove('searchcraft-field-hidden');
				visibleCount++;
			} else {
				label.classList.add('searchcraft-field-hidden');
			}
		});

		// Show/hide "no results" message
		let noResultsMsg = fieldsList.querySelector('.searchcraft-no-results');
		if (visibleCount === 0 && normalizedSearch !== '') {
			if (!noResultsMsg) {
				noResultsMsg = document.createElement('div');
				noResultsMsg.className = 'searchcraft-no-results';
				noResultsMsg.textContent = 'No fields found matching your search.';
				fieldsList.appendChild(noResultsMsg);
			}
		} else if (noResultsMsg) {
			noResultsMsg.remove();
		}
	}

	function saveSelection() {
		if (!currentPostType) return;

		const checkboxes = fieldsList.querySelectorAll('input[type="checkbox"]');
		const selectedFields = [];

		checkboxes.forEach((checkbox) => {
			if (checkbox.checked) {
				selectedFields.push(checkbox.value);
			}
		});

		// Update hidden inputs
		const selectedFieldsContainer = document.querySelector(`.searchcraft-selected-fields-container[data-post-type="${currentPostType}"]`);
		if (selectedFieldsContainer) {
			selectedFieldsContainer.innerHTML = '';
			selectedFields.forEach((fieldName) => {
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = `searchcraft_selected_custom_fields[${currentPostType}][]`;
				input.value = fieldName;
				selectedFieldsContainer.appendChild(input);
			});
		}

		// Update button text
		if (currentButton) {
			const postTypeData = searchcraftMetaKeys.find((pt) => pt.name === currentPostType);
			const totalCount = Object.keys(postTypeData.meta_keys).length;

			if (selectedFields.length === 0 || selectedFields.length === totalCount) {
				currentButton.textContent = `Select Fields (All ${totalCount} fields)`;
			} else {
				currentButton.textContent = `Select Fields (${selectedFields.length} of ${totalCount} selected)`;
			}
		}

		closeModal();
	}

	// Event listeners
	searchInput?.addEventListener('input', (e) => {
		filterFields(e.target.value);
	});

	selectAllBtn?.addEventListener('click', () => {
		const checkboxes = fieldsList.querySelectorAll('input[type="checkbox"]:not(.searchcraft-field-hidden input)');
		checkboxes.forEach((checkbox) => {
			const label = checkbox.closest('label');
			if (!label || !label.classList.contains('searchcraft-field-hidden')) {
				checkbox.checked = true;
			}
		});
	});

	deselectAllBtn?.addEventListener('click', () => {
		const checkboxes = fieldsList.querySelectorAll('input[type="checkbox"]:not(.searchcraft-field-hidden input)');
		checkboxes.forEach((checkbox) => {
			const label = checkbox.closest('label');
			if (!label || !label.classList.contains('searchcraft-field-hidden')) {
				checkbox.checked = false;
			}
		});
	});

	saveBtn?.addEventListener('click', saveSelection);
	cancelBtn?.addEventListener('click', closeModal);
	closeBtn?.addEventListener('click', closeModal);
	overlay?.addEventListener('click', closeModal);

	// Close on Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modal.style.display === 'block') {
			closeModal();
		}
	});
}