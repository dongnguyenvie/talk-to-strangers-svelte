import { ClientShareable, type Client } from '$lib/types';
import { writable, derived, get } from 'svelte/store';
import { createClient } from '$lib/@shared/libs/simple-peerjs';
import type { SocketID } from '$lib/types/socket';
import _ from 'underscore';
import { auth } from './auth.state';
import type { UserID, UserInfo } from '$lib/types/user.type';
import { USER_ACCESSABLE } from '$lib/@core/constants';

interface RoomState {
	socketId: string;
	roomId: string;
	selected?: SocketID;
	accessable: number;
	clientsMap: Record<SocketID, Client>;
	userInfoMap: Record<UserID, UserInfo>;
	messages: any[];
}
const { subscribe, set, update } = writable<RoomState>({
	socketId: '',
	roomId: '',
	selected: '',
	accessable: USER_ACCESSABLE.waiting,
	clientsMap: {},
	userInfoMap: {},
	messages: []
});

const mySocketId = derived({ subscribe }, ($room) => $room.socketId);
const clients = derived({ subscribe }, ($room) => {
	const _clients = Object.values($room.clientsMap);
	return _clients.map((client) => ({ ...client, info: $room.userInfoMap[client.id] }));
});
const clientsMap = derived(clients, ($clients) => {
	return $clients.reduce((acc, cur) => {
		acc[cur.sid] = cur;
		return acc;
	}, {} as Record<SocketID, Client>);
});
const clientsAudio = derived([mySocketId, clients], ($values) => {
	const [mySocketId, clients] = $values;
	return clients.filter((client) => client.sid !== mySocketId);
});
const myMedia = derived([clientsMap, mySocketId], ($values) => {
	const [clientsMap, mySocketId] = $values;
	return clientsMap[mySocketId];
});
const messages = derived({ subscribe }, ($room) => {
	return $room.messages;
});
const userInfoMap = derived({ subscribe }, ($room) => {
	return $room.userInfoMap;
});
const clientIdSelected = derived(myMedia, ($me) => $me?.wid);
const clientSelected = derived([clientsMap, clientIdSelected], ($values) => {
	const [clientsMap, selectId] = $values;
	return clientsMap[selectId as unknown as SocketID];
});
const mediaSelected = derived(clientSelected, ($client) => {
	let share = $client?.share;
	const isActive = $client?.isVideo;
	if (!share || !isActive) return null;
	return $client[share];
});

const watchersMap = derived(clients, ($clients) => {
	return _.groupBy($clients, 'wid');
});

const accessable = derived({ subscribe }, ($room) => $room.accessable);

const watchersEntries = derived(watchersMap, ($watchersMap) => {
	return Object.entries($watchersMap);
});

export const room = {
	subscribe,
	set,
	update,
	clients,
	clientsAudio,
	myMedia,
	clientSelected,
	clientIdSelected,
	mySocketId,
	watchersMap,
	watchersEntries,
	messages,
	mediaSelected,
	accessable,
	userInfoMap,
	updateClient: (client: Client) => {
		update((data) => {
			data.clientsMap[client.sid] = client;
			return data;
		});
	},
	updateClientStream: (
		client: Pick<Client, 'sid'> & { isVideo?: boolean; isAudio?: boolean; stream: MediaStream }
	) => {
		update((data) => {
			if (client.isVideo) {
				data.clientsMap[client.sid].mediaStream = client.stream;
				data.clientsMap[client.sid].share = ClientShareable.video;
			}
			if (client.isAudio) {
				data.clientsMap[client.sid].audioStream = client.stream;
			}
			return data;
		});
	},
	removePeer: (client: Pick<Client, 'sid'>) => {
		update((data) => {
			delete data.clientsMap[client.sid];
			return data;
		});
	},
	initRoom: ({
		socketId,
		roomId,
		mediaStream,
		id
	}: {
		socketId?: string;
		roomId?: string;
		mediaStream?: MediaStream;
		id: UserID;
	}) => {
		update((data) => {
			data.clientsMap[socketId!] = createClient({
				sid: socketId,
				mediaStream,
				id,
				initiator: true
			});

			data.socketId = socketId || data.socketId;
			data.roomId = roomId || data.roomId;
			return data;
		});
	},
	updateAccessableStatus: (accessable: number) => {
		update((data) => {
			data.accessable = accessable;
			return data;
		});
	},
	updateClientState: ({ sid, ...state }: Pick<Client, 'sid'> & Partial<Client>) => {
		update((data) => {
			data.clientsMap[sid] = {
				...data.clientsMap[sid],
				...state
			};
			return data;
		});
	},
	onSetSelected: (selectdId: SocketID) => {
		update((data) => {
			data.selected = selectdId;
			return data;
		});
	},
	onUpdateMessage: (message: { createBy?: string; content: string; created: number }) => {
		update((data) => {
			data.messages.push(message);
			return data;
		});
	},
	onUpdateUserInfo: (userInfos: UserInfo[]) => {
		update((data) => {
			userInfos.forEach((userInfo) => {
				data.userInfoMap[userInfo.id] = userInfo;
			});
			return data;
		});
	}
};

subscribe((data) => {
	console.warn('log::', data);
});
