import { auth$, initialAuthState } from '$lib/state'; // stores related to app state, auth state
import type { Auth } from '$lib/types';
import type { LoadOutput } from '@sveltejs/kit';

let auth = { ...initialAuthState } as unknown as Auth;
auth$.subscribe((authState) => (auth = authState));

type LoadInput = any;
interface authGuardProps {
	path: string;
}
export async function authGuard({ path }: authGuardProps): Promise<LoadOutput> {
	const loggedIn = auth.loggedIn;

	if (loggedIn && path === '/login') {
		return { status: 302, redirect: '/' };
	} else if (loggedIn || path === '/login') {
		return {};
	} else {
		return { status: 302, redirect: '/login' };
	}
}
