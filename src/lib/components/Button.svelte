<script lang="ts">
	export let className: string = '';
	export let onClick:
		| ((
				e: MouseEvent & {
					currentTarget: EventTarget & HTMLButtonElement;
				}
		  ) => void)
		| undefined = undefined;
	export let disabled = false;
	export let type = 'submit';
</script>

<button
	{type}
	{disabled}
	class={`inline-flex items-center justify-center py-2 px-4 text-sm font-medium text-center text-white focus:ring-4 focus:outline-none focus:ring-blue-300    w-[172px] shadow-button ${className}`}
	on:click={onClick}
>
	<slot />
</button>

<style>
</style>
