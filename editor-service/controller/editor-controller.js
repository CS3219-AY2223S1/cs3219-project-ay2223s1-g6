import axios from 'axios';
import { joinRoom, newChange } from '../service/editor-service.js';

const USER_SRV_HOST = process.env.USER_SERVICE_HOST;
const USER_SRV_PORT = process.env.USER_SERVICE_PORT;
const USER_SRV_PREFIX = process.env.USER_SERVICE_PREFIX;

async function authenticateUser(username, token) {
  // TODO: reference config file for user service url
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

export async function handleEditorChange(data, socket) {
  try {
    const { token, username, newContent } = data;
    // newContent can be empty
    if (token && username && (newContent !== undefined)) {
      const authSuccess = await authenticateUser(username, token);
      if (!authSuccess) {
        socket.emit('change failure', {
          status: 403,
          message: 'Not allowed to access this resource',
        });
        return;
      }
      newChange(username, newContent, socket);
    } else {
      socket.emit('change failure', {
        status: 400,
        message: 'Missing token and/or username and/or newContent',
      });
    }
  } catch (err) {
    socket.emit('change failure', {
      status: 500,
      message: `The server encounters an error: ${err}`,
    });
  }
}
