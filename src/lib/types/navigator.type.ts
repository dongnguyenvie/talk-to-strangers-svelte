export interface Navigator {
	getUserMedia(
		options: { video?: boolean; audio?: boolean },
		success: (stream: MediaStream) => void,
		error?: (error: string) => void
	): void;
}
