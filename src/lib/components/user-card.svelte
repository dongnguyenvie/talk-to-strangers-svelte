<script lang="ts">
	import type { Client } from '$lib/types';
	import type { SocketID } from '$lib/types/socket';
	import Icon from 'svelte-awesome';
	import { faMicrophoneSlash, faVideoCamera, faGear } from '@fortawesome/free-solid-svg-icons';
	// import {} from '@fortawesome/free-brands-svg-icons';

	export let watchersMap = {} as Record<string, any>;
	export let client: Client;
	export let idSelected: SocketID;
	export let myId: SocketID;

	export let onFocusOn: (id: SocketID) => void;

	const handleFocusOn = (id: SocketID) => () => {
		onFocusOn(id);
	};
</script>

<div class={`relative max-w-[96px] min-w-[60px] ml-1`} title={client.socketId}>
	<div class="flex h-[33px] gap-1 items-end pb-1">
		{#each watchersMap[client.socketId] || [] as watcher}
			<span
				class={`w-[16px] h-[16px] overflow-hidden rounded-full inline-flex ${
					client.socketId == watcher.socketId
						? 'border-2 w-[20px] h-[20px] rounded-sm border-red-600'
						: ''
				}`}
			>
				<img class="block object-cover w-full h-full" src={client.avatar} alt={client.socketId} />
			</span>
		{/each}
	</div>

	<div
		class={`relative cursor-pointer w-[96px] h-[96px] rounded-sm ${
			client.socketId === idSelected ? 'avatar-active' : ''
		}`}
		on:click={handleFocusOn(client.socketId)}
	>
		<img
			class="block object-cover w-full h-full rounded-sm"
			src={client.avatar}
			alt={client.socketId}
		/>
		<div>
			{#if client.isVideo}
				<span
					class="absolute w-full h-full top-0 left-0 flex justify-center items-center opacity-60"
				>
					<Icon data={faVideoCamera} scale={2.5} />
				</span>
			{/if}
			{#if client.socketId !== myId}
				<span
					class="absolute top-0 right-0 border border-zinc-500 rounded-lg inline-flex justify-center items-center w-[25px] h-[25px]"
				>
					<Icon data={faGear} />
				</span>
			{/if}

			{#if !client.isAudio}
				<span
					class="absolute bottom-1 right-1 border-1 bg-slate-400 p-1 rounded-md cursor-pointer text-main-a400"
				>
					<Icon data={faMicrophoneSlash} label="open camera" flip="horizontal" scale={1.2} />
				</span>
			{/if}
		</div>
	</div>
</div>
