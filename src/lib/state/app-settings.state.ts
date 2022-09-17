import { browser } from '$app/env';
import type { App } from '$lib/types';
import { derived, writable } from 'svelte/store';

const APP_SETTINGS = 'APP_SETTINGS';
const stored =
	browser &&
	localStorage.getItem('APP_SETTINGS') &&
	JSON.parse(localStorage.getItem('APP_SETTINGS')!);

const initApp = {
	isCollapse: false
} as unknown as App;
const { subscribe, set, update } = writable<App>(stored || initApp);

const isCollapse = derived({ subscribe }, ($app) => $app.isCollapse);

export const appSettings = {
	subscribe,
	set,
	update,
	isCollapse,
	onToggleCollapse: () => {
		update((data) => {
			data.isCollapse = !data.isCollapse;
			return data;
		});
	}
};

if (browser) {
	subscribe((value) => localStorage.setItem(APP_SETTINGS, JSON.stringify(value)));
}
