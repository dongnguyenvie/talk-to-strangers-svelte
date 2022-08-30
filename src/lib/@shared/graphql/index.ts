// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
// import { setClient } from 'svelte-apollo';

// function createApolloClient(authToken:string) {
// 	const httpLink = new HttpLink({
// 		uri: 'https://hasura.io/learn/graphql',
// 		headers: {
// 			Authorization: `Bearer ${authToken}`
// 		}
// 	});
// 	const cache = new InMemoryCache();
// 	// const client = new ApolloClient({
// 	// 	httpLink,
// 	// 	cache
// 	// });
// 	// return client;
// }

// export let authToken;

// const client = createApolloClient(authToken);
// setClient(client);
export {};
