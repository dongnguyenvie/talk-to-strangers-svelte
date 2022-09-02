import { room } from '$lib/state';
import { SocketStatus } from '$lib/types/socket';
import { io } from '..';

io.on('connect', () => {
	room.update((data) => ({ ...data, status: SocketStatus.CONNECT }));

	io.emit('authenticate', {});
});

io.on('disconnect', () => {
	room.update((data) => ({ ...data, status: SocketStatus.DISCONNECT }));
});
