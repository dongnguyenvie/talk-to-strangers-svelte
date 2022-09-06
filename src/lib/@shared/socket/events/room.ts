import { EVENT_ROOM_CLIENT, EVENT_ROOM_SERVER } from '$lib/@core/constants';
import { io } from '..';
import SimplePeer from 'simple-peer';
import { getUserMediaHelper } from '$lib/@shared/util/media';
import { room } from '$lib/state';

interface NewPeer {
	socketId: string;
	stream: MediaStream;
	isInitiator: boolean;
}
const peers = {} as Record<string, any>;
let localStream: any;
let configuration = {};
export const initRoomEvent = ({
	roomId,
	onNewPeer
}: {
	roomId: string;
	onNewPeer?: (payload: NewPeer) => void;
}) => {
	io.emit(EVENT_ROOM_SERVER.joinRoom, { roomId });

	// newcomer
	io.on(EVENT_ROOM_CLIENT.registerToJoinRoom, (event) => {
		const { roomId, socketId } = event;

		addPeer({ isInitiator: false, roomId: roomId, socketId: socketId, onNewPeer });
	});

	// incoming call
	io.on(EVENT_ROOM_CLIENT.call, (event) => {
		const { signal } = event;
		const peer = peers[io.id];
		if (!peer) return;
		peers[io.id].signal(signal);
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
					localStream = stream;
					addPeer({ isInitiator: true, socketId: io.id, roomId, onNewPeer: onNewPeer });
					room.updatePeer({ isInitiator: true, socketId: io.id, stream: stream });
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
					console.log('Received local stream');
					const myAudioUrl = window.URL.createObjectURL(stream);
					// localStream = stream;
					// addPeer({ isInitiator: true, socketId: io.id, roomId, onNewPeer: onNewPeer });
				},
				(err: any) => {
					console.log({ err });
				}
			);
		}
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
	let peer = new SimplePeer({
		initiator: isInitiator,
		stream: localStream,
		config: configuration
	});
	peer.on('signal', (data) => {
		let mySignal: SimplePeer.SignalData = data;
		io.emit(EVENT_ROOM_SERVER.call, { roomId, signal: mySignal });
		console.log('call signal');
	});

	peer.on('stream', (stream) => {
		!!onNewPeer && onNewPeer({ socketId: socketId, stream: stream, isInitiator });
		room.updatePeer({ isInitiator: isInitiator, socketId: socketId, stream: stream });
	});

	peers[socketId] = peer;
}
