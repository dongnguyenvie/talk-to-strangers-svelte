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
	import type { SocketID } from '$lib/types/socket';
	window.process = process;

	const { clients, clientsAudio, clientSelected, onSetSelected } = room;

	const roomId = $page.params.id as string;
	let roomEvent: ReturnType<typeof initRoomEvent>;
	let media: MediaStream;

	onDestroy(() => {
		roomEvent?.destroy();
	});

	const accessable = derived(room, ($room) => $room.accessable);

	const mySocketId = derived(socketState, ($socket) => $socket.id);

	const usersId = derived(clients, ($clients) => $clients.map((c) => c.socketId));

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

	const handleViewMedia = (socketId: SocketID) => () => {
		roomEvent?.requestViewCamera(socketId);
		onSetSelected(socketId);
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
	<section class="flex flex-col justify-between relative h-full max-h-screen ">
		<section class="flex justify-center py-2">
			<div>
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
			</div>
		</section>
		<section class="h-full overflow-hidden]">
			<div class="flex justify-center items-center bg-slate-700 w-full h-full">
				{#if !!$clientSelected}
					<div class="bg-black w-full h-full">
						<video
							use:srcObject={nonNullAssert($clientSelected?.mediaStream)}
							autoplay
							class="w-full h-full scale-x-[-1] object-contain"
						>
							<track kind="captions" src="" />
						</video>
					</div>
				{/if}
			</div>
		</section>

		<section class="flex flex-nowrap">
			{#each $clients as client}
				<section class="max-w-[96px] min-w-[60px] ml-1" title={client.socketId}>
					<h3>{client.socketId}</h3>
					<div class={`relative  cursor-pointer`} on:click={handleViewMedia(client.socketId)}>
						<img
							class="block object-cover w-full h-full"
							src={client.avatar}
							alt={client.socketId}
						/>
						<div class={`absolute bottom-0 bg-green-700`}>
							{#if client.isVideo}
								<p>Video: on</p>
							{/if}
							{#if client.isAudio}
								<p>audio: on</p>
							{/if}
						</div>
					</div>
				</section>
			{/each}
		</section>

		<div aria-hidden="true" class="hidden">
			{#each $clientsAudio as media}
				{#if media.audioStream}
					<audio controls autoplay use:srcObject={nonNullAssert(media.audioStream)} />
				{/if}
			{/each}
		</div>
	</section>
{/if}
