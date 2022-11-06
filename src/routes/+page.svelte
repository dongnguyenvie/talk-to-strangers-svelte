<script lang="ts">
	import { ROUTES } from '$lib/@core/constants';

	import Redirect from '$lib/components/redirect.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="homepage" />
</svelte:head>

<!-- <section>
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
		isFull
	/>
</section> -->

<Redirect to={ROUTES.rooms} />

<style>
</style>
