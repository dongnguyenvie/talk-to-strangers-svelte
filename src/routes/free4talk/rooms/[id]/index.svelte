<script lang="ts">
	import { page } from '$app/stores';
	import { srcObject } from '$lib/@shared/directives/src-object.directive';
	import { initRoomEvent } from '$lib/@shared/socket/events';
	import Button from '$lib/components/Button.svelte';
	import { room, socketState } from '$lib/state';
	import { onMount, onDestroy } from 'svelte';
	import { derived, get } from 'svelte/store';
	import * as process from 'process';
	window.process = process;

	const roomId = $page.params.id as string;
	let roomEvent: ReturnType<typeof initRoomEvent>;
	onMount(() => {
		roomEvent = initRoomEvent({ roomId });
	});

	onDestroy(() => {
		roomEvent?.destroy();
	});

	const handleOpenCam = () => {
		roomEvent?.openCam();
	};
	const handleOpenMic = () => {};

	const socketId = derived(socketState, ($socket) => $socketState.id);

	const clients = derived(room, ($room) => Object.values($room.clientsMap));

	export const me = derived(room, ($room) => {
		return $room.me;
	});

	const users = derived(clients, ($clients) => $clients.map((c) => c.socketId));

	export const othersCam = derived(clients, ($clients) => {
		const infos = $clients.filter((client) => !client.initiator);

		return infos.map((info) => ({
			id: info.socketId,
			srcObject: info.stream as MediaStream,
			autoplay: true,
			className: 'live-webcam'
		}));
	});

	const handleChat = () => {
		roomEvent?.sendText(JSON.stringify({ socketId: get(socketId), msg: 'hahahahhahahahahahahah' }));
	};
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
	<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleChat}>
		chat hahaha
	</Button>
	<hr />
	<div class="scroll-m-9">
		{#each $users as u}
			<h3>{u}</h3>
		{/each}
	</div>
	<hr />
	{#if !!$room?.me.wc}
		<section>
			<h3>my cam</h3>
			<video use:srcObject={$room?.me.wc} autoplay width="400" height="400">
				<track kind="captions" src="" />
			</video>
		</section>
	{/if}

	{#each $othersCam as c}
		{#if !!c?.srcObject}
			<section
				class="bg-red-600"
				on:click={() => {
					document.getElementById(`video${c.id}`).play();
				}}
			>
				<h3>{c.id}</h3>
				<video use:srcObject={c.srcObject} autoplay width="400" height="400" id={`video${c.id}`}>
					<track kind="captions" src="" />
				</video>
			</section>
		{/if}
	{/each}
</section>
