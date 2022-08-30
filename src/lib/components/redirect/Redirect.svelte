<script lang="ts">
	import { browser } from '$app/env';

	import { goto } from '$app/navigation';

	import type { Auth } from '$lib/types';

	export let auth!: Auth;
	export let to: string;

	if (browser && !auth.loggedIn) {
		goto(to);
	}
</script>
