/**
 * Searchcraft Block Editor Error Notices
 *
 * Displays error notices in the block editor after post save.
 *
 * @package Searchcraft
 * @since 1.0.0
 */

(function (wp) {
	if (!wp || !wp.data) {
		return;
	}

	const { subscribe, select, dispatch } = wp.data;
	const { isSavingPost, getCurrentPostId } = select('core/editor');
	const { addQueryArgs } = wp.url;

	let isSaving = false;
	let hasChecked = false;

	// Subscribe to editor changes
	subscribe(() => {
		const currentlySaving = isSavingPost();

		// Detect when save starts
		if (currentlySaving && !isSaving) {
			isSaving = true;
			hasChecked = false;
		}

		// Detect when save completes
		if (!currentlySaving && isSaving && !hasChecked) {
			isSaving = false;
			hasChecked = true;

			// Check for errors after save
			const postId = getCurrentPostId();
			const path = addQueryArgs('/searchcraft/v1/publish-error', {
				post_id: postId,
			});

			wp.apiFetch({
				path: path,
			})
				.then(function (response) {
					if (response.error && response.message) {
						// Display error notice
						dispatch('core/notices').createNotice(
							'error',
							response.message,
							{
								id: 'searchcraft-publish-error',
								isDismissible: true,
							}
						);
					} else {
						// Remove any existing error notice
						dispatch('core/notices').removeNotice(
							'searchcraft-publish-error'
						);
					}
				})
				.catch(function (error) {
					console.error('Searchcraft error check failed:', error);
				});
		}
	});
})(window.wp);

