<script lang="ts">
	import { page } from '$app/stores';
	import { srcObject } from '$lib/@shared/directives/src-object.directive';
	import { initRoomEvent } from '$lib/@shared/socket/events';
	import Button from '$lib/components/Button.svelte';
	import { room, socketState } from '$lib/state';
	import { onDestroy } from 'svelte';
	import { derived, get } from 'svelte/store';
	import * as process from 'process';
	import { nonNullAssert } from '$lib/@shared/util/operator';
	window.process = process;

	const { clients, clientsAudio } = room;

	const roomId = $page.params.id as string;
	let roomEvent: ReturnType<typeof initRoomEvent>;
	let media: MediaStream;

	onDestroy(() => {
		roomEvent?.destroy();
	});

	const accessable = derived(room, ($room) => $room.accessable);

	const mySocketId = derived(socketState, ($socket) => $socket.id);

	const usersId = derived(clients, ($clients) => $clients.map((c) => c.socketId));

	// const usersMedia = derived(clients, ($clients) => {
	// 	const medias = $clients.map((client) => {
	// 		return {
	// 			mediaStream: client.mediaStream,
	// 			audioStream: client.audioStream,
	// 			avatar: '',
	// 			socketId: client.socketId,
	// 			id: ''
	// 		};
	// 	});
	// 	return [...medias];
	// });

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
	const handleOpenMedia = (newMedia: MediaStream) => {
		media = newMedia;
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
		<h2>My socketId {$mySocketId}</h2>
		<div class="scroll-m-9">
			all users: {$usersId.join(', ')}
		</div>
		<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOpenCam}>
			open cam
		</Button>
		<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOpenMic}>
			open mic
		</Button>
		<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleChat}>
			chat hahaha
		</Button>
		<hr />
		<div class="relative bg-slate-700 h-96 w-96">
			{#if media}
				<video use:srcObject={media} autoplay class="absolute w-full h-full object-fill ">
					<track kind="captions" src="" />
				</video>
			{/if}
		</div>

		<hr />

		<div class="flex flex-nowrap">
			{#each $clients as client}
				<section class="bg-red-600 w-[200px] ml-1">
					<h3>{client.socketId}</h3>
					<div
						class={`relative w-[200px] h-[200px]  ${!!client.mediaStream ? 'cursor-pointer' : ''}`}
						on:click={() => handleOpenMedia(nonNullAssert(client.mediaStream))}
					>
						<!-- <video
							use:srcObject={nonNullAssert(media.mediaStream)}
							autoplay
							id={`video${media.socketId}`}
							class="absolute w-full h-full object-fill "
						>
							<track kind="captions" src="" />
						</video> -->
						<div class={`absolute bottom-0 bg-green-700`}>
							{#if client.mediaStream}
								<p>Video: on</p>
							{/if}
							{#if client.audioStream}
								<p>audio: on</p>
							{/if}
						</div>
					</div>
				</section>
			{/each}
		</div>

		<div aria-hidden="true" class="hidden">
			{#each $clientsAudio as media}
				{#if media.audioStream}
					<audio controls autoplay use:srcObject={nonNullAssert(media.audioStream)} />
				{/if}
			{/each}
		</div>
	</section>
{/if}
