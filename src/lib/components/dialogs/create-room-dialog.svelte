<script>
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	export let isOpen = false;
	export const onToggle = () => {};
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { GQL_createRoom } from '$houdini';

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
			capacity: 0,
			language: 'vi',
			topic: '',
			description: ''
		},
		validationSchema: yup.object().shape({
			topic: yup.string().required(),
			capacity: yup.number().required()
		}),
		onSubmit: async (values) => {
			try {
				const { capacity, description, language, topic } = values;
				const result = await GQL_createRoom.mutate({
					input: {
						capacity: Number(capacity),
						description,
						language,
						topic
					}
				});
				onToggle();
			} catch (error) {
				console.log('create room', error);
			}
		}
	});
</script>

<Modal bind:open={isOpen} size="xs" autoclose={false}>
	<form class="flex flex-col space-y-6" action="#" on:submit={handleSubmit}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Tạo phòng trò chuyện</h3>
		<Label class="space-y-2">
			<span>Chủ đề</span>
			<Input
				type="text"
				name="topic"
				on:change={handleChange}
				bind:value={$form.topic}
				placeholder=""
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Số người</span>
			<Input
				type="number"
				name="capacity"
				on:change={handleChange}
				value={`${$form.capacity || 0}`}
				required
			/>
		</Label>
		<Button type="submit" class="w-full">Tạo phòng</Button>
	</form>
</Modal>
