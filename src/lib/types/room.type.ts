export interface BaseRoom {
	init: () => void;
	destroy: () => void;
}

export interface IRoomUser {
	id: string;
	name: string;
	avatar: string;
	sid: string;
}
export interface IRoom {
	id: string;
	capacity: number;
	description: string;
	language: string;
	creator: Omit<IRoomUser, 'sid'>;
	topic: string;
	clients: IRoomUser[];
	createdAt: number;
	updatedAt: number;
}
