<script lang="ts">
	import { page } from '$app/stores';
	import { initRoomEvent } from '$lib/@shared/socket/events/room';
	import { onMount, onDestroy } from 'svelte/types/runtime/internal/lifecycle';

	const roomId = $page.params.id as string;
	let roomEvent: any;
	onMount(() => {
		roomEvent = initRoomEvent({ roomId });
	});

	onDestroy(() => {
		roomEvent?.destroy();
	});
</script>

<section>
	<h1>room {roomId}</h1>
</section>
