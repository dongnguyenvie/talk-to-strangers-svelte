<script lang="ts">
	import { goto } from '$app/navigation';

	import { KQL_CreateOneRoom } from '$lib/@shared/graphql/_kitql/graphqlStores';
	import Button from '$lib/components/Button.svelte';
	import { auth } from '$lib/state';

	console.log({ KQL_CreateOneRoom });
	const handleLogin = () => {
		auth.update((data) => {
			data.loggedIn = true;
			return { ...data };
		});
		goto('/free4talk');
	};
</script>

<section>
	<div class="flex justify-center pt-5">
		<Button className="bg-main-500 rounded-lg hover:bg-main-800" onClick={handleLogin}>Login</Button
		>
	</div>
</section>
