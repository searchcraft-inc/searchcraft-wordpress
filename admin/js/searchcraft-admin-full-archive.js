(($) => {
	$(document).ready(() => {
		/**
		 * Add indeterminate functionality to checkboxes.
		 */
		for (element of document.querySelectorAll(
			"[data-indeterminate-checkbox]",
		)) {
			const checkboxes = element.querySelectorAll("input[type='checkbox']");

			if (checkboxes.length < 2) {
				return; // Need at least 1 parent + 1 child
			}

			const parent = checkboxes[0];
			const children = Array.from(checkboxes).slice(1);

			function updateParent() {
				const total = children.length;
				const checkedCount = children.filter((cb) => cb.checked).length;

				if (checkedCount === 0) {
					parent.checked = false;
					parent.indeterminate = false;
				} else if (checkedCount === total) {
					parent.checked = true;
					parent.indeterminate = false;
				} else {
					parent.checked = false;
					parent.indeterminate = true;
				}
			}

			// Initial state
			updateParent();

			// Toggle all children when parent changes
			parent.addEventListener("change", () => {
				const isChecked = parent.checked;

				for (child of children) {
					child.checked = isChecked;
				}

				parent.indeterminate = false;
			});

			// Update parent when any child changes
			for (child of children) {
				child.addEventListener("change", updateParent);
			}
		}

		/**
		 * Map range slider input to number input.
		 */
		for (element of document.querySelectorAll("[data-range-slider")) {
			const rangeInput = element.querySelector('input[type="range"]');
			const numberInput = element.querySelector('input[type="number"]');

			if (!rangeInput || !numberInput) return;

			// Set initial number input value to match range
			numberInput.value = rangeInput.value;

			// Sync number when range changes
			rangeInput.addEventListener("change", (e) => {
				if (numberInput.value !== e.target.value) {
					numberInput.value = e.target.value;
				}
			});

			// Sync range when number changes
			numberInput.addEventListener("change", (e) => {
				if (rangeInput.value !== e.target.value) {
					rangeInput.value = e.target.value;
				}
			});
		}

		/**
		 * Stopwords tag box.
		 */
		for (element of document.querySelectorAll("[data-stopword]")) {
			element.addEventListener("click", function () {
				// Clear the hidden input inside the clicked element
				const hiddenInput = this.querySelector('input[type="hidden"]');

				if (hiddenInput) {
					hiddenInput.value = "";
				}

				// Submit the closest form
				const form = this.closest("form");

				if (form) {
					form.requestSubmit(); // Must use .requestSubmit() here as the other submit button messes with .submit()
				}
			});
		}

		/**
		 * Copy to clipboard.
		 */
		for (element of document.querySelectorAll("[data-copy-to-clipboard]")) {
			element.addEventListener("click", function () {
				const text = this.getAttribute("data-copy-to-clipboard");

				// Copy to clipboard
				navigator.clipboard
					.writeText(text)
					.then(() => console.log(`Copied: ${text}`))
					.catch((err) => console.error(`Failed to copy: ${err}`));

				// Create tooltip element
				const tooltip = document.createElement("span");
				tooltip.className = "searchcraft-tooltip";
				tooltip.textContent = "Copied!";
				tooltip.style.display = "none";
				tooltip.style.opacity = 0;
				tooltip.style.transition = "opacity 0.2s";

				// Insert tooltip
				this.insertBefore(tooltip, this.firstChild);

				// Fade in
				requestAnimationFrame(() => {
					tooltip.style.display = "inline-block";
					tooltip.style.opacity = 1;
				});

				// Fade out after 1 second
				setTimeout(() => {
					tooltip.style.opacity = 0;
					setTimeout(() => {
						tooltip.remove();
					}, 200);
				}, 1000);
			});
		}

		/**
		 * Show/hide passwords.
		 */
		for (element of document.querySelectorAll(
			"[data-toggle-password-visibility]",
		)) {
			const input = element.querySelector("input:not([type='hidden'])");
			const button = element.querySelector("button");

			button.addEventListener("click", () => {
				const isVisible = input.type !== "password";
				// Toggle aria-label
				button.setAttribute("aria-label", isVisible ? "Show" : "Hide");
				// Toggle icon class on first child
				const icon = button.firstElementChild;

				if (icon) {
					icon.classList.toggle("dashicons-visibility");
					icon.classList.toggle("dashicons-hidden");
				}

				// Toggle input type
				input.type = isVisible ? "password" : "text";
			});
		}
	});

	/**
	 * Handle form submissions with spinners for long-running operations.
	 */
	const reindexForm = document.getElementById('searchcraft-reindex-form');
	const deleteForm = document.getElementById('searchcraft-delete-form');

	if (reindexForm) {
		reindexForm.addEventListener('submit', function() {
			const button = document.getElementById('searchcraft-reindex-button');
			const spinner = document.getElementById('searchcraft-reindex-spinner');

			if (button && spinner) {
				// Disable the button and show spinner
				button.disabled = true;
				button.style.display = 'none';
				spinner.style.display = 'inline-block';
			}
		});
	}

	if (deleteForm) {
		deleteForm.addEventListener('submit', function() {
			const button = document.getElementById('searchcraft-delete-button');
			const spinner = document.getElementById('searchcraft-delete-spinner');

			if (button && spinner) {
				// Disable the button and show spinner
				button.disabled = true;
				button.style.display = 'none';
				spinner.style.display = 'inline-block';
			}
		});
	}

	/**
	 * Initialize code editors with basic enhancements
	 */
	function initCodeEditors() {
		const cssEditor = document.getElementById('searchcraft_custom_css');
		const templateEditor = document.getElementById('searchcraft_result_template');

		// Add tab support for code editors
		[cssEditor, templateEditor].forEach(editor => {
			if (editor) {
				editor.addEventListener('keydown', function(e) {
					// Handle tab key for indentation
					if (e.key === 'Tab') {
						e.preventDefault();
						const start = this.selectionStart;
						const end = this.selectionEnd;
						const value = this.value;

						// Insert tab character (or spaces for JavaScript)
						const indent = editor.id === 'searchcraft_result_template' ? '    ' : '\t';
						this.value = value.substring(0, start) + indent + value.substring(end);

						// Move cursor after the indent
						this.selectionStart = this.selectionEnd = start + indent.length;
					}

					// Auto-close brackets and quotes for JavaScript template editor
					if (editor.id === 'searchcraft_result_template') {
						const pairs = {
							'(': ')',
							'[': ']',
							'{': '}',
							'"': '"',
							"'": "'",
							'`': '`'
						};

						if (pairs[e.key]) {
							const start = this.selectionStart;
							const end = this.selectionEnd;
							const value = this.value;

							// Only auto-close if no text is selected and not already followed by closing char
							if (start === end && value[start] !== pairs[e.key]) {
								e.preventDefault();
								this.value = value.substring(0, start) + e.key + pairs[e.key] + value.substring(end);
								this.selectionStart = this.selectionEnd = start + 1;
							}
						}
					}
				});

				// Auto-resize textarea based on content
				editor.addEventListener('input', function() {
					this.style.height = 'auto';
					this.style.height = Math.max(this.scrollHeight, 200) + 'px';
				});

				// Initial resize
				editor.style.height = Math.max(editor.scrollHeight, 200) + 'px';
			}
		});
	}

	// Initialize code editors
	initCodeEditors();

})(jQuery);
