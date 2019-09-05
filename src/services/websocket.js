import { io } from '..';

export const eventEmitter = (eventName, data) => {
  io.emit(eventName, data);
};
