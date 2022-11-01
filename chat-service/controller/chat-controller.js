import axios from 'axios';
import { joinRoom, newMessage } from '../service/chat-service.js';

import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
const USER_SRV_HOST = process.env.USER_SERVICE_HOST
const USER_SRV_PORT = process.env.USER_SERVICE_PORT
const USER_SRV_PREFIX = process.env.USER_SERVICE_PREFIX

async function authenticateUser(username, token) {
  let authSuccess;
  await axios.get(`http://${USER_SRV_HOST}:${USER_SRV_PORT}${USER_SRV_PREFIX}/authentication`, {
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
    if (token && username && message) {
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
