<script context="module" lang="ts">
	export const csr = true;
	export const ssr = false;
	export const prerender = false;
</script>

<script lang="ts">
	import { appSettings } from '$lib/state';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	const { isCollapse, onToggleCollapse } = appSettings;
	import { get } from 'svelte/store';

	let innerWidth = 0;
	let innerHeight = 0;

	$: isXs = innerWidth <= 768;

	$: {
		const _isCollapse = get(isCollapse);
		if (isXs) {
			if (!_isCollapse) {
				onToggleCollapse();
			}
		} else {
			if (_isCollapse) {
				onToggleCollapse();
			}
		}
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />
