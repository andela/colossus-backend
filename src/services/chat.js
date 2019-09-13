import { io } from '..';

export const chat = (eventName, data) => {
  io.emit(eventName, data);
};  
