<script lang="ts">
	import { page } from '$app/stores';
	import { srcObject } from '$lib/@shared/directives/src-object.directive';
	import { initRoomEvent } from '$lib/@shared/socket/events';
	import Button from '$lib/components/Button.svelte';
	import { room, socketState } from '$lib/state';
	import { onMount, onDestroy } from 'svelte';
	import { derived } from 'svelte/store';

	const roomId = $page.params.id as string;
	let roomEvent: ReturnType<typeof initRoomEvent>;
	onMount(() => {
		roomEvent = initRoomEvent({ roomId });
	});

	onDestroy(() => {
		roomEvent?.destroy();
	});

	const handleOpenCam = () => {
		roomEvent.openCam();
	};
	const handleOpenMic = () => {};

	room.subscribe((data) => {
		console.log(data);
	});

	const socketId = derived(socketState, ($socket) => $socketState.id);

	export const myCam = derived(room, ($room) => {
		const info = $room.clients.find((client) => client.isInitiator);
		if (!info) return null;
		return {
			srcObject: info.stream as MediaStream,
			autoplay: true,
			className: 'live-webcam'
		};
	});

	export const othersCam = derived(room, ($room) => {
		const infos = $room.clients.filter((client) => !client.isInitiator);

		return infos.map((info) => ({
			id: info.socketId,
			srcObject: info.stream as MediaStream,
			autoplay: true,
			className: 'live-webcam'
		}));
	});
</script>

<section>
	<h1>room {roomId}</h1>
	<h2>socketId {$socketId}</h2>
	<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOpenCam}>
		open cam
	</Button>
	<hr />
	<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOpenMic}>
		open mic
	</Button>
	<hr />
	{#if !!$myCam?.srcObject}
		<section>
			<h3>my cam</h3>
			<video use:srcObject={$myCam.srcObject} autoplay width="400" height="400">
				<track kind="captions" src="" />
			</video>
		</section>
	{/if}

	{#each $othersCam as c}
		<section>
			<h3>{c.id}</h3>
			<video use:srcObject={c.srcObject} autoplay width="400" height="400">
				<track kind="captions" src="" />
			</video>
		</section>
	{/each}
</section>
