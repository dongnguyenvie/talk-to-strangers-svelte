import { browser } from '$app/env';
import type { Auth } from '$lib/types';
import type { CredentialResponse } from 'google-one-tap';
import type Google from 'google-one-tap';
import { writable } from 'svelte/store';

let auth2: gapi.auth2.GoogleAuth;
let google: typeof Google;
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

	function handleCredentialResponse(response: CredentialResponse) {
		console.log('Encoded JWT ID token: ' + response.credential);
	}
	window.onload = function () {
		google = window.google;
		google.accounts.id.initialize({
			client_id: import.meta.env.VITE_GG_CLIENT_ID,
			callback: handleCredentialResponse
		});
		google.accounts.id.renderButton(
			document.getElementById('google-signin-tab-button')!,
			{ theme: 'outline', size: 'large' } // customization attributes
		);
		// google.accounts.id.prompt(); // also display the One Tap dialog
	};
}

export const googleAuth2 = {
	signin: () => {
		google.accounts.id.prompt();
	},
	signout: () => {
		google.accounts.id.disableAutoSelect();
	}
};
