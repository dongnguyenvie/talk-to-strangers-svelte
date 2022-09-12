export const EVENT_ROOM_SERVER = {
	joinRoom: 'room:join',
	leaveRoom: 'room:leave',
	call: 'room:call',
	peerToPeer: 'room:peer-to-peer:message',
	syncUserState: 'room:sync-user-state'
};

export const EVENT_ROOM_CLIENT = {
	joinRoom: 'room:transporter:register',
	leaveRoom: 'room:transporter:leave',
	callingComing: 'room:transporter:call',
	callScreen: 'room:transporter:callScreen',
	settings: 'room:settings',
	peerToPeer: 'room:transporter:peer-to-peer:message',
	syncUserState: 'room:transporter:sync-user-state'
};

export const EVENT_ROOM_PERSONAL_CLIENT = {
	accessable: 'room:transporter:personal:accessable',
	allUsers: 'room:personal:all-users'
};
