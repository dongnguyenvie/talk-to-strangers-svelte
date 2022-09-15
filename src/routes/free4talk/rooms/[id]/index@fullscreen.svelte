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
	import { browser } from '$app/env';
	if (browser) {
		window.process = process;
	}

	const {
		clients,
		clientsAudio,
		clientSelected,
		onSetSelected,
		clientIdSelected,
		mySocketId,
		myMedia,
		watchersMap
	} = room;

	const roomId = $page.params.id as string;
	let roomEvent: ReturnType<typeof initRoomEvent>;

	onDestroy(() => {
		roomEvent?.destroy();
	});

	const accessable = derived(room, ($room) => $room.accessable);

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
	const handleOffMic = () => {
		roomEvent?.offMic();
	};
	const handleOffCam = () => {
		roomEvent?.offCam();
	};
	const handleOpenMedia = (newMedia: MediaStream) => {
		media = newMedia;
	};

	const handleViewMedia = (socketId: SocketID) => () => {
		if (socketId !== $mySocketId) {
			roomEvent?.requestViewCamera(socketId);
		}
		onSetSelected(socketId);
	};

	const handleFocusOn = (socketId: SocketID) => () => {
		roomEvent?.openFocusOn(socketId);
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
	<section class="flex flex-col justify-between relative h-full max-h-screen">
		<section class="flex justify-center py-2">
			<div>
				<h2>My socketId {$mySocketId}</h2>
				<div class="scroll-m-9">
					all users: {$usersId.join(', ')}
				</div>
				{#if !$myMedia.mediaStream}
					<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOpenCam}>
						open cam
					</Button>
				{/if}

				{#if $myMedia.mediaStream}
					<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOffCam}>
						off cam
					</Button>
				{/if}

				{#if $myMedia.audioStream}
					<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOffMic}>
						off mic
					</Button>
				{/if}
				{#if !$myMedia.audioStream}
					<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOpenMic}>
						open mic
					</Button>
				{/if}

				<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleChat}>
					send text stream
				</Button>
			</div>
		</section>

		<section class="h-full overflow-hidden">
			<div class={`flex justify-center items-center bg-slate-700 w-full h-full `}>
				{#if !!$clientSelected?.isVideo}
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

		<section class="fixed right-0 top-1/2">
			{#if $myMedia?.mediaStream}
				<div class="bg-black w-[200px] h-[200px]">
					<video
						use:srcObject={nonNullAssert($myMedia.mediaStream)}
						autoplay
						class="w-full h-full scale-x-[-1] object-contain"
					>
						<track kind="captions" src="" />
					</video>
				</div>
			{/if}
		</section>

		<section class="flex flex-nowrap items-end">
			{#each $clients as client}
				<section
					class={`relative max-w-[96px] min-w-[60px] ml-1 overflow-hidden ${
						client.socketId === $clientIdSelected ? 'border-red-800 border-4' : ''
					}`}
					title={client.socketId}
				>
					<div class="flex h-[33px] gap-1 items-end pb-1">
						{#each $watchersMap[client.socketId] || [] as watcher}
							<span
								class={`w-[16px] h-[16px] overflow-hidden rounded-full inline-flex ${
									client.socketId == watcher.socketId
										? 'border-2 w-[20px] h-[20px] rounded-sm border-red-600'
										: ''
								}`}
							>
								<img
									class="block object-cover w-full h-full"
									src={client.avatar}
									alt={client.socketId}
								/>
							</span>
						{/each}
					</div>

					<div class={`relative  cursor-pointer`} on:click={handleFocusOn(client.socketId)}>
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
							{#if client.socketId === $mySocketId}
								<p>me</p>
							{/if}
						</div>
					</div>
				</section>
			{/each}
		</section>

		<div aria-hidden="true" class="hidden">
			{#each $clientsAudio as media}
				{#if media.audioStream}
					<audio controls autoplay loop use:srcObject={nonNullAssert(media.audioStream)} />
				{/if}
			{/each}
		</div>
	</section>
{/if}
