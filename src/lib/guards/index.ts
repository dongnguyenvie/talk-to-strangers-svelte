import { auth } from '$lib/state'; // stores related to app state, auth state
import type { Auth } from '$lib/types';
import type { LoadOutput } from '@sveltejs/kit';

let me: Auth;
auth.subscribe((authState) => (me = authState));

interface authGuardProps {
	path: string;
}
export async function authGuard({ path }: authGuardProps): Promise<LoadOutput> {
	const loggedIn = !!me.id;

	if (loggedIn && path === '/login') {
		return { status: 302, redirect: '/' };
	} else if (loggedIn || path === '/login') {
		return {};
	} else {
		return { status: 302, redirect: '/login' };
	}
}
