<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	import { KQL_Signin } from '$lib/@shared/graphql/_kitql/graphqlStores';
	import { auth } from '$lib/state';
	import { createForm } from 'svelte-forms-lib';
	import { ROUTES } from '$lib/@core/constants';
	import type { Auth } from '$lib/types';
	import jwtDecode from 'jwt-decode';
	import * as yup from 'yup';

	const {
		// observables state
		form,
		errors,
		state,
		touched,
		isValid,
		isSubmitting,
		isValidating,
		// handlers
		handleChange,
		handleSubmit
	} = createForm({
		initialValues: {
			email: 'nolan1@gmail.com',
			password: '123123'
		},
		validationSchema: yup.object().shape({
			password: yup.string().required(),
			email: yup.string().email().required()
		}),
		onSubmit: async (values) => {
			try {
				const { email, password } = values;
				const { data, errors } = await KQL_Signin.mutate({
					variables: {
						input: {
							email: email,
							password: password
						}
					}
				});
				if (!!errors) {
					console.log({ errors });
					alert('user or password are wrong');
					return;
				}
				const token = data?.signin.token!;
				const user = jwtDecode(token) as Auth;
				auth.set({ ...user, token });
				goto(ROUTES.rooms);
			} catch (error) {}
		}
	});
</script>

<section class="flex justify-center pt-8">
	<div class="w-full max-w-xs">
		<form
			class:valid={$isValid}
			on:submit={handleSubmit}
			class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
		>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="username"> Username </label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					type="text"
					placeholder="email"
					name="email"
					on:change={handleChange}
					bind:value={$form.email}
				/>
				{#if $errors.email && $touched.email}
					<p class="text-red-500 text-xs italic">Please choose a email.</p>
				{/if}
			</div>
			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="password"> Password </label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					id="password"
					type="password"
					placeholder="password"
					name="password"
					on:change={handleChange}
					bind:value={$form.password}
				/>
				{#if $errors.password && $touched.password}
					<p class="text-red-500 text-xs italic">Please choose a password.</p>
				{/if}
			</div>
			<div class="flex items-center justify-center">
				<Button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit"
				>
					Sign In
				</Button>
			</div>
		</form>
		<p class="text-center text-gray-500 text-xs">&copy;2020 Acme Corp. All rights reserved.</p>
	</div>
</section>
