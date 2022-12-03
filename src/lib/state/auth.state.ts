import { browser } from '$app/environment';
import type { Auth } from '$lib/types';
import type { CredentialResponse } from 'google-one-tap';
import type Google from 'google-one-tap';
import { writable, get, derived } from 'svelte/store';
import { goto } from '$app/navigation';
import { PLAYHOLDER_AVATAR, ROUTES } from '$lib/@core/constants';
import jwtDecode from 'jwt-decode';
import { GQL_signinByGoogle } from '$houdini';

let google: typeof Google;
const USER_INFO = 'USER_INFO';
const stored =
	browser && localStorage.getItem(USER_INFO) && JSON.parse(localStorage.getItem(USER_INFO)!);

const initialAuthState = {
	id: null
} as unknown as Auth;
export const auth = writable<Auth>(stored || initialAuthState);

export const userPicture = derived(auth, ($auth) => $auth.avatar || PLAYHOLDER_AVATAR);

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

	async function handleCredentialResponse(response: CredentialResponse) {
		const jwt = response.credential;
		try {
			const data = await GQL_signinByGoogle.mutate({
				input: {
					token: jwt
				}
			});
			if (data?.signinByGoogle.id) {
				const token = data?.signinByGoogle.token!;
				const user = jwtDecode(token) as Auth;
				auth.set({ ...user, token });
				goto(ROUTES.rooms);
			}
		} catch (error) {}
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
		setTimeout(() => {
			if (!get(auth).id) {
				google.accounts.id.prompt();
			}
		}, 100);
	};
}

export const googleOAuth2 = {
	signin: () => {
		window.location.replace('http://localhost:7001/api/auth/google');
	},
	signout: () => {
		google.accounts.id.disableAutoSelect();
	}
};

export const facebookOAuth2 = {
	signin: () => {
		window.location.replace('http://localhost:7001/api/auth/facebook');
	},
	signout: () => {
		google.accounts.id.disableAutoSelect();
	}
};

export const validAndInjectToken = (token: string, isRedirect = true) => {
	const user = jwtDecode(token) as Auth;
	auth.set({ ...user, token });
	if (!isRedirect) return;
	goto(ROUTES.rooms);
};

export const logout = () => {
	localStorage.clear();
	auth.set(initialAuthState);
};
