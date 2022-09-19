<script lang="ts">
	import type { Client } from '$lib/types';
	import type { SocketID } from '$lib/types/socket';

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
		class={`relative cursor-pointer w-[96px] h-[96px] ${
			client.socketId === idSelected ? 'avatar-active' : ''
		}`}
		on:click={handleFocusOn(client.socketId)}
	>
		<img class="block object-cover w-full h-full" src={client.avatar} alt={client.socketId} />
		<div class={`absolute bottom-0 bg-green-700`}>
			{#if client.isVideo}
				<p>Video: on</p>
			{/if}
			{#if client.isAudio}
				<p>audio: on</p>
			{/if}
			{#if client.socketId === myId}
				<p>me</p>
			{/if}
		</div>
	</div>
</div>
