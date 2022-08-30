declare global {
	interface Navigator {
		getUserMedia(
			options: { video?: any; audio?: any },
			success: (stream: any) => void,
			error?: (error: string) => void
		): void;
	}
}
