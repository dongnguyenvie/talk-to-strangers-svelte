import type { Navigator } from '$lib/types';

export const getUserMediaHelper = () => {
	const navigatorRef = navigator as any;

	const getUserMedia =
		navigatorRef.getUserMedia ||
		navigatorRef.webkitGetUserMedia ||
		navigatorRef.mozGetUserMedia ||
		navigatorRef.mozGetUserMedia ||
		navigatorRef.msGetUserMedia;

	return ((
		constraints: { video?: boolean; audio?: boolean },
		onSuccess: (payload: MediaStream) => void,
		onError: (err: string) => void
	) => {
		if (navigator?.mediaDevices?.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then((stream) => {
					onSuccess(stream);
				})
				.catch((err) => {
					onError(err);
				});
		} else {
			return getUserMedia(constraints, onSuccess, onError);
		}
	}) as unknown as Navigator['getUserMedia'];
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
