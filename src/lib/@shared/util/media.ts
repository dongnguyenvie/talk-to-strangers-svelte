import type { Navigator } from '$lib/types';

export const getUserMediaHelper = () => {
	const navigatorRef = navigator as any;

	const getUserMedia = (function () {
		if (navigatorRef.getUserMedia) {
			return navigatorRef.getUserMedia.bind(navigator);
		}
		if (navigatorRef.webkitGetUserMedia) {
			return navigatorRef.webkitGetUserMedia.bind(navigator);
		}
		if (navigatorRef.mozGetUserMedia) {
			return navigatorRef.mozGetUserMedia.bind(navigator);
		}
	})() as Navigator['getUserMedia'];

	return getUserMedia;
};
