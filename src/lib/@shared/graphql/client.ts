import { SubscriptionClient } from 'subscriptions-transport-ws';
import { HoudiniClient, type RequestHandlerArgs, type SubscriptionHandler } from '$houdini';
import { auth } from '$lib/state';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

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

let socketClient: SubscriptionHandler | null = null;
if (browser) {
	// instantiate the transport client
	const client = new SubscriptionClient(import.meta.env.VITE_GRAPHQLWS_ENDPOINT, {
		reconnect: true
	});

	// wrap the client in something houdini can use
	socketClient = {
		subscribe(payload, handlers) {
			// send the request
			const { unsubscribe } = client.request(payload).subscribe(handlers as any);

			// return the function to unsubscribe
			return unsubscribe;
		}
	};
}

export default new HoudiniClient(fetchQuery, socketClient as unknown as SubscriptionHandler);
