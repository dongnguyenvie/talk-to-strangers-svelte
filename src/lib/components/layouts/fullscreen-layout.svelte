<script lang="ts">
	import '../../../app.css';
	import { auth } from '$lib/state';
	import Redirect from '$lib/components/redirect.svelte';
</script>

<div
	class="bg-white w-full flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 min-h-screen"
>
	{#if !$auth.id}
		<Redirect to="/login" />
	{/if}

	{#if $auth.id}
		<main class="flex w-full flex-grow flex-col">
			<slot />
		</main>
	{/if}
</div>
<footer />

<style>
</style>
