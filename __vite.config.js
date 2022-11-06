import { sveltekit } from '@sveltejs/kit/vite';
import houdini from 'houdini/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [houdini(), sveltekit()],
	define: {
		global: 'globalThis',
		'process.env': {}
	},
	server: {
		host: '0.0.0.0'
	}
};

export default config;
