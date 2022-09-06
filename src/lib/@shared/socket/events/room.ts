import { EVENT_ROOM_CLIENT, EVENT_ROOM_SERVER } from '$lib/@core/constants';
import { io } from '..';
import SimplePeer from 'simple-peer';
import { getUserMediaHelper } from '$lib/@shared/util/media';
import { room } from '$lib/state';
import { derived, get } from 'svelte/store';
import type { Peer } from '$lib/types';

interface NewPeer {
	socketId: string;
	stream: MediaStream;
	isInitiator: boolean;
}
const peers = {} as Record<string, SimplePeer.Instance>;
// const peerMap = derived(room, ($room) =>
// 	$room.clients.reduce((acc, cur) => {
// 		acc[cur.socketId] = cur;
// 		return acc;
// 	}, {} as Record<string, Peer>)
// );
let localStream: any;
let configuration = {};
export const initRoomEvent = ({
	roomId,
	onNewPeer
}: {
	roomId: string;
	onNewPeer?: (payload: NewPeer) => void;
}) => {
	const init = () => {
		io.emit(EVENT_ROOM_SERVER.joinRoom, { roomId });
		addPeer({ isInitiator: true, roomId: roomId, socketId: io.id, onNewPeer });

		// newcomer
		io.on(EVENT_ROOM_CLIENT.registerToJoinRoom, (event) => {
			const { roomId, socketId } = event;

			addPeer({ isInitiator: false, roomId: roomId, socketId: socketId, onNewPeer });
		});

		// newcomer
		io.on(EVENT_ROOM_CLIENT.leaveRoom, (event) => {
			const { roomId, socketId } = event;
			console.log('leave room', { socketId });

			room.removePeer({ isInitiator: false, socketId: socketId, stream: null });
		});

		// incoming call
		io.on(EVENT_ROOM_CLIENT.call, (event) => {
			console.log('call connecting', { event, peers });
			const { signal } = event;
			const host = peers[io.id];
			console.log({ host });
			if (!host) return;
			host.signal(signal);
		});
	};

	io.on('connect', () => {
		init();
	});

	return {
		destroy: () => {
			io.off(EVENT_ROOM_CLIENT.registerToJoinRoom);
			io.off(EVENT_ROOM_CLIENT.call);
		},
		openCam: () => {
			const getUserMedia = getUserMediaHelper();
			getUserMedia(
				{
					video: true,
					audio: false
				},
				(stream: any) => {
					console.log('Received local stream');
					const host = peers[io.id];
					host.addStream(stream);
					localStream = stream;
					room.updatePeer({
						isInitiator: true,
						socketId: io.id,
						stream: localStream
					});
					// addPeer({ isInitiator: true, socketId: io.id, roomId, onNewPeer: onNewPeer });
				},
				(err: any) => {
					console.log({ err });
				}
			);
		},
		openMic: () => {}
	};
};

function addPeer({
	socketId,
	isInitiator,
	roomId,
	onNewPeer
}: {
	socketId: string;
	isInitiator: boolean;
	roomId: string;
	onNewPeer?: (payload: NewPeer) => void;
}) {
	room.updatePeer({
		isInitiator: isInitiator,
		socketId: io.id,
		stream: isInitiator ? localStream : null
	});
	let peer = new SimplePeer({
		initiator: isInitiator,
		// stream: localStream,
		config: configuration
	});

	peer.on('signal', (data) => {
		let mySignal: SimplePeer.SignalData = data;
		io.emit(EVENT_ROOM_SERVER.call, { roomId, signal: mySignal });
		// console.log('call signal');
	});

	peer.on('stream', (stream) => {
		!!onNewPeer && onNewPeer({ socketId: socketId, stream: stream, isInitiator });
		console.log('signal stream', {
			isInitiator: isInitiator,
			socketId: socketId,
			stream: stream
		});
		room.updatePeer({ isInitiator: false, socketId: makeid(5), stream: stream });
	});

	peers[socketId] = peer;
}

function makeid(length: number) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
