export enum SideBarMode {
	OVER = 'OVER',
	SIDE = 'SIDE',
	PUSH = 'PUSH'
}

export interface App {
	isCollapse: boolean;
	sideBarMode: SideBarMode
}
