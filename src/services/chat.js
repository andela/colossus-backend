import { io } from '..';
import models from '../models';

const { Chat } = models;

/**
 * 
 * @param {string} eventName 
 * @param {any} data 
 */
export const chat = (eventName, data) => {
  io.emit(eventName, data);
};

/**
 * 
 * @param {*} socket 
 * @param {string} eventName 
 * @param {void} cb 
 */
export const watchSocket = (socket, eventName, cb) => {
  socket.on(eventName, cb);
};
