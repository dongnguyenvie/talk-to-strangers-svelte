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

	onDestroy(() => {
		roomEvent?.destroy();
	});

	const accessable = derived(room, ($room) => $room.accessable);

	const mySocketId = derived(socketState, ($socket) => $socket.id);

	const clients = derived(room, ($room) => Object.values($room.clientsMap));

	const users = derived(clients, ($clients) => $clients.map((c) => c.socketId));

	const usersMedia = derived(clients, ($clients) => {
		const medias = $clients.map((client) => {
			return {
				mediaStream: client.mediaStream,
				audioStream: client.audioStream,
				avatar: '',
				socketId: client.socketId,
				id: ''
			};
		});
		return [...medias];
	});

	const handleChat = () => {
		roomEvent?.sendText(
			JSON.stringify({ socketId: get(mySocketId), msg: 'hahahahhahahahahahahah' })
		);
	};

	const handleEnterRoom = () => {
		roomEvent = initRoomEvent({ roomId });
	};

	const handleOpenCam = () => {
		roomEvent?.openCam();
	};
	const handleOpenMic = () => {
		roomEvent?.openMic();
	};
</script>

{#if !$accessable}
	<section class="bg-slate-800 fixed left-0 top-0 w-screen h-screen">
		<div class="w-full h-full flex justify-center items-center">
			<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleEnterRoom}>
				Join room
			</Button>
		</div>
	</section>
{/if}

{#if $accessable}
	<section>
		<h1>room {roomId}</h1>
		<h2>socketId {$mySocketId}</h2>
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
					<audio controls autoplay use:srcObject={media.audioStream} />
				{/if}
			{/each}
		</div>
	</section>
{/if}
