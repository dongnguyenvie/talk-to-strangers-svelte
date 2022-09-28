<script lang="ts">
	import { browser } from '$app/env';
	import { ROUTES } from '$lib/@core/constants';
	import { KQL_GetRooms } from '$lib/@shared/graphql/_kitql/graphqlStores';
	import RoomCard from '$lib/components/RoomCard.svelte';

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

<div class="flex flex-wrap">
	{#each $KQL_GetRooms.data?.getRooms.data || [] as room}
		<div class="inline-flex w-full sm:w-1/2 md:w-1/3">
			<RoomCard
				name={room.description || 'random description'}
				title={room.topic}
				tags={['freedom']}
				avatar={'https://i.pravatar.cc/300'}
				emotions={[]}
				id={room.id || ''}
				isFull={false}
				onClick={handleJoinRoom(room.id || '')}
			/>
		</div>
	{/each}
</div>
