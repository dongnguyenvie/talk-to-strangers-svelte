<script lang="ts">
	import {
		Modal,
		Label,
		Select,
		Button
	} from 'flowbite-svelte';
	// assets
	import micIcon from '$lib/icons/mic.svg';
	import CpuIcon from '$lib/icons/cpu.svg';
	import micPhone from '$lib/icons/mic.svg';
	import threeDot from '$lib/icons/threedot.svg';
	import cameraIcon from '$lib/icons/camera.svg';
	import speakerIcon from '$lib/icons/speaker.svg';

	export let isOpen = false;
	export let onClose = () => {};
	let micSelected = '';
	let idxSelected = 0;
	let mics = [
		{ value: 'us', name: 'United States' },
		{ value: 'ca', name: 'Canada' },
		{ value: 'fr', name: 'France' }
	];
	const handleSelectMenu = (idx: number) => {
		return () => {
			idxSelected = idx
		}
	}

	const handleResetDefault = () => {
		console.log(idxSelected);
	}

	const titleSetting = (idx: number) => {
		switch (idx) {
			case 0:
				return 'Microphone Settings'
			case 1:
				return 'Camera Settings'
			case 2:
				return 'Speaker Settings'
			default:
				return 'Settings'
		}
	}


</script>

<Modal class="bg-white" cl bind:open={isOpen} on:hide={onClose} size="lg" autoclose={false}>
	<div class="flex w-full">
		<div class="w-full md:w-[35%] lg:w-[30%]">
			<div class="-my-6 border-r border-solid border-disabled">
				<div class="py-6 pr-10 pl-[26px]">
					<h3 class="text-2xl leading-9 text-secondary mb-6 font-bold">Settings</h3>

					<ul class="w-full flex flex-col gap-y-3">
						<li on:click={handleSelectMenu(0)}
							class={`flex border-b-2 border-solid w-full pb-[18px] cursor-pointer ${idxSelected === 0 ? 'border-primary-500' : 'border-secondary-500'} mb-3`}
							aria-hidden="true"
						>
							<img class="pr-3" src={micIcon} alt="" />
							<span class="font-bold text-base text-primary-500">Mic</span>
						</li>
						<li on:click={handleSelectMenu(1)}
							class={`flex border-b-2 border-solid w-full pb-[18px] cursor-pointer mb-3 ${idxSelected === 1 ? 'border-primary-500' : 'border-secondary-500'}`}
							aria-hidden="true"
						>
							<img class="pr-3" src={cameraIcon} alt="" />
							<span class="font-bold text-base text-secondary">Cam</span>
						</li>
						<li on:click={handleSelectMenu(2)}
							class={`flex border-b-2 border-solid w-full pb-[18px] cursor-pointer ${idxSelected === 2 ? 'border-primary-500' : 'border-secondary-500'}`}
							aria-hidden="true"
						>
							<img class="pr-3" src={speakerIcon} alt="" />
							<span class="font-bold text-base text-secondary">Speaker</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="flex-1 px-[36px] mt-[30px]">
			{#if idxSelected === 0}
			<div class="reset-setting flex justify-between items-center border-0 border-b pb-2 mb-4">
				<span>{titleSetting(0)}</span>
				<Button size="xs" on:click={handleResetDefault}>Reset Default</Button>
			</div>
			<div>
				<span class=" mb-[10px] block font-semibold text-base text-primary-500">Source</span>
				<div class="mb-6 flex items-end w-full">
					<div class="w-full mr-[50px]">
						<Label>
							<Select class="outline-none mt-2 bg-transparent rounded-none border-t-0 border-l-0 border-r-0 border-b border-solid" items={mics} bind:value={micSelected} />
						</Label>
					</div>
					<div class="settings flex items-center pb-2">
						<img class="mr-2 w-6" src={micPhone} alt="" />
						<img class="w-7" src={threeDot} alt="" />
					</div>
				</div>
			</div>
			{/if}
			{#if idxSelected === 1}
			<div class="reset-setting flex justify-between items-center border-0 border-b pb-2 mb-4">
				<span>{titleSetting(1)}</span>
				<Button size="xs" on:click={handleResetDefault}>Reset Default</Button>
			</div>
			<div>
				<span class=" mb-[10px] block font-semibold text-base text-primary-500">Source</span>
				<div class="mb-6 flex items-end w-full">
					<div class="w-full">
						<Label>
							<Select class="outline-none mt-2 bg-transparent rounded-none border-t-0 border-l-0 border-r-0 border-b border-solid" items={mics} bind:value={micSelected} />
						</Label>
					</div>
				</div>
				<div class="camera-preview">
					<div class="h-[200px] bg-black"></div>
				</div>
			</div>
			{/if}
			{#if idxSelected === 2}
			<div class="reset-setting flex justify-between items-center border-0 border-b pb-2 mb-4">
				<span>{titleSetting(2)}</span>
				<Button size="xs" on:click={handleResetDefault}>Reset Default</Button>
			</div>
			<div>
				<span class=" mb-[10px] block font-semibold text-base text-primary-500">Source</span>
				<div class="mb-6 flex items-end w-full">
					<div class="w-full mr-[60px]">
						<Label>
							<Select class="outline-none mt-2 bg-transparent rounded-none border-t-0 border-l-0 border-r-0 border-b border-solid" items={mics} bind:value={micSelected} />
						</Label>
					</div>
					<Button class="">Test</Button>
				</div>
			</div>
			{/if}
		</div>
	</div>
</Modal>
