<script lang="ts">
	import logo from '$lib/icons/logo.svg';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { appSettings } from '$lib/state';
	import { sidebarConfig } from './sidebar.config';
	const { onToggleCollapse, isCollapse } = appSettings;
	export let className: string = '';
</script>

<aside
	class={`bg-white ${className} transition-[width] ${
		$isCollapse ? 'w-[55px]' : 'w-[280px]'
	} z-10 fixed h-[100vh] top-0
	`}
	aria-label="Sidebar"
>
	<div class="corner pt-6 pb-[14px] px-[20px] ">
		<a href="/">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>
	<div class="user-info mx-[20px] mt-[18px] mb-4 py-[18px] px-[20px] rounded-xl flex items-center">
		<div class="avatar mr-4">
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
	</div>
	<div class="sticky p-0 m-0 top-[90px]">
		<div class="rounded overflow-hidden">
			<ul class="space-y-2 mx-4 ">
				{#each sidebarConfig as item}
					<li
						class="active px-[19px] py-[14px] rounded-lg hover:bg-primary-80 "
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
