<script context="module" lang="ts">
</script>

<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import RoomCard from '$lib/components/room-card.svelte';
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
		onClick={() => {}}
		emotions={['1', '2', '3']}
		id="xxx"
	/>
	<div class="h-[1px] bg-red-700 w-full my-2" />
	<div>
		<Button className="bg-main-500 rounded-lg hover:bg-main-800">xx1</Button>
	</div>
</section>

<style>
	section {
		/* display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1; */
	}
</style>
