export enum SideBarMode {
	OVER = 'OVER',
	SIDE = 'SIDE',
	PUSH = 'PUSH'
}
interface MicConfig {
	echoCancellation: boolean;
	noiseSuppression: boolean;
	autoGainControl: boolean;
}

export interface App {
	isCollapse: boolean;
	mic: MicConfig;
	sideBarMode: SideBarMode;
}
