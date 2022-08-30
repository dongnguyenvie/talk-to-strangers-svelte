import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	define: {
		global: 'globalThis',
		'process.env': {}
	},
	server: {
		host: '0.0.0.0'
	}
};

export default config;
