import type { User } from '$lib/types/user.type';
import { writable } from 'svelte/store';

export const user$ = writable<User>({} as unknown as User);
