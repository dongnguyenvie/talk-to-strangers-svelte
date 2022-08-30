import { RoomAction } from '@core/enums';
import { RoomEntity } from '@modules/rooms/entity/room.entity';

export class SyncRoomEvent {
  static NAME = 'SyncRoomEvent';
  static EVENT_NAME = 'sync-rooms';
  public room: Partial<RoomEntity>;
  public action: RoomAction;

  constructor(partial: Partial<SyncRoomEvent>) {
    Object.assign(this, partial);
  }

  get expose() {
    return {
      action: this.action,
      room: this.room,
    };
  }
}
