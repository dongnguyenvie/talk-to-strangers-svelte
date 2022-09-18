<script lang="ts">
	import '../app.css';
	import { auth } from '$lib/state';
	import Redirect from '$lib/components/redirect/Redirect.svelte';
</script>

<div
	class="bg-white w-full flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 min-h-screen"
>
	{#if !$auth.id}
		<Redirect to="/login" />
	{/if}

	{#if $auth.id}
		<main class="w-full bg-main-100">
			<slot />
		</main>
	{/if}
</div>
<footer />

<style>
</style>
