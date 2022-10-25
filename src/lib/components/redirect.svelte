<script lang="ts">
	import { browser } from '$app/env';

	import { goto } from '$app/navigation';

	export let to: string;

	if (browser) {
		goto(to);
	}
</script>
