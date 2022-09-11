<script lang="ts">
	export const prerender = false;
	import type { Navigator } from '$lib/types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Socket } from 'socket.io-client';
	import { getUserMediaHelper } from '$lib/@shared/util/media';
	// import { SimplePeer } from 'simple-peer';
	import type SimplePeer from 'simple-peer';
	import { EVENT_ROOM_CLIENT, EVENT_ROOM_SERVER } from '$lib/@core/constants';

	const roomId = $page.params.id;
	const token = $page.url.searchParams.get('token') as string;

	// let peer: Peer;
	let socket: Socket;
	let remoteSteams: string[] = [];
	let videoEls: HTMLVideoElement[] = [];
	let localVideo: HTMLVideoElement;
	let localStream: any;
	let peers = {} as Record<string, SimplePeer.Instance>;
	let videos: any[] = [];
	let mySignal: SimplePeer.SignalData;
	let count = 0;
	onMount(async () => {
		var global: any = window;
		const { default: SimplePeer } = await import('simple-peer');
		const { io } = await import('socket.io-client');

		const peer = new SimplePeer({});
		console.log({ peer });

		// console.log({ token });
		socket = io('http://localhost:1080/rooms', {
			extraHeaders: {
				// token: token
			},
			query: {
				token: token
			}
		});
		// MessageSocket = io('http://localhost:1080/messages', {
		// 	extraHeaders: {
		// 		// token: token
		// 	},
		// 	query: {
		// 		token: token
		// 	}
		// });
		// // peer = new Peer({ initiator: true });

		// // peer.on('open', (id) => {
		// // 	console.log('peerId1', id);
		// // 	console.log({ peerId2: peer.id });
		// // });

		const navigatorRef = navigator as any;

		const getUserMedia = getUserMediaHelper();
		const configuration = {};
		socket.emit(EVENT_ROOM_SERVER.joinRoom, { roomId });

		getUserMedia(
			{
				video: true,
				audio: false
			},
			(stream: any) => {
				console.log('Received local stream');
				localVideo.srcObject = stream;
				localStream = stream;
				addPeer(socket.id, true);
			},
			(err) => {
				console.log({ err });
			}
		);

		// // RENDER YOU WEBCAM HERE

		socket.on(EVENT_ROOM_CLIENT.joinRoom, (event) => {
			console.log('client-connect', { event });
			const { roomId, socketId } = event;
			addPeer(socketId, false);
		});

		// incoming call
		socket.on(EVENT_ROOM_CLIENT.call, (event) => {
			console.log('client-call', { event });
			const { signal } = event;
			if (peers[socket.id]) {
				peers[socket.id].signal(signal);
			}
			// addPeer(socketId, false);
		});

		function addPeer(socketId: string, initiator: boolean) {
			peers[socketId] = new SimplePeer({
				initiator: initiator,
				stream: localStream,
				config: configuration
			});

			peers[socketId].on('signal', (data) => {
				mySignal = data;
				socket.emit(EVENT_ROOM_SERVER.call, { roomId, signal: mySignal });
				console.log('call signal');
				// socket.emit('signal', {
				// 	signal: data,
				// 	socketId: socketId
				// });
			});

			peers[socketId].on('stream', (stream) => {
				console.log({ stream });
				let videoStream = {
					srcObject: stream,
					id: socketId,
					autoplay: true,
					className: 'live-webcam'
				};

				videos.push(videoStream);
				videos = [...videos];
				console.log({ videos });
				console.log('steam', videoStream.id);
				// let newVid = document.createElement('video');
				// newVid.srcObject = stream;
				// newVid.id = socketId;
				// newVid.playsinline = false;
				// newVid.autoplay = true;
				// newVid.className = 'vid';
				// newVid.onclick = () => openPictureMode(newVid);
				// newVid.ontouchstart = (e) => openPictureMode(newVid);
				// videos.appendChild(newVid);
			});
		}
	});

	const handleClickToWebrtc = () => {
		socket.emit(EVENT_ROOM_SERVER.joinRoom, { roomId });
		// addPeer
		// console.log({ peer });
	};

	function handleClick() {
		alert('no more alerts');
	}
	function srcObject(node, stream) {
		node.srcObject = stream;
		return {
			update(newStream) {
				if (node.srcObject != newStream) {
					node.srcObject = newStream;
				}
			}
		};
	}

	const handleAccessWc = () => {
		// const getUserMedia = getUserMediaHelper();
		// getUserMedia(
		// 	{
		// 		video: true,
		// 		audio: false
		// 	},
		// 	(stream: any) => {
		// 		console.log('Received local stream');
		// 	},
		// 	(err) => {
		// 		console.log({ err });
		// 	}
		// );
	};
</script>

<section>
	<h1>Hello and welcome to my site!</h1>
	<button on:click={handleClickToWebrtc} class="bg-red-500 text-teal-200">Connect</button>
	<button on:click={handleAccessWc} class="bg-red-500 text-teal-200">accWc</button>
	<h1>count {count}</h1>

	<!-- VIDEO YOU FRIEND TAG HTML -->
	<h1>friend videos</h1>
	<video width="400" height="400" autoplay="true">
		<track kind="captions" src="" />
	</video>
	<hr />

	<!-- YOU FACE CAM HERE -->
	<h1>my videos</h1>
	<video bind:this={localVideo} width="400" height="400" autoplay="true">
		<track kind="captions" src="" />
	</video>
	<!-- all video -->
	<h1>all videos</h1>
	{#each videos as v}
		<video use:srcObject={v.srcObject} id={v.id} width="400" height="400" autoplay="true">
			<track kind="captions" src="" />
		</video>
	{/each}
</section>
