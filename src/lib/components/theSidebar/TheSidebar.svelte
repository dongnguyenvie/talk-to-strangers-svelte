<script lang="ts">
	import { appSettings } from '$lib/state';
	import Fa from 'svelte-fa';
	import { faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
	import { sidebarConfig } from './sidebar.config';
	import { goto } from '$app/navigation';
	const { onToggleCollapse, isCollapse } = appSettings;
	export let className: string = '';
</script>

<aside
	class={`${className} relative transition-[width] ${$isCollapse ? 'w-[55px]' : 'w-[280px]'}`}
	aria-label="Sidebar"
>
	<div class="sticky p-0 m-0 top-[90px]">
		<div class="relative">
			<span
				class={`absolute top-2 inline-flex z-20 px-1 cursor-pointer text-main-900 hover:text-main-400 ${
					$isCollapse ? '-right-5' : 'right-0'
				}`}
				on:click={onToggleCollapse}
			>
				{#if !$isCollapse}
					<Fa icon={faAngleDoubleLeft} />
				{/if}
			</span>
		</div>
		<div class="rounded border-r border-dashed overflow-hidden">
			<ul class="space-y-2">
				{#if $isCollapse}
					<li>
						<span
							class="flex items-center p-2 px-4 text-base font-normal rounded-lg hover:bg-gray-100 cursor-pointer text-main-900 hover:text-main-400"
							on:click={onToggleCollapse}
						>
							<Fa icon={faAngleDoubleRight} />
						</span>
					</li>
				{/if}

				{#each sidebarConfig as item}
					<li>
						<a
							href="#"
							class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg  hover:bg-gray-100 "
							on:click={() => {
								goto(item.path);
							}}
						>
							<span class="px-2">
								<img class="w-full min-w-[24px]" src={item.icon} alt={item.name} />
							</span>
							<span class="ml-2 flex-shrink">{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</aside>

<style>
</style>
