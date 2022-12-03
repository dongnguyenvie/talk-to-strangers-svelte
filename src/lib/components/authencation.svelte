<script lang="ts">
	import { appSettings, auth } from '$lib/state';
	import Redirect from './redirect.svelte';

	export let redirectIfNotLoggedIn = false;
	export let showIfLoggedIn = true;
	export let showIfNotLoggedIn = false;
</script>

{#if redirectIfNotLoggedIn && !$auth.id}
	<Redirect to="/login" />
{/if}

{#if !showIfNotLoggedIn && showIfLoggedIn && $auth.id}
	<slot {auth} {appSettings} isAuth={!!$auth.id} />
{/if}

{#if showIfNotLoggedIn && !$auth.id}
	<slot {auth} {appSettings} isAuth={!!$auth.id} />
{/if}
