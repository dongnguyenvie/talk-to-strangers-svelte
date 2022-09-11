import {
	EVENT_ROOM_CLIENT,
	EVENT_ROOM_PERSONAL_CLIENT,
	EVENT_ROOM_SERVER
} from '$lib/@core/constants';
import { io } from '..';
import SimplePeer, { getRemoteStreams } from '$lib/@shared/libs/simple-peerjs';
import { checkStream, getUserMediaHelper } from '$lib/@shared/util/media';
import { room } from '$lib/state';
import { browser } from '$app/env';
import { CallEvent } from '$lib/@core/events/sockets/call.event';

const peers = {} as Record<string, SimplePeer.Instance>;
const peerInitiators = {} as Record<string, SimplePeer.Instance>;

let configuration = {
	iceServers: [
		{
			urls: 'stun:openrelay.metered.ca:80'
		},
		{
			urls: 'turn:openrelay.metered.ca:80',
			username: 'openrelayproject',
			credential: 'openrelayproject'
		},
		{
			urls: 'turn:openrelay.metered.ca:443',
			username: 'openrelayproject',
			credential: 'openrelayproject'
		},
		{
			urls: 'turn:openrelay.metered.ca:443?transport=tcp',
			username: 'openrelayproject',
			credential: 'openrelayproject'
		}
	]
};
let myID: string;
export const initRoomEvent = ({ roomId }: { roomId: string }) => {
	if (!browser) return;

	const init = () => {
		io.emit(EVENT_ROOM_SERVER.joinRoom, { roomId });
		myID = io.id;
		room.initRoom({ socketId: myID, roomId: roomId });

		// newcomer
		io.on(EVENT_ROOM_CLIENT.joinRoom, (event) => {
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

		io.on(EVENT_ROOM_PERSONAL_CLIENT.allUsers, (event: any) => {
			const { users } = event;
			users.forEach((callerID: string) => {
				createPeer({ roomId: roomId, callerID: callerID });
			});
			console.log('all user', event);
		});

		io.on(EVENT_ROOM_PERSONAL_CLIENT.accessable, (event: { accessable: boolean }) => {
			const { accessable } = event;
			room.updateAccessableStatus(accessable);
			console.log('EVENT_ROOM_PERSONAL_CLIENT.accessable', { accessable });
		});

		// incoming call
		io.on(EVENT_ROOM_CLIENT.callingComing, (event: CallEvent) => {
			const { signal, socketId, callerId, initiator, roomId } = event;
			const _callerId = socketId;
			const peer = peerInitiators[_callerId] || peers[_callerId];

			console.log('call connecting', { event, peers, peer, peerInitiators });
			console.log(`debug s:${event.socketId}||callerId: ${event.callerId}`, event.signal);
			if (!peer || peer.destroyed) return;
			peer.signal(signal);
			console.log('accpted called', getRemoteStreams(peer).length);
		});
	};

	init();

	return {
		destroy: () => {
			io.off(EVENT_ROOM_CLIENT.joinRoom);
			io.off(EVENT_ROOM_CLIENT.callingComing);
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
					room.updateClientStream({
						stream: stream,
						isVideo: true,
						isAudio: false,
						socketId: myID
					});
					Object.entries(peerInitiators).forEach((peerObj) => {
						try {
							const [socketId, peer] = peerObj;
							if (peer.destroyed || !peer.connected) return;
							console.log('add video stream');
							peer.addStream(stream);
						} catch (error) {}
					});
					Object.entries(peers).forEach((peerObj) => {
						try {
							const [socketId, peer] = peerObj;
							if (peer.destroyed || !peer.connected) return;
							console.log('add video stream');
							peer.addStream(stream);
						} catch (error) {}
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
				(stream: MediaStream) => {
					room.updateClientStream({
						stream: stream,
						isVideo: false,
						isAudio: true,
						socketId: myID
					});
					console.log('peer', peerInitiators);
					Object.entries(peerInitiators).forEach((peerObj) => {
						const [socketId, peer] = peerObj;
						if (peer.destroyed) return;
						console.log('add audio stream');
						peer.addStream(stream);
					});
					Object.entries(peers).forEach((peerObj) => {
						const [socketId, peer] = peerObj;
						if (peer.destroyed) return;
						console.log('add audio stream');
						peer.addStream(stream);
					});
				},
				(err: any) => {
					console.log({ err });
				}
			);
		},
		sendText: (text: string) => {
			Object.entries(peerInitiators).forEach((peerObj) => {
				const [socketId, peer] = peerObj;
				if (peer.destroyed) return;
				console.log('add audio stream');
				peer.send(text);
			});
			Object.entries(peers).forEach((peerObj) => {
				const [socketId, peer] = peerObj;
				if (peer.destroyed) return;
				console.log('add audio stream');
				peer.send(text);
			});
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
	let initiator = true;
	let peer = new SimplePeer({
		initiator: initiator,
		stream: stream,
		config: configuration,
		trickle: false
	});

	peer._debug = (...args) => {
		console.warn('>owner', ...args);
	};

	peer.on('signal', (signal: SimplePeer.SignalData) => {
		io.emit(
			EVENT_ROOM_SERVER.call,
			new CallEvent({ roomId, initiator, callerId: callerID, signal: signal }).expose
		);
	});

	peer.on('stream', (stream) => {
		console.error('got stream from wc', { initiator }, stream);
		const streamProperties = checkStream(stream);
		room.updateClientStream({ socketId: callerID, stream: stream, ...streamProperties });
	});

	peer.on('data', (data) => {
		console.error('got stream data wc', { initiator }, data);
	});

	peerInitiators[callerID] = peer;

	room.updateClient({
		initiator: true,
		socketId: callerID,
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
		config: configuration,
		trickle: false
	});

	peer._debug = (...args) => {
		console.warn('client', ...args);
	};

	peer.on('signal', (data) => {
		let mySignal: SimplePeer.SignalData = data;

		io.emit(
			EVENT_ROOM_SERVER.call,
			new CallEvent({ roomId, initiator, callerId: callerID, signal: mySignal }).expose
		);
	});

	peer.on('stream', (stream) => {
		console.error('got stream from wc', { initiator }, stream);
		const streamProperties = checkStream(stream);
		room.updateClientStream({ socketId: callerID, stream: stream, ...streamProperties });
	});

	peer.on('data', (data) => {
		console.error('got stream data wc', { initiator }, data);
	});

	peers[callerID] = peer;

	room.updateClient({
		initiator: false,
		socketId: callerID,
		mediaStream: stream,
		peer: peer
	});
}
