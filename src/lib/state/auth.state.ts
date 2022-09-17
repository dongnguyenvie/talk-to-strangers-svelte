import { browser } from '$app/env';
import type { Auth } from '$lib/types';
import { writable } from 'svelte/store';

const USER_INFO = 'USER_INFO';
const stored =
	browser && localStorage.getItem(USER_INFO) && JSON.parse(localStorage.getItem(USER_INFO)!);

const initialAuthState = {
	id: null
} as unknown as Auth;
export const auth = writable<Auth>(stored || initialAuthState);

if (browser) {
	auth.subscribe((value) => {
		console.log({ value });
		if (!value.id || value.exp < Date.now() / 1000) {
			localStorage.removeItem(USER_INFO);
			!!value.id && auth.set(initialAuthState);
		} else {
			localStorage.setItem(USER_INFO, JSON.stringify(value));
		}
	});
}
