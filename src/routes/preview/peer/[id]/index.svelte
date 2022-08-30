<script lang="ts">
	export const prerender = false;
	import type { Navigator } from '$lib/types';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type Peer from 'peerjs';
	import type { Socket } from 'socket.io-client';
	const roomId = $page.params.id;
	const token = $page.url.searchParams.get('token') as string;

	let peer: Peer;
	let socket: Socket;
	let remoteSteams: string[] = [];
	let videoEls: HTMLVideoElement[] = [];
	let videocurrent;
	let videoEl;

	onMount(async () => {
		const { Peer } = await import('peerjs');
		const { io } = await import('socket.io-client');

		console.log({ token });
		socket = io('http://localhost:1080/rooms', {
			extraHeaders: {
				// token: token
			},
			query: {
				token: token
			}
		});
		peer = new Peer();

		peer.on('open', (id) => {
			console.log('peerId1', id);
			console.log({ peerId2: peer.id });
		});

		const navigatorRef = navigator as any;

		const getUserMedia: Navigator['getUserMedia'] =
			navigatorRef.getUserMedia || navigatorRef.webkitGetUserMedia || navigatorRef.mozGetUserMedia;

		// HANDLE CONNECTTION
		peer.on('call', async (call) => {
			// open webcam

			getUserMedia(
				{
					video: true,
					audio: true
				},
				(stream) => {
					call.answer(stream);
					call.on('stream', renderYouwebcam);
					videocurrent.srcObject = stream;
					videocurrent.play();
				}
			);
			// .then()
			// .catch((err) => console.log('err msg' + err));
		});
		// RENDER YOU WEBCAM HERE
		let renderYouwebcam = (stream) => {
			console.log(stream);
			videoEl.srcObject = stream;
			videoEl.play();
		};

		socket.on('client-connect', (event) => {
			const { peerId, roomId } = event;
			console.log({ event });
			getUserMedia(
				{
					video: true,
					audio: true
				},
				(stream) => {
					let call = peer.call(peerId, stream);
					videocurrent.srcObject = stream;
					videocurrent.play();
					call.on('stream', renderYouwebcam);
				}
			);
		});

		// use module here...

		// const showVideoElemenetOnPage = (video: any) => {};

		// function addVideoStream(video: HTMLVideoElement, stream) {
		// 	video.srcObject = stream;
		// 	video.addEventListener('loadedmetadata', () => {
		// 		video.play();
		// 	});
		// 	// videoGrid.append(video);
		// }

		// socket.on('client-connect', (event) => {
		// 	console.log({ event });
		// 	const { peerId, roomId } = event;
		// 	const video = document.createElement('video');
		// 	getUserMedia(
		// 		{ video: true },
		// 		function (stream) {
		// 			var call = peer.call(peerId, stream);
		// 			call.on('stream', function (remoteStream) {
		// 				console.log({ remoteStream });
		// 				// Show stream in some <video> element.
		// 				video.srcObject = remoteStream;
		// 				// this.videoEls.push(video);
		// 				// showVideoElemenetOnPage(video);
		// 				// remoteSteams.push(remoteStream);
		// 			});
		// 			peer.on('call', (call) => {
		// 				// var call = peer.call(peerId, stream);
		// 				call.answer(stream);
		// 				const video = document.createElement('video');
		// 				call.on('stream', (userVideoStream) => {
		// 					addVideoStream(video, userVideoStream);
		// 				});
		// 			});
		// 		},
		// 		function (err) {
		// 			console.log('Failed to get local stream', err);
		// 		}
		// 	);

		// peer.on('call', (call) => {
		// 	getUserMedia(
		// 		{ video: true },
		// 		function (stream) {
		// 			var call = peer.call(peerId, stream);
		// 			call.answer(stream);
		// 		},
		// 		function (err) {
		// 			console.log('Failed to get local stream', err);
		// 		}
		// 	);
		// });
		// });
	});

	const handleClickToWebrtc = () => {
		socket.emit('join-room', { roomId, peerId: peer.id });
		console.log({ peer });
	};

	function handleClick() {
		alert('no more alerts');
	}
</script>

<section>
	<h1>Hello and welcome to my site!</h1>
	<button on:click={handleClickToWebrtc} class="bg-red-500 text-teal-200">Connect</button>
	<!-- VIDEO YOU FRIEND TAG HTML -->
	<h1>friend videos</h1>
	<video bind:this={videoEl} width="400" height="400" autoplay="true">
		<track kind="captions" src="" />
	</video>
	<hr />

	<!-- YOU FACE CAM HERE -->
	<h1>my videos</h1>
	<video bind:this={videocurrent} width="400" height="400" autoplay="true">
		<track kind="captions" src="" />
	</video>
</section>
