<script lang="ts">
	import ic_shape from '$lib/icons/ic_shape.svg';
	import Button from './button.svelte';
	import Tag from './tag.svelte';

	export let id: string;
	export let clients: any[];
	export let capacity: number;
	export let title: string;
	export let avatar: string;
	export let name: string;
	export let tags: string[];
	export let emotions: string[];
	export let buttonLabel: string = 'Trò truyện';
	export let onClick: () => void;
	export let isFull: boolean = false;

	$: capLabel = `${clients.length} / ${capacity}`;
</script>

<div class="room w-full bg-white rounded-2xl">
	<div class="flex flex-col relative">
		<img class="rounded-tl-2xl rounded-tr-2xl " src={avatar} alt="avatar-room" />
		<div class="absolute top-[9px] right-[13px] cursor-pointer">
			<img src={ic_shape} alt="" />
		</div>
		<div class="room-info mt-[39px] p-6">
			<h5 class="text-sm leading-[22px] font-bold mb-4 text-primary capitalize">{name}</h5>
			<span class="text-body2 text-primary mb-4">{title}</span>
			<div class="mt-4 mb-4">
				{#each tags as tag, i}
					<Tag className="mb-2">{tag}</Tag>
				{/each}
			</div>

			capacity: {capLabel}

			<div class="flex justify-center">
				{#if isFull}
					<Button className="bg-main-c5B5B5B rounded-lg cursor-not-allowed">Phòng Đầy</Button>
				{/if}

				{#if !isFull}
					<Button
						className="w-[108px] px-[16px] py-[6px] text-center btn-talk bg-main-300 rounded-lg hover:bg-main-500"
						{onClick}
					>
						{buttonLabel}
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.room {
		box-shadow: 0px 12px 24px -4px rgba(145, 158, 171, 0.12);
	}
</style>
