/**
 * Searchcraft Admin JavaScript
 *
 * @package Searchcraft
 * @since 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
	// Initialize color pickers
	initColorPickers();

	// Initialize password toggle functionality
	initPasswordToggle();
});

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