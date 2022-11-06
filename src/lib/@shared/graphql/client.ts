import { HoudiniClient, type RequestHandlerArgs } from '$houdini';
import { auth } from '$lib/state';
import { get } from 'svelte/store';

async function fetchQuery({ fetch, text = '', variables = {}, metadata }: RequestHandlerArgs) {
	const userLogon = get(auth);
	const authToken = userLogon?.token || '';
	const url = import.meta.env.VITE_GRAPHQL_ENDPOINT;
	const result = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(!!authToken ? { Authorization: `Bearer ${authToken}` } : {})
		},
		body: JSON.stringify({
			query: text,
			variables
		})
	});
	return await result.json();
}

export default new HoudiniClient(fetchQuery);
