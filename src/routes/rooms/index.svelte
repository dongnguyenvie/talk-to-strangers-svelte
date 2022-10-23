<script lang="ts">
	import { browser } from '$app/env';
	import { ROUTES } from '$lib/@core/constants';
	import { KQL_GetRooms } from '$lib/@shared/graphql/_kitql/graphqlStores';
	import RoomCard from '$lib/components/RoomCard.svelte';
	import RoomImage from '$lib/icons/image.png';
	browser &&
		KQL_GetRooms.query({
			variables: {
				input: {
					pagination: {
						page: 1,
						limit: 10000
					}
				}
			}
		});

	const handleJoinRoom = (id: string) => () => {
		window.open(ROUTES.roomDetail.replace('{{id}}', id), '_blank');
	};
</script>

<div class="list-room">
	{#each $KQL_GetRooms.data?.getRooms.data || [] as room}
		<div class="inline-flex w-full">
			<RoomCard
				name={room.description || 'random description'}
				title={room.topic}
				tags={['freedom']}
				avatar={RoomImage}
				emotions={[]}
				id={room.id || ''}
				isFull={false}
				onClick={handleJoinRoom(room.id || '')}
			/>
		</div>
	{/each}
</div>
<style>
	.list-room{
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(344px, 1fr));
		column-gap: 24px;
		row-gap: 64px;
	}
</style>