<script lang="ts">
	// assets
	import RoomImage from '$lib/icons/image.png';
	import PlusIcon from '$lib/icons/ic_plus.svg';
	import FilterIcon from '$lib/icons/ic_filter.svg';
	import DownIcon from '$lib/icons/ic_chevron_down.svg';
	// code
	import { browser } from '$app/env';
	import { ROUTES } from '$lib/@core/constants';
	import { KQL_GetRooms } from '$lib/@shared/graphql/_kitql/graphqlStores';
	import RoomCard from '$lib/components/RoomCard.svelte';
	import Tag from '$lib/components/Tag.svelte';

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

<div>
	<div class="toolbar mb-[40px]">
		<h3 class="text-primary text-2xl leading-[36px] font-bold">Phòng chờ</h3>
		<div class="toolbar-items mt-[40px] flex gap-x-[50px] gap-y-[20px] items-center flex-wrap">
			<button class="btn-talk w-[126px] bg-main-300 flex justify-center items-center py-[6px]">
				<img class="pr-[4px]" src={PlusIcon} alt="" />
				<span class="font-bold text-sm leading-[24px] text-white"> Tạo Phòng </span>
			</button>
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
</div>

<style>
	.list-room {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(344px, 1fr));
		column-gap: 24px;
		row-gap: 64px;
	}
</style>
