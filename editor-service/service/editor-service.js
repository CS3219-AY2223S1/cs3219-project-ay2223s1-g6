import io from '../index.js';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
const PREFIX = process.env.COLLABORATION_SERVICE_PREFIX

export function joinRoom(roomId, socket) {
  socket.join(roomId);
}

export function newChange(username, newContent, socket) {
  const [, room] = socket.rooms;
  if (room) {
    io.of(PREFIX).in(room).emit('new content', {
      status: 200,
      change: 'Received an update in content',
      data: {
        newContent: newContent,
        sender: username,
      },
    });
    console.log(`Updated editor content <<${newContent}>> sent to room ${room}`);
  } else {
    throw new Error(`Socket is not in a room. Ensure 'join room' is called before 'change'.`);
  }
}
