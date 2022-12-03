<script lang="ts">
	import { appSettings, auth } from '$lib/state';
	import Redirect from './redirect.svelte';

	export let redirectIfNotLoggedIn = false;
	export let showIfLoggedIn = true;
</script>

{#if redirectIfNotLoggedIn && !$auth.id}
	<Redirect to="/login" />
{/if}

{#if showIfLoggedIn && $auth.id}
	<slot {auth} {appSettings} isAuth={!!$auth.id} />
{/if}
