<script lang="ts">
	import { PLAYHOLDER_AVATAR } from '$lib/@core/constants';
	import { Avatar } from 'flowbite-svelte';

	export let client: any;

	const handleViewDetail = () => {
		alert('You can not view profile');
	};
</script>

{#if !client}
	<Avatar class="bg-transparent border-dashed border cursor-not-allowed"><span /></Avatar>
{/if}

{#if !!client}
	<span class="cursor-pointer" on:click={handleViewDetail}>
		<Avatar src={client?.avatar || PLAYHOLDER_AVATAR}>..</Avatar>
	</span>
{/if}
