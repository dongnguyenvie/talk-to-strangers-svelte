<script lang="ts">
	export let className: string = '';
</script>

<span
	class={`cursor-default inline-flex border rounded-full border-main-300 bg-white px-[12px] py-[5px] last:mr-[0px] mr-[5px] text-main-300 ${className}`}
>
	<slot />
</span>

<style>
</style>
