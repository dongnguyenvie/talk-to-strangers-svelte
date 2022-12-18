<script lang="ts">
	import InputDevicesDialog from '$lib/components/dialogs/input-devices-dialog.svelte';
	let isOpen = false;

	const handleToggleDialog = () => {
		isOpen = !isOpen;
	};

	const handleCloseDialog = () => {
		isOpen = false;
	};
</script>

<button on:click={handleToggleDialog}>[Setting Device]</button>
<InputDevicesDialog {isOpen} onClose={handleCloseDialog} />
