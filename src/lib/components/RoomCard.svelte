<script lang="ts">
	import Tag from './Tag.svelte';
	import errorIcon from '$lib/icons/error.svg?raw';
	import Icon from 'svelte-icon/Icon.svelte';
	import Button from './Button.svelte';

	export let id: string;
	export let title: string;
	export let avatar: string;
	export let name: string;
	export let tags: string[];
	export let emotions: string[];
	export let buttonLabel: string = 'Trò truyện';
	export let onClick: () => void;
	export let isFull: boolean = false;
</script>

<div
	class="w-full max-w-sm bg-white rounded-lg border-black border-opacity-30 border-[1px] shadow-md dark:bg-gray-800 dark:border-gray-700 m-[14px]"
>
	<div class="flex justify-end px-4 pt-4">
		<button
			data-dropdown-toggle="dropdown"
			class="inline-block text-main-c9E9E9E dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
			type="button"
		>
			<Icon data={errorIcon} size="20px" viewBox={'0 0 45 45'} />
		</button>
	</div>
	<div class="flex flex-col items-center pb-[15px] px-[15px]">
		<img class="mb-3 w-24 h-24 rounded-full shadow-lg" src={avatar} alt="SvelteKit" />
		<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{name}</h5>
		<span class="text-body2 text-main-c5B5B5B">{title}</span>
		<div class="mt-2">
			{#each tags as tag, i}
				<Tag className="mb-2">{tag}</Tag>
			{/each}
		</div>

		<div class="mt-[70px]">
			{#if isFull}
				<Button className="bg-main-c5B5B5B rounded-lg cursor-not-allowed">Phòng Đầy</Button>
			{/if}

			{#if !isFull}
				<Button className="bg-main-500 rounded-lg hover:bg-main-800" on:click={onClick}>
					{buttonLabel}
				</Button>
			{/if}
		</div>
	</div>
</div>

<style>
</style>
