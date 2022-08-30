import { browser } from '$app/env';
import type { Auth } from '$lib/types';
import { writable } from 'svelte/store';

const stored = browser && localStorage.auth && JSON.parse(localStorage.auth);

console.log({ stored });

const initialAuthState = {
	loggedIn: false
} as unknown as Auth;
export const auth = writable<Auth>(stored || initialAuthState);

if (browser) {
	auth.subscribe((value) => (localStorage.auth = JSON.stringify(value)));
}
