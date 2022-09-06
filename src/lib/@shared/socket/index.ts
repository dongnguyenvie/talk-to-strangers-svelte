import ioClient from 'socket.io-client';
const ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT;

const socket = ioClient(ENDPOINT, {
	reconnection: true
});

export const io = socket;
