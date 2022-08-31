<script lang="ts">
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
					onClick={() => {
						alert(1);
					}}
				/>
			</div>
		{/each}
	{/await}
</div>
