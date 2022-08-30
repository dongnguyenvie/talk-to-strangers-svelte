<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { authGuard } from '$lib/guards';

	export const load: Load = async ({ params, url: { pathname, hostname } }) => {
		return await authGuard({ path: pathname });
	};

	// export async function load({ params }: any): Promise<any> {
	// 	console.log({ params });
	// 	// return await authGuard({ page, fetch, session, context });
	// }
</script>

<script lang="ts">
	import TheHeader from '$lib/components/theHeader/TheHeader.svelte';
	import TheSidebar from '$lib/components/theSidebar/TheSidebar.svelte';
	// import { authGuard } from '$lib/guards';
	import '../app.css';
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
