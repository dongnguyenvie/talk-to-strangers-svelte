import type { Auth } from '$lib/types';
import { writable } from 'svelte/store';

export const auth$ = writable<Auth>({} as unknown as Auth);
export const initialAuthState = {};
