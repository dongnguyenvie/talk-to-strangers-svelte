export const EVENT_ROOM_SERVER = {
	joinRoom: 'room:join',
	leaveRoom: 'room:leave',
	call: 'room:call'
};

export const EVENT_ROOM_CLIENT = {
	registerToJoinRoom: 'room:transporter:register',
	leaveRoom: 'room:transporter:leave',
	call: 'room:transporter:call',
	callScreen: 'room:transporter:callScreen',
	settings: 'room:settings'
};
