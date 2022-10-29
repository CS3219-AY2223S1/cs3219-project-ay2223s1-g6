import io from '../index.js';

export function joinRoom(roomId, socket) {
  socket.join(roomId);
}

export function newMessage(username, message, socket) {
  const [, room] = socket.rooms;
  if (room) {
    io.of('/api/chat').in(room).emit('new message', {
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
