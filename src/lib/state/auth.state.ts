import { browser } from '$app/env';
import { KQL_SigninByGoogle } from '$lib/@shared/graphql/_kitql/graphqlStores';
import type { Auth } from '$lib/types';
import type { CredentialResponse } from 'google-one-tap';
import type Google from 'google-one-tap';
import { writable, get } from 'svelte/store';
import { goto } from '$app/navigation';
import { ROUTES } from '$lib/@core/constants';
import jwtDecode from 'jwt-decode';

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

	async function handleCredentialResponse(response: CredentialResponse) {
		const jwt = response.credential;
		try {
			const resp = await KQL_SigninByGoogle.mutate({
				variables: {
					input: {
						token: jwt
					}
				}
			});
			if (resp.data?.signinByGoogle.id) {
				const token = resp.data?.signinByGoogle.token!;
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

export const googleAuth2 = {
	signin: () => {
		window.location.replace('https://api.noinghe.com/v1/auth/google');
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
