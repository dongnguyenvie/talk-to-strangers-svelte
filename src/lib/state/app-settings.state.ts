import { browser } from '$app/environment';
import { SideBarMode, type App } from '$lib/types';
import { derived, writable } from 'svelte/store';

const APP_SETTINGS = 'APP_SETTINGS';
const stored =
	browser &&
	localStorage.getItem('APP_SETTINGS') &&
	JSON.parse(localStorage.getItem('APP_SETTINGS')!);

const initApp = {
	isCollapse: false,
	mic: {
		echoCancellation: true,
		noiseSuppression: true,
		autoGainControl: true
	},
	sideBarMode: SideBarMode.SIDE
} as unknown as App;
const { subscribe, set, update } = writable<App>(initApp);

const isCollapse = derived({ subscribe }, ($app) => $app.isCollapse);
const sideBarMode = derived({ subscribe }, ($app) => $app.sideBarMode);
const micConfig = derived({ subscribe }, ($app) => $app.mic || initApp.mic);

export const appSettings = {
	subscribe,
	set,
	update,
	isCollapse,
	sideBarMode,
	micConfig,
	onToggleCollapse: () => {
		update((data) => {
			data.isCollapse = !data.isCollapse;
			return data;
		});
	},
	onChangeSideBarMode: (mode: SideBarMode) => {
		update((data) => {
			data.sideBarMode = mode;
			return data;
		});
	}
};

if (browser) {
	subscribe((value) => localStorage.setItem(APP_SETTINGS, JSON.stringify(value)));
}
