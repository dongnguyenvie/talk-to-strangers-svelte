import {
	EVENT_ROOM_CLIENT,
	EVENT_ROOM_PERSONAL_CLIENT,
	EVENT_ROOM_SERVER
} from '$lib/@core/constants';
import { io } from '..';
import SimplePeer, { createClient, getRemoteStreams } from '$lib/@shared/libs/simple-peerjs';
import { checkStream, getUserMediaHelper } from '$lib/@shared/util/media';
import { room } from '$lib/state';
import { browser } from '$app/env';
import { P2PEvent, ClientStateEvent, CallEvent } from '$lib/@core/events/sockets';
import type { SocketID } from '$lib/types/socket';
import { MediaRequest } from '$lib/@core/enums';
import { get } from 'svelte/store';
import { JoinRoomEvent } from './join-room.event';
import type { Client } from '$lib/types';
import type { UserConfig } from '$lib/@core/interfaces/room.interface';
import _ from 'underscore';

const { myMedia } = room;

interface PeerState {
	inst: SimplePeer.Instance;
	isSentAudio: boolean;
	isSentVideo: boolean;
	initiator: boolean;
}

const peers = {} as Record<string, PeerState>;
// const peerInitiators = {} as Record<string, SimplePeer.Instance>;

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

	const main = () => {
		if (!!myID) return;
		io.emit(
			EVENT_ROOM_SERVER.joinRoom,
			new JoinRoomEvent({ roomId: roomId, isAudio: false, isVideo: false })
		);
		myID = io.id;
		room.initRoom({ socketId: myID, roomId: roomId });

		// newcomer
		io.on(EVENT_ROOM_CLIENT.joinRoom, (event: JoinRoomEvent) => {
			const { roomId, socketId } = event;
			console.log('join room', { socketId });

			const peerState = addPeer({ roomId: roomId, callerID: socketId });

			const myAudioStream = get(myMedia).audioStream;
			if (!myAudioStream) return;

			setTimeout(() => {
				broadcastStreamToPeers([peerState], { stream: myAudioStream, isAudio: true });
			}, 200);
		});

		// newcomer
		io.on(EVENT_ROOM_CLIENT.leaveRoom, (event) => {
			const { roomId, socketId } = event;
			console.log('leave room', { socketId });

			room.removePeer({ socketId: socketId });
		});

		io.on(
			EVENT_ROOM_PERSONAL_CLIENT.allUsers,
			(event: { users: Pick<Client, 'isAudio' | 'isVideo' | 'socketId' | 'avatar'>[] }) => {
				const { users } = event;
				users.forEach((client) => {
					createPeer({
						roomId: roomId,
						callerID: client.socketId,
						isVideo: client.isVideo,
						isAudio: client.isAudio,
						avatar: client.avatar
					});
				});
				console.log('all user', event);
			}
		);

		io.on(EVENT_ROOM_PERSONAL_CLIENT.accessable, (event: { accessable: boolean }) => {
			const { accessable } = event;
			room.updateAccessableStatus(accessable);
			console.log('EVENT_ROOM_PERSONAL_CLIENT.accessable', { accessable });
		});

		// incoming call
		io.on(EVENT_ROOM_CLIENT.callingComing, (event: CallEvent) => {
			const { signal, socketId, callerId, initiator, roomId } = event;
			const _callerId = socketId;
			const peerState = getPeer(_callerId);
			const peer = peerState?.inst;

			console.log('call connecting', { event, peers, peer: peerState });
			console.log(`debug s:${event.socketId}||callerId: ${event.callerId}`, event.signal);
			if (!peer || peerState.inst.destroyed) return;
			peer.signal(signal);
			console.log('accpted called', getRemoteStreams(peer).length);
		});

		io.on(EVENT_ROOM_CLIENT.peerToPeer, (event: P2PEvent) => {
			switch (event.action) {
				case MediaRequest.viewCamera:
					const peerState = getPeer(event.from);
					const peer = peerState?.inst;
					const me = get(myMedia)!;
					if (!me?.mediaStream) return;
					peer.addStream(me.mediaStream);
					break;

				default:
					break;
			}
			console.log('p2p event', event);
		});

		io.on(EVENT_ROOM_CLIENT.syncUserState, (event: ClientStateEvent) => {
			const { from, isAudio, isVideo } = event;
			room.updateClientState({
				socketId: from,
				isAudio: isAudio,
				isVideo: isVideo
			});
		});
	};

	main();

	return {
		destroy: () => {
			io.off(EVENT_ROOM_CLIENT.joinRoom);
			io.off(EVENT_ROOM_CLIENT.callingComing);
			io.off(EVENT_ROOM_CLIENT.syncUserState);
			io.off(EVENT_ROOM_CLIENT.peerToPeer);
			io.off(EVENT_ROOM_CLIENT.leaveRoom);
			io.off(EVENT_ROOM_PERSONAL_CLIENT.allUsers);
			io.off(EVENT_ROOM_PERSONAL_CLIENT.accessable);
		},
		openCam: () => {
			const getUserMedia = getUserMediaHelper();
			getUserMedia(
				{
					video: true,
					audio: false
				},
				(stream: any) => {
					console.log('open my camera');
					room.updateClientStream({
						stream: stream,
						isVideo: true,
						socketId: myID
					});
					io.emit(
						EVENT_ROOM_SERVER.syncUserState,
						new ClientStateEvent({
							isAudio: get(myMedia).isAudio,
							isVideo: true,
							roomId: roomId
						})
					);
				},
				(err: any) => {
					console.log({ err });
				}
			);
		},
		openMic: () => {
			const getUserMedia = getUserMediaHelper();
			let audio = true;
			getUserMedia(
				{
					video: false,
					audio: audio
				},
				(stream: MediaStream) => {
					room.updateClientStream({
						stream: stream,
						isAudio: audio,
						socketId: myID
					});
					io.emit(
						EVENT_ROOM_SERVER.syncUserState,
						new ClientStateEvent({
							isAudio: true,
							isVideo: get(myMedia).isVideo,
							roomId: roomId
						})
					);

					let clientPeersState = getPeers();
					broadcastStreamToPeers(clientPeersState, { stream, isAudio: audio });
				},
				(err: any) => {
					console.log({ err });
				}
			);
		},
		offMic: () => {
			const me = get(myMedia)!;
			const audioStream = me.audioStream;
			if (!audioStream) return;
			getPeers({ isSentAudio: true }).forEach((peerState) => {
				peerState.inst.removeStream(audioStream);
			});

			room.updateClientStream({
				socketId: me.socketId,
				isAudio: true,
				stream: undefined as unknown as MediaStream
			});

			io.emit(
				EVENT_ROOM_SERVER.syncUserState,
				new ClientStateEvent({
					isAudio: false,
					isVideo: get(myMedia).isVideo,
					roomId: roomId
				})
			);

			setTimeout(() => {
				stopBothVideoAndAudio(audioStream);
			}, 200);
		},
		offCam: () => {
			const me = get(myMedia)!;
			const mediaStream = me.mediaStream;
			if (!mediaStream) return;
			getPeers({ isSentVideo: true }).forEach((peerState) => {
				peerState.inst.removeStream(mediaStream);
			});

			room.updateClientStream({
				socketId: me.socketId,
				isVideo: true,
				stream: undefined as unknown as MediaStream
			});

			io.emit(
				EVENT_ROOM_SERVER.syncUserState,
				new ClientStateEvent({
					isAudio: get(myMedia).isAudio,
					isVideo: false,
					roomId: roomId
				})
			);

			setTimeout(() => {
				stopBothVideoAndAudio(mediaStream);
			}, 200);
		},
		sendText: (text: string) => {
			getPeers().forEach((peerObj) => {
				const { inst: peer } = peerObj;
				if (peer.destroyed) return;
				console.log('add audio stream');
				peer.send(text);
			});
		},
		requestViewCamera: (to: SocketID) => {
			const p2pEvent = new P2PEvent({
				to: to,
				from: myID,
				message: 'xxx',
				action: MediaRequest.viewCamera
			});
			console.log('p2pEvent', p2pEvent);
			io.emit(EVENT_ROOM_SERVER.peerToPeer, p2pEvent);
		}
	};
};

function createPeer({
	callerID,
	roomId,
	stream,
	isAudio,
	isVideo
}: {
	callerID: string;
	roomId: string;
	stream?: MediaStream;
} & UserConfig) {
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

	const peerState = createOrUpdatePeer(callerID, { inst: peer, initiator });

	const client = createClient({
		initiator: initiator,
		socketId: callerID,
		mediaStream: stream,
		peer,
		isAudio: isAudio || false,
		isVideo: isVideo || false
	});

	room.updateClient(client);
	return peerState;
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

	const peerState = createOrUpdatePeer(callerID, { inst: peer, initiator });

	const client = createClient({
		initiator: initiator,
		socketId: callerID,
		mediaStream: stream,
		peer
	});

	room.updateClient(client);

	return peerState;
}

function getPeer(socketId: SocketID) {
	return peers[socketId];
}

function getPeers(filter: Partial<PeerState> = {} as Partial<PeerState>) {
	const isHasFilter = !!Object.values(filter).length;
	const peersState = Object.values({ ...peers });
	if (isHasFilter) return _.where(peersState, filter);
	return peersState;
}

function createOrUpdatePeer(callerID: string, peer: Partial<PeerState>) {
	let peerState = { ...(peers[callerID] || {}), ...(peer as unknown as PeerState) };
	peers[callerID] = peerState;
	return peerState;
}

function broadcastStreamToPeers(
	peers: PeerState[],
	{ stream, isAudio, isVideo }: { stream: MediaStream; isAudio?: boolean; isVideo?: boolean }
) {
	let queue: PeerState[] = [];

	for (let i = 0; i < peers.length; i++) {
		const peerState = peers[i];
		const peer = peerState.inst;
		if (peer.destroyed) continue;
		if (!peer.connected) {
			queue.push(peerState);
			continue;
		}
		peer.addStream(stream);
		if (isAudio) {
			peerState.isSentAudio = isAudio;
		}
		if (isVideo) {
			peerState.isSentVideo = isVideo;
		}
	}

	if (!queue.length) return;
	setTimeout(() => {
		broadcastStreamToPeers(queue, { stream, isAudio, isVideo });
	}, 1000);
}

function stopBothVideoAndAudio(stream: MediaStream) {
	stream.getTracks().forEach(function (track) {
		if (track.readyState == 'live') {
			track.stop();
		}
	});
}

function stopVideoOnly(stream: MediaStream) {
	stream.getTracks().forEach(function (track) {
		if (track.readyState == 'live' && track.kind === 'video') {
			track.stop();
		}
	});
}

function stopAudioOnly(stream: MediaStream) {
	stream.getTracks().forEach(function (track) {
		if (track.readyState == 'live' && track.kind === 'audio') {
			track.stop();
		}
	});
}
