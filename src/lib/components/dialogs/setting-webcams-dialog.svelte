<script>
	import {
		Modal,
		Label,
		Select
	} from 'flowbite-svelte';
	// assets
	import MusicVideoIcon from '$lib/icons/music_video_24px.svg';
	import CpuIcon from '$lib/icons/cpu.svg';
	import micPhone from '$lib/icons/mic_none_24px.svg';
	import threeDot from '$lib/icons/threedot.svg';

	export let isOpen = false;
	export let onClose = () => {};
	let selected = '';

	let countries = [
		{ value: 'us', name: 'United States' },
		{ value: 'ca', name: 'Canada' },
		{ value: 'fr', name: 'France' }
	];
</script>

<Modal class="bg-white" cl bind:open={isOpen} on:hide={onClose} size="lg" autoclose={false}>
	<div class="flex w-full">
		<div class="w-full md:w-[35%] lg:w-[30%]">
			<div class="-my-6 border-r border-solid border-disabled">
				<div class="py-6 pr-10 pl-[26px]">
					<h3 class="text-2xl leading-9 text-secondary mb-6 font-bold">Settings</h3>

					<ul class="w-full flex flex-col gap-y-3">
						<li
							class="flex border-b-2 border-solid border-primary-500 w-full pb-[18px] cursor-pointer"
						>
							<img class="pr-3" src={MusicVideoIcon} alt="" />
							<span class="font-bold text-base text-primary-500">Audio</span>
						</li>
						<li
							class="flex border-b-2 border-solid border-secondary-500 w-full py-[18px] cursor-pointer"
						>
							<img class="pr-3" src={CpuIcon} alt="" />
							<span class="font-bold text-base text-secondary">General</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="flex-1 px-[36px] mt-[60px]">
			<span class=" mb-[10px] block font-semibold text-base text-primary-500">Microphone</span>

			<div class="mb-6 flex items-end w-full">
				<div class="w-full mr-[50px]">
					<Label>
						<Select class="outline-none mt-2 bg-transparent rounded-none border-t-0 border-l-0 border-r-0 border-b border-solid" items={countries} bind:value={selected} />
					</Label>
				</div>
				<div class="settings flex items-center pb-2">
					<img class="mr-2 w-6" src={micPhone} alt="" />
					<img class="w-7" src={threeDot} alt="" />
				</div>
			</div>
		</div>
	</div>
</Modal>
