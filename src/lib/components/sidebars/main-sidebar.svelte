<script lang="ts">
	import logo from '$lib/icons/logo.svg';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { appSettings } from '$lib/state';
	import { sidebarConfig } from './sidebar.config';
	import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
	import Icon from 'svelte-awesome';

	const { onToggleCollapse, isCollapse } = appSettings;
	export let className: string = '';
</script>

<aside
	class={`bg-white ${className} transition-[width] ${
		$isCollapse ? 'w-[45px]' : 'w-[280px]'
	} z-10 fixed h-[100vh] top-0 overflow-hidden`}
>
	<div class="corner md:pt-2 md:px-[20px] min-h-[90px]">
		{#if !$isCollapse}
			<a href="/">
				<img src={logo} class="w-full max-w-[150px]" alt="SvelteKit" />
			</a>
		{/if}
	</div>

	<div class={`flex ${$isCollapse ? '' : 'justify-end'} px-3 py-2`}>
		{#if $isCollapse}
			<button on:click={onToggleCollapse}> <Icon data={faAnglesRight} /></button>
		{:else}
			<button on:click={onToggleCollapse}> <Icon data={faAnglesLeft} /></button>
		{/if}
	</div>

	<!-- <div class="bg-gray-300 px-2 flex overflow-hidden h-[60px] rounded-xl py-2">
		<div class="avatar mr-4 overflow-hidden">
			<img
				class="rounded-full w-[40px] h-[40px]"
				src="https://i.pravatar.cc/300"
				alt="avatar-user"
			/>
		</div>
		<div class="info-content">
			<p class="username text-sm font-bold leading-[22px]">Carlota Monteiro</p>
			<p class="role text-sm font-normal leading-[22px]">Admin</p>
		</div>
	</div> -->

	<div class="sticky p-0 m-0 top-[90px] mt-4">
		<div class="rounded overflow-hidden">
			<ul class="space-y-2">
				{#each sidebarConfig as item}
					<li
						class="active py-[14px] rounded-lg hover:bg-primary-80 "
						class:active={$page.url.pathname === item.path}
					>
						<a
							href="#"
							class="flex items-center text-base font-normal"
							on:click={() => {
								goto(item.path);
							}}
						>
							<span class="px-2">
								{@html item.icon($page.url.pathname === item.path ? '#4DB6AC' : '#637381')}
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
	.user-info {
		background-color: var(--bg-gray-80);
	}
	.role {
		color: var(--text-secondary);
	}
	li.active {
		@apply bg-primary-80;
	}
	li.active span {
		@apply text-main-300 font-bold;
	}
	li span {
		color: var(--text-secondary);
	}
	aside {
		border-right: 1px dashed rgba(145, 158, 171, 0.24);
	}
</style>
