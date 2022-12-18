<script lang="ts">
	import { onMount } from 'svelte';
	import * as R from 'ramda';
	import { Checkbox, Modal, Range } from 'flowbite-svelte';
	import { appSettings } from '$lib/state';
	const { micConfig } = appSettings;

	export let isOpen = false;
	export let onClose = () => {};
	const supportedConstraints = [
		{ name: 'Auto Gain Control', value: 'autoGainControl' },
		{ name: 'Echo Cancellation', value: 'echoCancellation' },
		{ name: 'Noise Suppression', value: 'noiseSuppression' }
	];

	let mediaDevices: MediaDeviceInfo[] = [];

	$: inputMap = R.groupBy(R.prop('kind'), mediaDevices);
	$: audioInput = inputMap.audioinput || [];
	$: videoinput = inputMap.videoinput || [];

	// $: audiooutput = inputMap.audiooutput || [];

	onMount(() => {
		const gotDevices = (mediaDeviceInfo: MediaDeviceInfo[]) => {
			mediaDevices = mediaDeviceInfo;
		};

		navigator.mediaDevices.enumerateDevices().then(gotDevices);
	});

	const isChecked = (key: string) => {
		return $micConfig[key as unknown as keyof typeof $micConfig];
	};
</script>

<Modal bind:open={isOpen} on:hide={onClose} size="md" autoclose={false}>
	<p>Microphone Settings</p>
	<div>
		<p>Source</p>
		<select>
			{#each audioInput as device}
				<option value={device.deviceId}>{device.label}</option>
			{/each}
		</select>
	</div>
	<div>
		<p>Advanced</p>
		<ul class="items-center w-full rounded-lg sm:flex">
			{#each supportedConstraints as item}
				<li class="w-full"><Checkbox checked={isChecked(item.value)}>{item.name}</Checkbox></li>
			{/each}
		</ul>
	</div>
	<div class="opacity-30 cursor-not-allowed">
		<p>Voice Back To Headphone Volume</p>
		<div class="flex flex-row">
			<!-- <span class="inline-flex justify-center">
				<Icon data={faVolumeUp} />
			</span> -->
			<Range value={30} />
		</div>
	</div>
	<!-- <p>
		Audio input source:

		<select>
			{#each videoinput as device}
				<option value={device.deviceId}>{device.label}</option>
			{/each}
		</select>
	</p> -->
</Modal>
