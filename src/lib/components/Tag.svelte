<script lang="ts">
	export let className: string = '';
</script>

<span
	class={`inline-flex border rounded-[100px] border-main-cC4C4C4 bg-main-cF5F5F5 px-[12px] py-[8px] last:mr-[0px] mr-[5px] text-black text-opacity-[0.54] ${className}`}
>
	<slot />
</span>

<style>
</style>
