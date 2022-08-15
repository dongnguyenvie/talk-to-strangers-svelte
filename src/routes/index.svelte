<script context="module" lang="ts">
	export const prerender = true;
	export const xxxx = 'helloooo';
</script>

<script lang="ts">
	import RoomCard from '$lib/components/RoomCard.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<RoomCard
		name="Hà Kiều Oanh"
		title="Oanh Cần người  trò chuyện, mới cãi nhau với bạn trai"
		avatar="https://www.w3schools.com/w3images/avatar2.png"
		tags={[
			'Tình yêu',
			'Bản thân',
			'Coffee',
			'Du lịch',
			'Tình yêu',
			'Bản thân',
			'Coffee',
			'Du lịch'
		]}
		onButtonClick={() => {}}
		emotions={['1', '2', '3']}
		id="xxx"
	/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
