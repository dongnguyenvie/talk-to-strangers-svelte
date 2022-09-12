import type { Client } from '$lib/types';
import SimplePeer from 'simple-peer';

export default SimplePeer;

export const getRemoteStreams = (peer: SimplePeer.Instance) => {
	return (peer as any)._remoteStreams;
};

export const createClient = (partialData: Partial<Client>): Client => {
	return {
		isAudio: false,
		isVideo: false,
		initiator: false,
		audioStream: undefined,
		mediaStream: undefined,
		peer: undefined as any,
		socketId: '',
		avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
		...partialData
	};
};
