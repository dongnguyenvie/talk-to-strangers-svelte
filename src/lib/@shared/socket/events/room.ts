import { EVENT_ROOM_CLIENT, EVENT_ROOM_SERVER } from '$lib/@core/constants';
import { io } from '..';
import SimplePeer from 'simple-peer';
import { checkStream, getUserMediaHelper } from '$lib/@shared/util/media';
import { room } from '$lib/state';
import { browser } from '$app/env';

interface NewPeer {
	socketId: string;
	stream: MediaStream;
	initiator: boolean;
}
const peers = {} as Record<string, SimplePeer.Instance>;
const peerInitiators = {} as Record<string, SimplePeer.Instance>;

let configuration = {};
export const initRoomEvent = ({
	roomId,
	onNewPeer
}: {
	roomId: string;
	onNewPeer?: (payload: NewPeer) => void;
}) => {
	if (!browser) return;
	const init = () => {
		io.emit(EVENT_ROOM_SERVER.joinRoom, { roomId });
		let callerID = io.id;
		room.updateMe({ socketId: callerID });

		// create peer
		// createPeer({ callerID, roomId: roomId });

		// newcomer
		io.on(EVENT_ROOM_CLIENT.registerToJoinRoom, (event) => {
			const { roomId, socketId } = event;
			console.log('join room', { socketId });

			addPeer({ roomId: roomId, callerID: socketId });
		});

		// newcomer
		io.on(EVENT_ROOM_CLIENT.leaveRoom, (event) => {
			const { roomId, socketId } = event;
			console.log('leave room', { socketId });

			room.removePeer({ socketId: socketId });
		});

		io.on('all users', (event: any) => {
			const { users } = event;
			console.log({ users });
			users.forEach((callerID: string) => {
				// create peer conection for every client
				createPeer({ roomId: roomId, callerID: callerID });
			});
			console.log('all user', event);
		});

		// incoming call
		io.on(EVENT_ROOM_CLIENT.call, (event) => {
			const { signal, socketId } = event;
			const peer = peers[socketId] || peerInitiators[socketId];
			console.log('call connecting', { event, peers, peer, peerInitiators });
			if (!peer || peer.destroyed) return;
			peer.signal(signal);
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
					room.updateMe({ mediaStream: stream });
					Object.values(peerInitiators).forEach((peer) => {
						peer.addStream(stream);
					});
				},
				(err: any) => {
					console.log({ err });
				}
			);
		},
		openMic: () => {
			const getUserMedia = getUserMediaHelper();
			getUserMedia(
				{
					video: false,
					audio: true
				},
				(stream: any) => {
					console.log('open mic::', 'Received local stream');
					Object.values(peerInitiators).forEach((peer) => {
						peer.addStream(stream);
					});
				},
				(err: any) => {
					console.log({ err });
				}
			);
		},
		sendText: (text: string) => {
			Object.values(peers).forEach((item) => item.send(text));
			const host = peers[io.id];
			console.log({ peers, host });
			if (!host) return;
			host.send(text);
		}
	};
};

function createPeer({
	callerID,
	roomId,
	stream
}: {
	callerID: string;
	roomId: string;
	stream?: MediaStream;
}) {
	let peer = new SimplePeer({
		initiator: true,
		stream: stream,
		config: configuration
		// trickle: false
	});

	peer._debug = (...args) => {
		console.warn('>owner', ...args);
	};

	peer.on('signal', (data) => {
		console.log('xxx', data);
		let mySignal: SimplePeer.SignalData = data;
		io.emit(EVENT_ROOM_SERVER.call, { roomId, signal: mySignal });
	});

	peerInitiators[callerID] = peer;

	room.updateClient({
		initiator: true,
		socketId: io.id,
		mediaStream: stream,
		peer
	});
}

function addPeer({
	callerID,
	roomId,
	stream
}: {
	callerID: string;
	roomId: string;
	stream?: MediaStream;
}) {
	let initiator = false;
	let peer = new SimplePeer({
		initiator,
		stream: stream,
		config: configuration
	});

	peer._debug = (...args) => {
		console.log('client', ...args);
	};

	peer.on('signal', (data) => {
		let mySignal: SimplePeer.SignalData = data;
		io.emit(EVENT_ROOM_SERVER.call, { roomId, signal: mySignal });
	});

	peer.on('stream', (stream) => {
		console.error('got stream from wc', stream);
		const streamProperties = checkStream(stream);
		room.updateClientStream({ socketId: callerID, stream: stream, ...streamProperties });
	});

	peers[callerID] = peer;

	room.updateClient({
		initiator: false,
		socketId: callerID,
		mediaStream: stream,
		peer: peer
	});
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
