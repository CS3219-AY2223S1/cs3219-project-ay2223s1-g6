import axios from 'axios';
import { joinRoom, newMessage } from '../service/chat-service.js';

async function authenticateUser(username, token) {
  // TODO: reference config file for user service url
  let authSuccess;
  await axios.get('http://localhost:8000/api/user/authentication', {
    params: {
      username: username,
      auth: token,
    },
  }).then(() => {
    authSuccess = true;
  }).catch(() => {
    authSuccess = false;
  });
  return authSuccess;
}

export async function handleJoinRoom(data, socket) {
  try {
    const { token, username, roomId } = data;
    if (token && username && roomId) {
      const authSuccess = await authenticateUser(username, token);
      if (!authSuccess) {
        socket.emit('join room failure', {
          status: 403,
          message: 'Not allowed to access this resource',
        });
        return;
      }
      joinRoom(roomId, socket);
    } else {
      socket.emit('join room failure', {
        status: 400,
        message: 'Missing token and/or username and/or roomId',
      });
    }
  } catch (err) {
    socket.emit('join room failure', {
      status: 500,
      message: `The server encounters an error: ${err}`,
    });
  }
}

export async function handleNewMessage(data, socket) {
  try {
    const { token, username, message } = data;
    if (token && username && (message !== undefined)) {
      const authSuccess = await authenticateUser(username, token);
      if (!authSuccess) {
        socket.emit('message failure', {
          status: 403,
          message: 'Not allowed to access this resource',
        });
        return;
      }
      newMessage(username, message, socket);
    } else {
      socket.emit('message failure', {
        status: 400,
        message: 'Missing token and/or username and/or message',
      });
    }
  } catch (err) {
    socket.emit('message failure', {
      status: 500,
      message: `The server encounters an error: ${err}`,
    });
  }
}
