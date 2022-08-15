<script lang="ts">
	import TheHeader from '$lib/components/theHeader/TheHeader.svelte';
	import TheSidebar from '$lib/components/theSidebar/TheSidebar.svelte';
	import '../app.css';
</script>

<TheHeader />
<div class="bg-white my-5 w-full flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
	<TheSidebar className="w-64" />

	<main class="w-full px-5 py-40 bg-main-100">
		<slot />
	</main>
</div>

<footer />

<style>
</style>
