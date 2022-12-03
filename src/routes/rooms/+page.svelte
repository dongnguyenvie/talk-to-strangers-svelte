<script lang="ts">
	import RoomImage from '$lib/icons/image.png';
	import PlusIcon from '$lib/icons/ic_plus.svg';
	import FilterIcon from '$lib/icons/ic_filter.svg';
	import DownIcon from '$lib/icons/ic_chevron_down.svg';
	import { browser } from '$app/environment';
	import { ROUTES } from '$lib/@core/constants';
	import RoomCard from '$lib/components/room-card.svelte';
	import Tag from '$lib/components/tag.svelte';
	import CreateRoomDialog from '$lib/components/dialogs/create-room-dialog.svelte';
	import { GQL_getRooms, GQL_onRoomSynced, GQL_deleteRoom, type getRooms$result } from '$houdini';
	import { onDestroy } from 'svelte';
	import { auth } from '$lib/state';
	import Authencation from '$lib/components/authencation.svelte';
	import { RecordAction } from '$lib/@core/enums';
	import { nonNullAssert } from '$lib/@shared/util/operator';

	let isCreateRoomDialog = false;

	const handleToggleCreateRoomDialog = () => {
		isCreateRoomDialog = !isCreateRoomDialog;
	};

	const handleCloseCreateRoomDialog = () => {
		isCreateRoomDialog = false;
	};

	const handleDeleteRoom = (id: string) => () => {
		GQL_deleteRoom.mutate({
			input: {
				id: id
			}
		});
	};

	browser &&
		GQL_getRooms.fetch({
			variables: {
				input: {
					pagination: {
						page: 1,
						limit: 10000
					}
				}
			}
		});
	GQL_onRoomSynced.listen(null);

	let roomMap = {} as Record<string, getRooms$result['getRooms']['data'][0]>;
	$: {
		($GQL_getRooms.data?.getRooms.data || []).forEach((data) => {
			roomMap[data.id] = data;
		});
	}
	$: {
		if (!!$GQL_onRoomSynced?.onRoomSynced) {
			if ($GQL_onRoomSynced?.onRoomSynced.action === RecordAction.insert) {
				roomMap[$GQL_onRoomSynced?.onRoomSynced.room.id] = $GQL_onRoomSynced?.onRoomSynced.room;
			}
			if ($GQL_onRoomSynced?.onRoomSynced.action === RecordAction.update) {
				roomMap[$GQL_onRoomSynced?.onRoomSynced.room.id] = $GQL_onRoomSynced?.onRoomSynced.room;
			}
			if ($GQL_onRoomSynced?.onRoomSynced.action === RecordAction.delete) {
				delete roomMap[$GQL_onRoomSynced?.onRoomSynced.room.id];
				roomMap = roomMap;
			}
		}
	}

	onDestroy(() => {
		GQL_onRoomSynced.unlisten();
	});

	$: rooms = Object.values(roomMap || {}).sort((a, b) => b.createdAt - a.createdAt);

	const handleJoinRoom = (id: string) => () => {
		window.open(ROUTES.roomDetail.replace('{{id}}', id), '_blank');
	};
</script>

<div>
	<div class="toolbar mb-[40px]">
		<h3 class="text-primary text-2xl leading-[36px] font-bold">Phòng chờ</h3>
		<div class="toolbar-items mt-[40px] flex gap-x-[50px] gap-y-[20px] items-center flex-wrap">
			<Authencation>
				<button
					class="btn-talk w-[126px] bg-main-300 flex justify-center items-center py-[6px]"
					on:click={handleToggleCreateRoomDialog}
				>
					<img class="pr-[4px]" src={PlusIcon} alt="" />
					<span class="font-bold text-sm leading-[24px] text-white"> Tạo Phòng </span>
				</button>
			</Authencation>
			<Tag>Nhóm Tuổi</Tag>
			<Tag>Giới Tính</Tag>
			<Tag>Loại Phòng</Tag>
			<Tag>Tiêu Chí Người Nghe</Tag>
			<button class="btn-filter flex items-center py-[6px]">
				<span class="pr-[11px] font-bold text-sm leading-[24px] text-primary"> Lọc Kết Quả </span>
				<img class="pr-[4px]" src={FilterIcon} alt="" />
			</button>
			<button class="btn-filter flex items-center py-[6px]">
				<span class="pr-[11px] font-bold text-sm leading-[24px] text-primary"> Sắp Xếp:</span>
				<img class="pr-[4px]" src={DownIcon} alt="" />
			</button>
		</div>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
		{#each rooms || [] as room}
			<div class="inline-flex w-full">
				<RoomCard
					name={room.description || ''}
					title={room.topic || ''}
					tags={[]}
					avatar={RoomImage}
					emotions={[]}
					id={room.id || ''}
					isFull={false}
					onClick={handleJoinRoom(room.id || '')}
					clients={room.clients || []}
					capacity={room.capacity || 0}
					lastUpdatedAt={nonNullAssert(room.updatedAt)}
					disabledButton={!$auth.id || room.clients.length >= room.capacity}
					onDelete={handleDeleteRoom(room.id)}
				/>
			</div>
		{/each}
	</div>
</div>
<CreateRoomDialog isOpen={isCreateRoomDialog} onClose={handleCloseCreateRoomDialog} />

<style>
</style>
