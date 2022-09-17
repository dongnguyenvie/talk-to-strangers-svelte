<script lang="ts">
	import { ROUTES } from '$lib/@core/constants';
	import { KQL_GetRooms } from '$lib/@shared/graphql/_kitql/graphqlStores';
	import RoomCard from '$lib/components/RoomCard.svelte';

	const roomsResp = KQL_GetRooms.query({
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

<div class="flex flex-wrap">
	{#await roomsResp then resp}
		{#each resp.data?.getRooms.data || [] as room}
			<div class="inline-flex w-1/2">
				<RoomCard
					name={room.description || ''}
					title={room.topic}
					tags={[]}
					avatar={''}
					emotions={[]}
					id={room.id || ''}
					isFull={false}
					onClick={handleJoinRoom(room.id || '')}
				/>
			</div>
		{/each}
	{/await}
</div>
