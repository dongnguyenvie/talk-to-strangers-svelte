import type Icon from 'svelte-icon/Icon.svelte';

export function nonNullAssert<T>(a: T | undefined | null): T {
	return a!;
}

export function transformToIcon(a: string): Icon {
	return a as unknown as Icon;
}
