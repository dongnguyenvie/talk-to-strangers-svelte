<script lang="ts">
	export let className = '';
	export let onMessage = (message: string) => {};

	import Fa from 'svelte-fa';
	import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
	let content = ``;

	const handleSubmit = () => {
		onMessage(content);
		content = '';
	};

	const handleKeyPress = (e: any) => {
		const charCode = e.charCode as number;
		if (charCode == 13) {
			handleSubmit();
			e.target.value = '';
			e.preventDefault();
		}
		content = e.target.value;
	};
</script>

<div class={`relative inline-flex flex-grow ${className}`}>
	<textarea bind:value={content} on:keypress={handleKeyPress} />
	<span
		class="flex items-center justify-center flex-grow bg-main-500 text-white"
		on:click={handleSubmit}
	>
		<Fa icon={faPaperPlane} />
	</span>
</div>
