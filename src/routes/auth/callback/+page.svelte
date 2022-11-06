<script lang="ts">
	import { page } from '$app/stores';
	import { validAndInjectToken } from '$lib/state';
	import { onMount } from 'svelte';

	onMount(() => {
		const token = $page.url.searchParams.get('token');
		if (!token) return;

		validAndInjectToken(token);
	});
</script>

<div>loading...</div>
