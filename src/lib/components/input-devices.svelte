<script lang="ts">
	import { onMount } from 'svelte';
	import * as R from 'ramda';

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
</script>

<p>
	Audio input source:
	<select>
		{#each audioInput as device}
			<option value={device.deviceId}>{device.label}</option>
		{/each}
	</select>

	<select>
		{#each videoinput as device}
			<option value={device.deviceId}>{device.label}</option>
		{/each}
	</select>
</p>
