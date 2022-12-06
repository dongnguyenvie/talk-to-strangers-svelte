<script lang="ts">
	import { PLAYHOLDER_AVATAR } from '$lib/@core/constants';
	import type { IRoomUser } from '$lib/types';
	import { Avatar } from 'flowbite-svelte';

	export let client: Omit<IRoomUser, 'sid'>;

	const handleViewDetail = () => {
		alert('You can not view profile');
	};
</script>

{#if !client}
	<Avatar class="bg-transparent border-dashed border cursor-not-allowed"><span /></Avatar>
{/if}

{#if !!client}
	<span title={client?.name || ''} class="cursor-pointer" on:click={handleViewDetail}>
		<Avatar src={client?.avatar || PLAYHOLDER_AVATAR}>..</Avatar>
	</span>
{/if}
