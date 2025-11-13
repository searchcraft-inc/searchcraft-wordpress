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

	colorPickers.forEach(function(colorPicker) {
		const hexInput = document.getElementById(colorPicker.id + '_hex');

		if (hexInput) {
			// Sync color picker to hex input
			colorPicker.addEventListener('input', function() {
				hexInput.value = this.value.toUpperCase();
			});

			// Sync hex input to color picker
			hexInput.addEventListener('input', function() {
				if (/^#[0-9A-Fa-f]{6}$/.test(this.value)) {
					colorPicker.value = this.value;
				}
			});

			// Use hex input value for form submission
			const form = colorPicker.closest('form');
			if (form) {
				form.addEventListener('submit', function() {
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

	toggleElements.forEach(function(element) {
		const input = element.querySelector('input:not([type="hidden"])');
		const button = element.querySelector('button');

		if (input && button) {
			button.addEventListener('click', function() {
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

	buttonContainers.forEach(function(container) {
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
			form.addEventListener('submit', function() {
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

	const isFullSelected = fullRadio && fullRadio.checked;

	// Show/hide full experience fields
	fullOnlyRows.forEach(function(row) {
		if (isFullSelected) {
			row.classList.remove('hidden');
		} else {
			row.classList.add('hidden');
		}
	});

	// Show/hide popover fields
	popoverOnlyRows.forEach(function(row) {
		if (!isFullSelected) {
			row.classList.remove('hidden');
		} else {
			row.classList.add('hidden');
		}
	});
}

/**
 * Toggle filter panel options visibility
 */
function toggleFilterPanelOptions() {
	const filterPanelCheckbox = document.getElementById('searchcraft_include_filter_panel');
	const filterPanelOptions = document.querySelector('.searchcraft-filter-panel-options');

	if (filterPanelCheckbox && filterPanelOptions) {
		if (filterPanelCheckbox.checked) {
			filterPanelOptions.style.display = '';
		} else {
			filterPanelOptions.style.display = 'none';
		}
	}
}

/**
 * Toggle facets options visibility
 */
function toggleFacetsOptions() {
	const facetsCheckbox = document.getElementById('searchcraft_enable_facets');
	const facetsOptions = document.querySelector('.searchcraft-facets-options');

	if (facetsCheckbox && facetsOptions) {
		if (facetsCheckbox.checked) {
			facetsOptions.style.display = '';
		} else {
			facetsOptions.style.display = 'none';
		}
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
	aiSummarySettings.forEach(function(element) {
		if (aiSummaryCheckbox.checked) {
			element.style.display = '';
		} else {
			element.style.display = 'none';
		}
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

	columnOrientationOptions.forEach(function(element) {
		if (isColumnSelected) {
			element.style.display = '';
		} else {
			element.style.display = 'none';
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
	// Initialize color pickers
	initColorPickers();

	// Initialize password toggle functionality
	initPasswordToggle();

	// Initialize button with spinner functionality
	initButtonWithSpinner();

	// layout tab functionality
	if (document.querySelector('.searchcraft-layout')) {
		const fullRadio = document.querySelector('input[name="searchcraft_search_experience"][value="full"]');
		const popoverRadio = document.querySelector('input[name="searchcraft_search_experience"][value="popover"]');

		// Initial state
		toggleFormFields();

		// Add event listeners
		if (fullRadio) {
			fullRadio.addEventListener('change', toggleFormFields);
		}
		if (popoverRadio) {
			popoverRadio.addEventListener('change', toggleFormFields);
		}

		// Filter panel options toggle
		const filterPanelCheckbox = document.getElementById('searchcraft_include_filter_panel');
		if (filterPanelCheckbox) {
			// Initial state
			toggleFilterPanelOptions();

			// Add event listener
			filterPanelCheckbox.addEventListener('change', toggleFilterPanelOptions);
		}

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
	}
});