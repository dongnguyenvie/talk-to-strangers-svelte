import {
	EVENT_ROOM_CLIENT,
	EVENT_ROOM_PERSONAL_CLIENT,
	EVENT_ROOM_SERVER,
	USER_ACCESSABLE
} from '$lib/@core/constants';
import { io } from '..';
import SimplePeer, { createClient } from '$lib/@shared/libs/simple-peerjs';
import { checkStream, getUserMediaHelper } from '$lib/@shared/util/media';
import { auth, room } from '$lib/state';
import { browser } from '$app/environment';
import { P2PEvent, ClientStateEvent, CallEvent } from '$lib/@core/events/sockets';
import type { SocketID } from '$lib/types/socket';
import { MediaRequest } from '$lib/@core/enums';
import { get } from 'svelte/store';
import { JoinRoomEvent } from './join-room.event';
import { ClientShareable, type Client } from '$lib/types';
import type { UserConfig } from '$lib/@core/interfaces/room.interface';
import _ from 'underscore';
import { ChatEvent, MessageType } from '$lib/@core/events/sockets/chat.event';
import type { UserID, UserInfo } from '$lib/types/user.type';

const { myMedia, watchersMap, onUpdateMessage, accessable } = room;

let lastMedia = {} as { mediaStream: MediaStream };

myMedia.subscribe((me) => {
	if (!!me?.mediaStream) {
		lastMedia.mediaStream = me.mediaStream;
	}
});

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
		const userId = get(auth).id;
		room.initRoom({ socketId: myID, roomId: roomId, id: userId });

		// newcomer
		io.on(EVENT_ROOM_CLIENT.joinRoom, (event: JoinRoomEvent) => {
			const { roomId, sid, id, userInfo } = event;
			console.log('new commer', userInfo);
			const peerState = addPeer({ roomId: roomId, callerID: sid, id: id });
			room.onUpdateUserInfo([userInfo]);

			const myAudioStream = get(myMedia).audioStream;
			if (!myAudioStream) return;

			setTimeout(() => {
				broadcastStreamToPeers([peerState], { stream: myAudioStream, isAudio: true });
			}, 200);
		});

		io.on(EVENT_ROOM_CLIENT.message, (event: ChatEvent) => {
			console.log('give message', event);
			onUpdateMessage({
				created: event.created,
				content: event.content,
				createBy: event.createBy
			});
		});

		// newcomer
		io.on(EVENT_ROOM_CLIENT.leaveRoom, (event) => {
			const { roomId, socketId } = event;
			room.removePeer({ sid: socketId });
		});

		io.on(
			EVENT_ROOM_PERSONAL_CLIENT.allUsers,
			(event: {
				users: Pick<Client, 'isAudio' | 'isVideo' | 'sid' | 'id' | 'wid' | 'share'>[];
				userInfos: UserInfo[];
			}) => {
				const { users, userInfos } = event;
				users.forEach((client) => {
					createPeer({
						roomId: roomId,
						callerID: client.sid,
						isVideo: client.isVideo || false,
						isAudio: client.isAudio || false,
						watchingId: client.wid || null,
						share: client.share || null,
						id: client.id
					});
				});
				room.onUpdateUserInfo(userInfos || []);
				console.log('all users', event);
			}
		);

		io.on(EVENT_ROOM_PERSONAL_CLIENT.accessable, (event: { accessable: number }) => {
			const { accessable } = event;
			room.updateAccessableStatus(accessable);
		});

		// incoming call
		io.on(EVENT_ROOM_CLIENT.callingComing, (event: CallEvent) => {
			const { signal, socketId, callerId, initiator, roomId } = event;
			const _callerId = socketId;
			const peerState = getPeer(_callerId);
			const peer = peerState?.inst;

			if (!peer || peerState.inst.destroyed) return;
			peer.signal(signal);
		});

		io.on(EVENT_ROOM_CLIENT.peerToPeer, (event: P2PEvent) => {
			console.log('EVENT_ROOM_CLIENT.peerToPeer', { event });
			switch (event.action) {
				case MediaRequest.viewCamera:
					const peerState = getPeer(event.from);
					const peer = peerState?.inst;
					const me = get(myMedia)!;
					if (!me?.mediaStream) return;
					peer.addStream(me.mediaStream);
					createOrUpdatePeer(event.from, { isSentVideo: true });
					break;

				default:
					break;
			}
			console.log('p2p event', event);
		});

		io.on(EVENT_ROOM_CLIENT.syncUserState, (event: ClientStateEvent) => {
			const { from, isAudio, isVideo, watchingId, share } = event;
			room.updateClientState({
				sid: from,
				isAudio: isAudio,
				isVideo: isVideo,
				wid: watchingId,
				share: share
			});
		});

		let prevWatchers = [] as Client[];

		// TODO: move this logic to a function, destroy event stream or audio also
		accessable.subscribe((value) => {
			console.log({ value });
			if (value === USER_ACCESSABLE.duplicateUser) {
				try {
					stopBothVideoAndAudio(lastMedia?.mediaStream);
				} catch (error) {
					console.log('stopBothVideoAndAudio::', lastMedia);
				}
				let clientPeersState = getPeers();
				clientPeersState.forEach((item) => {
					try {
						item.inst.destroy();
					} catch (error) {
						console.log('destroy peer', error);
					}
				});
			}
		});

		watchersMap.subscribe((map) => {
			const currentWatchers = map[myID] || [];
			const newWatchers = _.difference(currentWatchers, prevWatchers);
			const leavedWatchers = _.difference(prevWatchers, currentWatchers);
			// TODO: remove stream from here
			const me = get(myMedia);
			if (!me?.mediaStream) return;
			const newWatchersState = newWatchers
				.filter((watcher) => watcher.sid !== myID)
				.map((watcher) => getPeer(watcher.sid));

			broadcastStreamToPeers(newWatchersState, { stream: me.mediaStream, isVideo: true });

			leavedWatchers
				.filter((watcher) => watcher.sid !== myID)
				.forEach((watcher) => {
					const watcherState = getPeer(watcher.sid);
					if (!watcherState.inst || !me.mediaStream) return;
					addTracksToPeerFcn(watcherState.inst, me.mediaStream, false);
				});
			prevWatchers = currentWatchers;

			console.log('newWatchers:', newWatchers);
			console.log('leavedWatchers:', leavedWatchers);
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
			const me = get(myMedia);
			if (me.mediaStream) return;
			const watchers = (get(watchersMap)[me.sid] || []).map((client) => getPeer(client.sid));
			const getUserMedia = getUserMediaHelper();
			getUserMedia(
				{
					video: true,
					audio: false
				},
				(stream) => {
					room.updateClientStream({
						stream: stream,
						isVideo: true,
						sid: myID
					});
					io.emit(
						EVENT_ROOM_SERVER.syncUserState,
						new ClientStateEvent({
							isAudio: get(myMedia).isAudio,
							isVideo: true,
							roomId: roomId,
							share: ClientShareable.video
						})
					);
					broadcastStreamToPeers(watchers, { stream, isVideo: true });
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
						sid: myID
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
				try {
					peerState.inst.removeStream(audioStream);
				} catch (error) {
					console.warn('off mic', error);
				}
			});

			room.updateClientStream({
				sid: me.sid,
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
				try {
					peerState.inst.removeStream(mediaStream);
				} catch (error) {
					console.warn('off cam', error);
				}
			});

			room.updateClientStream({
				sid: me.sid,
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
		openFocusOn(watchingId: SocketID) {
			io.emit(
				EVENT_ROOM_SERVER.syncUserState,
				new ClientStateEvent({
					roomId: roomId,
					watchingId: watchingId
				})
			);
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
			io.emit(EVENT_ROOM_SERVER.peerToPeer, p2pEvent);
		},
		onSendMessage: (message: string) => {
			io.emit(
				EVENT_ROOM_SERVER.message,
				new ChatEvent({
					content: message,
					to: roomId,
					createBy: 'xxx@xx.vn',
					messageType: MessageType.room
				})
			);
		}
	};
};

function createPeer({
	callerID,
	roomId,
	stream,
	isAudio,
	isVideo,
	watchingId: watchingId,
	share,
	id
}: {
	callerID: string;
	roomId: string;
	watchingId: string | null;
	stream?: MediaStream;
	id: UserID;
} & UserConfig &
	Pick<Client, 'share'>) {
	let initiator = true;
	let peer = new SimplePeer({
		initiator: initiator,
		stream: stream,
		config: configuration,
		trickle: false
	});

	// peer._debug = (...args) => {
	// 	console.warn('>owner', ...args);
	// };

	peer.on('signal', (signal: SimplePeer.SignalData) => {
		io.emit(
			EVENT_ROOM_SERVER.call,
			new CallEvent({ roomId, initiator, callerId: callerID, signal: signal }).expose
		);
	});

	peer.on('stream', (stream) => {
		console.error('got stream from wc', { initiator }, stream);
		const streamProperties = checkStream(stream);
		room.updateClientStream({ sid: callerID, stream: stream, ...streamProperties });
	});

	peer.on('data', (data) => {
		console.error('got stream data wc', { initiator }, data);
	});

	const peerState = createOrUpdatePeer(callerID, { inst: peer, initiator });

	const client = createClient({
		initiator: initiator,
		sid: callerID,
		mediaStream: stream,
		peer,
		isAudio: isAudio,
		isVideo: isVideo,
		wid: watchingId,
		share: share,
		id
	});

	room.updateClient(client);
	return peerState;
}

function addPeer({
	callerID,
	roomId,
	stream,
	id
}: {
	callerID: string;
	roomId: string;
	stream?: MediaStream;
	id: string;
}) {
	let initiator = false;
	let peer = new SimplePeer({
		initiator,
		stream: stream,
		config: configuration,
		trickle: false
	});

	// peer._debug = (...args) => {
	// 	console.warn('client', ...args);
	// };

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
		room.updateClientStream({ sid: callerID, stream: stream, ...streamProperties });
	});

	peer.on('data', (data) => {
		console.error('got stream data wc', { initiator }, data);
	});

	const peerState = createOrUpdatePeer(callerID, { inst: peer, initiator });

	const client = createClient({
		initiator: initiator,
		sid: callerID,
		mediaStream: stream,
		peer,
		id
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
		addTracksToPeerFcn(peer, stream, true);
		// peer.addStream(stream);
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

function addTracksToPeerFcn(peer: SimplePeer.Instance, stream: MediaStream, isAdd = false) {
	let vidtracks = stream.getVideoTracks();
	let audtracks = stream.getAudioTracks();
	try {
		console.log('Track vidtracks: ', vidtracks); // Check to make sure track exists: it does
		console.log('Track audtracks: ', audtracks);
		if (isAdd) {
			try {
				if (vidtracks.length) {
					peer.addTrack(vidtracks[0], stream);
				}
			} catch (error) {}
			try {
				if (audtracks.length) {
					peer.addTrack(audtracks[0], stream);
				}
			} catch (error) {}
		} else {
			try {
				if (vidtracks.length) {
					peer.removeTrack(vidtracks[0], stream);
				}
				if (audtracks.length) {
					peer.removeTrack(audtracks[0], stream);
				}
			} catch (error) {}
			try {
				vidtracks[0].stop();
			} catch (error) {}
			try {
				audtracks[0].stop();
			} catch (error) {}
		}

		// Check for added streams: none.
		console.log('Streams now: ', peer.streams);
	} catch (error) {
		console.warn('addTracksToPeerFcn', { error });
	}
}
