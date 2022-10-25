<script lang="ts">
	import Fa from 'svelte-fa';
	import { faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/stores';
	import { srcObject } from '$lib/@shared/directives/src-object.directive';
	import { initRoomEvent } from '$lib/@shared/socket/events';
	import Button from '$lib/components/button.svelte';
	import { room } from '$lib/state';
	import { onDestroy } from 'svelte';
	import { derived, get } from 'svelte/store';
	import * as process from 'process';
	import { nonNullAssert } from '$lib/@shared/util/operator';
	import type { SocketID } from '$lib/types/socket';
	import { browser } from '$app/env';
	import UserCard from '$lib/components/user-card.svelte';
	import ChatInput from '$lib/components/chat/chat-input.svelte';
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
		watchersMap,
		messages,
		mediaSelected
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

	const handleFocusOn = (socketId: SocketID) => {
		roomEvent?.openFocusOn(socketId);
	};

	const handleChatMessage = (message: string) => {
		roomEvent?.onSendMessage(message);
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
	<div class="flex flex-row justify-between relative h-full max-h-screen">
		<section class="flex flex-col justify-between w-full flex-shrink">
			<section class="flex justify-center py-2 ">
				<div>
					{#if !$myMedia?.mediaStream}
						<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOpenCam}>
							open cam
						</Button>
					{/if}

					{#if $myMedia?.mediaStream}
						<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOffCam}>
							off cam
						</Button>
					{/if}

					{#if $myMedia?.audioStream}
						<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOffMic}>
							off mic
						</Button>
					{/if}
					{#if !$myMedia?.audioStream}
						<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleOpenMic}>
							open mic
						</Button>
					{/if}

					<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleChat}>
						send text stream
					</Button>
				</div>
			</section>

			<section class="h-full w-full relative overflow-hidden">
				<div class={`flex justify-center items-center bg-slate-700 w-full h-full `}>
					{#if !!$mediaSelected}
						<div class="bg-black w-full h-full">
							<video
								use:srcObject={nonNullAssert($mediaSelected)}
								autoplay
								class="w-full h-full scale-x-[-1] object-contain"
							>
								<track kind="captions" src="" />
							</video>
						</div>
					{/if}
					<!-- {#if !!$clientSelected?.isVideo}
						<div class="bg-black w-full h-full">
							<video
								use:srcObject={nonNullAssert($clientSelected?.mediaStream)}
								autoplay
								class="w-full h-full scale-x-[-1] object-contain"
							>
								<track kind="captions" src="" />
							</video>
						</div>
					{/if} -->
				</div>
				{#if $myMedia?.mediaStream}
					<div class="bg-black w-[200px] h-[200px] absolute bottom-0 right-0 z-10">
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

			<section class="flex flex-nowrap justify-center">
				<div class="h-[155px] flex flex-nowrap">
					{#each $clients as client}
						<UserCard
							{client}
							idSelected={nonNullAssert($clientIdSelected)}
							myId={$mySocketId}
							onFocusOn={handleFocusOn}
							watchersMap={$watchersMap}
						/>
					{/each}
				</div>
			</section>
		</section>

		<section class="w-[320px]">
			<div class="flex flex-col justify-between border w-full h-full">
				<div class="h-[45px] bg-slate-300" />
				<div class="flex-grow bg-slate-400">
					{#each $messages as message}
						<div>
							<p class="w-full break-before-all">{message.createBy}: {message.content || ''}</p>
						</div>
					{/each}
				</div>
				<div class="h-[113px] bg-slate-500 flex flex-col p-[10px] pt-0">
					<div class="h-[30px] pt-2">
						<div class="bg-red-400 w-full h-full" />
					</div>
					<ChatInput onMessage={handleChatMessage} />
				</div>
			</div>
		</section>
	</div>
{/if}

{#if $accessable}
	<div aria-hidden="true" class="hidden">
		{#each $clientsAudio as media}
			{#if media.audioStream}
				<audio controls autoplay loop use:srcObject={nonNullAssert(media.audioStream)} />
			{/if}
		{/each}
	</div>
{/if}
