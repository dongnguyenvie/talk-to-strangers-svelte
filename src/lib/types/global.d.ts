declare global {
	interface Navigator {
		getUserMedia(
			options: { video?: any; audio?: any },
			success: (stream: any) => void,
			error?: (error: string) => void
		): void;
	}
}

declare module '@fortawesome/pro-solid-svg-icons/index.es' {
	export * from '@fortawesome/pro-solid-svg-icons';
}
