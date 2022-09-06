import { EVENT_ROOM_CLIENT } from '$lib/@core/constants';
import { socketState } from '$lib/state';
import { SocketStatus } from '$lib/types/socket';
import { io } from '..';

io.on('connect', () => {
	socketState.update((data) => ({ ...data, status: SocketStatus.CONNECT, id: io.id }));

	io.emit('authenticate', {});
});

io.on('disconnect', () => {
	socketState.update((data) => ({ ...data, status: SocketStatus.DISCONNECT, id: io.id }));
});
