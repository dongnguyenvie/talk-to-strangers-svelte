import SimplePeer from 'simple-peer';

export default SimplePeer;

export const getRemoteStreams = (peer: SimplePeer.Instance) => {
	return (peer as any)._remoteStreams;
};
