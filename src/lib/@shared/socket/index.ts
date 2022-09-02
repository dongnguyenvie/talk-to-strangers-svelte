import ioClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:1080';

const socket = ioClient(ENDPOINT, {
	reconnection: true
});

export const io = socket;
