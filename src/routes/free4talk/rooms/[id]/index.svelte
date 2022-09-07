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
	const handleOpenMic = () => {
		roomEvent?.openMic();
	};

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
			srcObject: info.mediaStream as MediaStream,
			autoplay: true,
			className: 'live-webcam'
		}));
	});

	const usersMedia = derived([me, clients], ($values) => {
		const [me, clients] = $values;
		const medias = clients.map((client) => {
			const streams = client.peer.streams[0];
			console.log({ streams, xx: client.peer });
			return {
				mediaStream: client.mediaStream,
				audioStream: client.audioStream,
				avatar: '',
				socketId: client.socketId,
				id: ''
			};
		});
		return [
			...medias,
			{ mediaStream: me.mediaStream, audioStream: '', avatar: '', socketId: me.socketId, id: '' }
		];
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

	<div class="flex flex-nowrap">
		{#each $usersMedia as media}
			<section
				class="bg-red-600 w-[200px] ml-1"
				on:click={() => {
					document.getElementById(`video${media.socketId}`)?.play();
				}}
			>
				<h3>{media.socketId}</h3>
				<div class="relative w-[200px] h-[200px]">
					<video
						use:srcObject={media.mediaStream}
						autoplay
						id={`video${media.socketId}`}
						class="absolute w-full h-full object-fill "
					>
						<track kind="captions" src="" />
					</video>
					<div class="absolute bottom-0 bg-green-700">
						{#if media.mediaStream}
							<p>Video: on</p>
						{/if}
						{#if media.audioStream}
							<p>audio: on</p>
						{/if}
					</div>
				</div>
			</section>
		{/each}
	</div>
	<div>
		all audio

		{#each $usersMedia as media}
			{#if media.audioStream}
				<video
					use:srcObject={media.audioStream}
					autoplay
					id={`audio${media.socketId}`}
					class="absolute w-full h-full object-fill "
				>
					<track kind="captions" src="" />
				</video>
			{/if}
		{/each}
	</div>

	<!-- {#each $othersCam as c}
		{#if !!c?.srcObject}
			<section
				class="bg-red-600"
				on:click={() => {
					document.getElementById(`video${c.id}`)?.play();
				}}
			>
				<h3>{c.id}</h3>
				<video use:srcObject={c.srcObject} autoplay width="400" height="400" id={`video${c.id}`}>
					<track kind="captions" src="" />
				</video>
			</section>
		{/if}
	{/each} -->
</section>
