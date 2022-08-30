import { KitQLClient } from '@kitql/client';

const url = import.meta.env.VITE_GRAPHQL_ENDPOINT;

export const kitQLClient = new KitQLClient({
	url,
	credentials: 'omit',
	headersContentType: 'application/json',
	logType: ['client', 'server', 'operationAndvariables']
	// endpointSSRDelayMs: 500, // nice to demo delay in SSR mode
	// endpointNetworkDelayMs: 1000, // Nice to demo delay in Network mode
});
