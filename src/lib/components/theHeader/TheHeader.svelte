<script lang="ts">
	// import { page } from '$app/stores';
	import logo from '$lib/icons/logo.svg';
	export let className: string = '';
</script>

<header
	class={`sticky top-0 left-0 z-10 flex justify-between px-5 py-2 bg-main-cFAFAFA ${className}`}
>
	<div class="corner">
		<a href="/">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

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

	<div>
		<img
			src="https://i.pravatar.cc/300"
			alt=""
			class="w-[50px] h-[50px] rounded-full border border-gray-500"
		/>
	</div>
</header>

<style>
</style>
