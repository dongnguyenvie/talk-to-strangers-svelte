<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { authGuard } from '$lib/guards';

	// export const load: Load = async ({ params, url: { pathname, hostname } }) => {
	// 	return await authGuard({ path: pathname });
	// };

	// export async function load({ params }: any): Promise<any> {
	// 	console.log({ params });
	// 	// return await authGuard({ page, fetch, session, context });
	// }
</script>

<script lang="ts">
	import '../app.css';
	import TheHeader from '$lib/components/theHeader/TheHeader.svelte';
	import TheSidebar from '$lib/components/theSidebar/TheSidebar.svelte';
	import { appSettings, auth } from '$lib/state';
	import Redirect from '$lib/components/redirect/Redirect.svelte';
	import AutoCollapse from '$lib/components/AutoCollapse.svelte';
	const { isCollapse } = appSettings;

	// import type { Load, LoadOutput } from '@sveltejs/kit';

	// export async function load({ page, fetch, session, context }: LoadInput): Promise<LoadOutput> {
	// 	return await authGuard({ page, fetch, session, context });
	// }
	// Load
	// export const load =async ({ page, fetch, session, context }) => ({
	// 	return await authGuard({ page, fetch, session, context })
	// });

	// export const load = async ({ page, fetch, session, context }: any) => {
	// 	console.log({ page, fetch, session, context });
	// 	return await authGuard({ page, fetch, session, context });
	// };
</script>

<AutoCollapse />
<div class="min-h-screen min-w-full flex flex-col">
	{#if !$auth.id}
		<Redirect to="/login" />
	{/if}

	{#if !!$auth.id}
		<TheHeader className="min-h-76px" />
		<div class="bg-white w-full flex min-h-full m-0 p-0 flex-grow">
			<TheSidebar className={`flex-shrink-0`} />
			<main class="w-[calc(100%_-_280px)] flex-grow px-5 py-4 bg-main-100">
				<slot />
			</main>
		</div>
		<footer />
	{/if}
</div>

<style>
</style>
