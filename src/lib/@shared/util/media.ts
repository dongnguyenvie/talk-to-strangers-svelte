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
		return (
			navigatorRef.getUserMedia ||
			navigatorRef.webkitGetUserMedia ||
			navigatorRef.mozGetUserMedia ||
			navigatorRef.mozGetUserMedia ||
			navigatorRef.msGetUserMedia
		).bind(navigator);
	})() as Navigator['getUserMedia'];

	return getUserMedia;
};

export function checkStream(stream: MediaStream) {
	let hasMedia = { isVideo: false, isAudio: false };

	if (stream.getAudioTracks().length)
		// checking audio presence
		hasMedia.isAudio = true;

	if (stream.getVideoTracks().length)
		// checking video presence
		hasMedia.isVideo = true;

	return hasMedia;
}
