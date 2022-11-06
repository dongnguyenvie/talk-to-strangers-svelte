/** @type {import('houdini').ConfigFile} */
const config = {
	apiUrl: 'http://localhost:7001/graphql',
	plugins: {
		'houdini-svelte': {
			client: './src/lib/@shared/graphql/client.ts'
		}
	},
	schemaPath: './src/lib/@shared/graphql/schema.graphql'
};

export default config;
