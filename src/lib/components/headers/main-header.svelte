<script lang="ts">
	import RingIcon from '$lib/icons/ic_ring.svg';
	import UserGroupIcon from '$lib/icons/ic_user_group.svg';
	import { userPicture } from '$lib/state';

	export let className: string = '';
</script>

<header class={`sticky top-0 left-0 z-10 flex justify-end px-5 py-2 bg-white ${className}`}>
	<!-- <nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.url.pathname === '/'}><a sveltekit:prefetch href="/">Home</a></li>
			<li class:active={$page.url.pathname === '/about'}>
				<a sveltekit:prefetch href="/about">About</a>
			</li>
			<li class:active={$page.url.pathname === '/todos'}>
				<a sveltekit:prefetch href="/todos">Todos</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav> -->

	<div class="">
		<ul class="flex items-center gap-x-[32px]">
			<!-- <li>
				<img src={FlagEnIcon} alt="" />
			</li> -->
			<li>
				<img src={RingIcon} alt="" />
			</li>
			<li>
				<img src={UserGroupIcon} alt="" />
			</li>
			<li>
				<img
					src={$userPicture}
					alt=""
					class="w-[44px] h-[44px] rounded-full border border-gray-500"
				/>
			</li>
		</ul>
	</div>
</header>

<style>
</style>
