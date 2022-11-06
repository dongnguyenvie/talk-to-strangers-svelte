<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { goto } from '$app/navigation';
	import { auth, facebookOAuth2, googleOAuth2 } from '$lib/state';
	import { createForm } from 'svelte-forms-lib';
	import { ROUTES } from '$lib/@core/constants';
	import type { Auth } from '$lib/types';
	import jwtDecode from 'jwt-decode';
	import * as yup from 'yup';
	import GoogleIcon from '$lib/icons/google.svg';
	import FacebookIcon from '$lib/icons/facebook.svg';
	import TwitterIcon from '$lib/icons/twitter.svg';
	import GoogleSignin from '$lib/components/buttons/google-signin.button.svelte';
	import { GQL_signin, GQL_onNewRoom } from '$houdini';

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
				const data = await GQL_signin.mutate({
					input: {
						email: email,
						password: password
					}
				});
				console.log('login', data);
				// if (!!errors) {
				// 	console.log({ errors });
				// 	alert('user or password are wrong');
				// 	return;
				// }
				const token = data?.signin.token!;
				const user = jwtDecode(token) as Auth;
				auth.set({ ...user, token });
				goto(ROUTES.rooms);
			} catch (error) {}
		}
	});

	const handleSigninOrSignupByGG = () => {
		googleOAuth2.signin();
	};

	const handleLogoutByGG = () => {
		googleOAuth2.signout();
	};

	const handleSigninOrSignupByFB = () => {
		facebookOAuth2.signin();
	};
</script>

<section class="flex justify-center pt-14">
	<div class="w-full max-w-[450px]">
		<form
			class:valid={$isValid}
			on:submit={handleSubmit}
			class="bg-white shadow-md rounded p-[60px] mb-4"
		>
			<div class="title">
				<h3 class="text-3xl mb-2">Sign In to <strong>Talk Listen</strong></h3>
				<p class="mb-7 text-base font-light text-gray-400">
					Trang web dành cho người Việt giao lưu bla bla
				</p>
			</div>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-normal mb-2" for="username"> Email </label>
				<input
					class="shadow appearance-none border border-gray-300
					rounded w-full py-3 px-4 text-gray-700 leading-tight my-[1px]
					focus:outline-none
					focus:border-main-500
					focus:shadow-transparent
					focus:ring-transparent
					focus:border-[2px]
					focus:my-0
					"
					type="email"
					placeholder="email"
					name="email"
					on:change={handleChange}
					bind:value={$form.email}
				/>
				{#if $errors.email && $touched.email}
					<p class="text-red-500 text-xs italic mt-1">Please choose a email.</p>
				{/if}
			</div>
			<div class="mb-6">
				<label class="block text-gray-700 text-sm font-normal mb-2" for="password">
					Password
				</label>
				<input
					class="shadow appearance-none border border-gray-300
					rounded w-full py-3 px-4 text-gray-700 leading-tight my-[1px]
					focus:outline-none
					focus:border-main-500
					focus:shadow-transparent
					focus:ring-transparent
					focus:border-[2px]
					focus:my-0
					"
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
					className="rounded-full max-w-[100%] dark:bg-main-500 hover:bg-main-700
					outline-none
					text-white font-medium py-2 px-4 focus:outline-none w-[100%]
					hover:dark:bg-main-500
					focus:shadow-none
					focus:shadow-transparent
					focus:dark:ring-transparent
					h-[50px] text-base
					"
					type="submit"
				>
					Log in
				</Button>
			</div>
			<p class="my-6 text-center text-gray-400">or sign in with</p>
			<div class="flex justify-center gap-x-2">
				<div class="flex items-center justify-center">
					<Button
						className="h-[50px] w-[50px] rounded-full text-white font-bold py-2 px-2 focus:outline-none focus:shadow-outline focus:dark:ring-transparent
						dark:bg-google hover:dark:bg-google btn-google"
						type="button"
						onClick={handleSigninOrSignupByGG}
					>
						<img class="w-5 h-5" src={GoogleIcon} alt="" />
					</Button>
				</div>
				<div class="flex items-center justify-center">
					<Button
						className="h-[50px] w-[50px] rounded-full text-white font-bold py-2 px-2 focus:outline-none focus:shadow-outline focus:dark:ring-transparent
						dark:bg-facebook dark:bg-facebook btn-facebook"
						type="button"
						onClick={handleSigninOrSignupByFB}
					>
						<img class="w-5 h-5" src={FacebookIcon} alt="" />
					</Button>
				</div>
				<div class="flex items-center justify-center">
					<Button
						className="h-[50px] w-[50px] rounded-full text-white font-bold py-2 px-2 focus:outline-none focus:shadow-outline focus:dark:ring-transparent
						dark:bg-twitter hover:dark:bg-twitter btn-twitter"
						type="button"
						onClick={handleLogoutByGG}
					>
						<img class="w-5 h-5" src={TwitterIcon} alt="" />
					</Button>
				</div>
			</div>
		</form>
		<p class="text-center text-gray-500 text-xs">&copy;2022 Acme Corp. All rights reserved.</p>
	</div>
</section>

<style>
</style>
