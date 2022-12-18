<script lang="ts">
	import Fa from 'svelte-fa';
	import {
		faMicrophoneSlash,
		faVideoCamera,
		faVideoSlash,
		faMicrophone,
		faPhone,
		faAlignRight,
		faAngleRight,
		faWarning
	} from '@fortawesome/free-solid-svg-icons';
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
	import { browser } from '$app/environment';
	import UserCard from '$lib/components/user-card.svelte';
	import ChatInput from '$lib/components/chat/chat-input.svelte';
	import Icon from 'svelte-awesome';
	import { USER_ACCESSABLE } from '$lib/@core/constants';
	import { Avatar } from 'flowbite-svelte';
	import InputDevicesDialog from '$lib/components/dialogs/input-devices-dialog.svelte';
	import DeviceSetting from '$lib/components/device-setting/device-setting.svelte';

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
		mediaSelected,
		accessable,
		userInfoMap
	} = room;

	const roomId = $page.params.id as string;
	let roomEvent: ReturnType<typeof initRoomEvent>;

	onDestroy(() => {
		roomEvent?.destroy();
	});

	let navCollapse = false;

	const usersId = derived(clients, ($clients) => $clients.map((c) => c.sid));

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

	const handleOutRoom = () => {
		const text = 'Do you want to out room?';
		if (confirm(text)) {
			window.location.reload();
		} else {
		}
	};

	const handleToggleNav = () => {
		navCollapse = !navCollapse;
	};

	const handleBackToHome = () => {
		window.location.replace('/');
	};
</script>

{#if $accessable == USER_ACCESSABLE.waiting}
	<section class="bg-slate-800 fixed left-0 top-0 w-screen h-screen">
		<div class="w-full h-full flex justify-center items-center">
			<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleEnterRoom}>
				Join room
			</Button>
		</div>
	</section>
{/if}

{#if $accessable == USER_ACCESSABLE.full}
	<section class="bg-slate-800 fixed left-0 top-0 w-screen h-screen">
		<div class="w-full h-full flex justify-center items-center">
			<div class="flex flex-col gap-1 items-center">
				<span class="text-red-600 font-bold flex items-center text-4xl ml-3"
					><Icon data={faWarning} scale={3} class="text-red-600" />
					<span class="ml-2">Room full</span>
				</span>
				<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleBackToHome}>
					Back to Home
				</Button>
			</div>
		</div>
	</section>
{/if}

{#if $accessable == USER_ACCESSABLE.duplicateUser}
	<section class="bg-slate-800 fixed left-0 top-0 w-screen h-screen">
		<div class="w-full h-full flex justify-center items-center">
			<div class="flex flex-col gap-1 items-center">
				<span class="text-red-600 font-bold flex items-center text-4xl ml-3"
					><Icon data={faWarning} scale={3} class="text-red-600" />
					<span class="ml-2">Your account join this room from other place</span>
				</span>
				<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleBackToHome}>
					Back to Home
				</Button>
			</div>
		</div>
	</section>
{/if}

{#if $accessable == USER_ACCESSABLE.accepted}
	<div class="flex flex-grow flex-row justify-between relative h-full bg-slate-800 max-h-screen">
		<section class="flex flex-col justify-between w-full flex-shrink">
			<section class="flex justify-center py-2 ">
				<div class="bg-slate-900 p-3 rounded-md">
					<!-- mic -->
					{#if !$myMedia?.audioStream}
						<span
							class="border-2 border-main-a400 p-1 rounded-md cursor-pointer text-main-a400"
							on:click={handleOpenMic}
						>
							<Icon data={faMicrophone} label="open camera" flip="horizontal" scale={1.2} />
						</span>
					{/if}

					{#if $myMedia?.audioStream}
						<span
							class="border-2 border-main-a400 p-1 rounded-md cursor-pointer text-main-a400"
							on:click={handleOffMic}
						>
							<Icon data={faMicrophoneSlash} label="open camera" flip="horizontal" scale={1.2} />
						</span>
					{/if}
					<!-- end-mic -->

					<!-- webcam -->
					{#if !$myMedia?.mediaStream}
						<span
							class="border-2 border-main-a400 p-1 rounded-md cursor-pointer text-main-a400"
							on:click={handleOpenCam}
						>
							<Icon data={faVideoCamera} label="open camera" flip="horizontal" scale={1.2} />
						</span>
					{/if}

					{#if $myMedia?.mediaStream}
						<span
							class="border-2 border-main-a400 p-1 rounded-md cursor-pointer text-main-a400"
							on:click={handleOffCam}
						>
							<Icon data={faVideoSlash} label="open camera" flip="horizontal" scale={1.2} />
						</span>
					{/if}
					<!-- end webcam -->

					<span
						class="border-2 border-main-a400 p-1 rounded-md cursor-pointer text-main-a400 rotate-6"
						on:click={handleOutRoom}
					>
						<Icon
							data={faPhone}
							label="open camera"
							scale={1.2}
							style={`transform:rotate(133deg)`}
						/>
					</span>

					<!-- <Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleChat}>
						send text stream
					</Button> -->
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

		<section class={navCollapse ? 'w-[30px] shadow-lg' : 'w-[320px] shadow-lg'}>
			<div class="flex flex-col justify-between w-full h-full">
				<div class="h-[45px] bg-slate-700 flex flex-row justify-between items-center px-2">
					<div>
						<DeviceSetting />
					</div>
					<span class="cursor-pointer" on:click={handleToggleNav}>
						<Icon data={faAngleRight} />
					</span>
				</div>

				<div class="flex-grow bg-slate-400 overflow-y-auto px-2 py-2">
					<div class="grid grid-cols-1 gap-2">
						{#each $messages as message}
							<p class="w-full">
								<span class="float-left" title={$userInfoMap[message.createBy].name || ''}>
									<Avatar size="xs" src={$userInfoMap[message.createBy].avatar}
										>{$userInfoMap[message.createBy].name?.[0] || ''}
									</Avatar>
								</span>
								<span class="ml-1">
									{message.content || ''}
								</span>
							</p>
						{/each}
					</div>
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
	<div aria-hidden="true" class="hidden">
		{#each $clientsAudio as media}
			{#if media.audioStream}
				<audio controls autoplay loop use:srcObject={nonNullAssert(media.audioStream)} />
			{/if}
		{/each}
	</div>
	<InputDevicesDialog />
{/if}
