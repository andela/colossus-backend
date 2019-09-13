import { io } from '..';
import models from '../models';

const { Chat, User } = models;

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
 * @param {any} cb 
 */
export const watchSocket = (socket, eventName, cb) => {
  socket.on(eventName, cb);
};

export const createMessage = async ({ userId, message }) => {
  const chatItem = await Chat.create({
    userId,
    message,
    include: [{
      model: User,
      attributes: ['firstName', 'lastName', 'id', 'email'],
      as: 'user'
    }]
  });
  return chatItem;
};

export const getAllMessages = async () => {
  const messages = await Chat.findAll({
    include: [{
      model: User,
      as: 'user',
      attributes: ['firstName', 'lastName', 'id', 'email']
    }]
  });
  return messages;
};
