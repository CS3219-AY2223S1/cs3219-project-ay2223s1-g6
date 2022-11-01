import io from '../index.js';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
const PREFIX = process.env.COMMUNICATION_SERVICE_PREFIX

export function joinRoom(roomId, socket) {
  socket.join(roomId);
}

export function newMessage(username, message, socket) {
  const [, room] = socket.rooms;
  if (room) {
    io.of(PREFIX).in(room).emit('new message', {
      status: 200,
      message: 'Received a new message',
      data: {
        messageContent: message,
        sender: username,
      },
    });
    console.log(`Message <<${message}>> sent to room ${room}`);
  } else {
    throw new Error(`Socket is not in a room. Ensure 'join room' is called before 'message'.`);
  }
}
