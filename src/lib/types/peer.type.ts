import type SimplePeer from 'simple-peer';
import type { SocketID } from './socket';

export type PeerEvents = {
	/**
	 * Emitted when a connection to the PeerServer is established.
	 */
	open: (id: string) => void;
	/**
	 * Emitted when a new data connection is established from a remote peer.
	 */
	connection: (dataConnection: any) => void;
	/**
	 * Emitted when a remote peer attempts to call you.
	 */
	call: (mediaConnection: any) => void;
	/**
	 * Emitted when the peer is destroyed and can no longer accept or create any new connections.
	 */
	close: () => void;
	/**
	 * Emitted when the peer is disconnected from the signalling server
	 */
	disconnected: (currentId: string) => void;
	/**
	 * Errors on the peer are almost always fatal and will destroy the peer.
	 */
	error: (error: Error) => void;
};

export interface Client {
	socketId: SocketID;
	mediaStream?: MediaStream;
	audioStream?: MediaStream;
	isAudio: boolean;
	isVideo: boolean;
	initiator: boolean;
	peer: SimplePeer.Instance;
}
