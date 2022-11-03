import axios from 'axios';
import {
  handleMatchDisconnect as _handleMatchDisconnect,
  handleRoomDisconnect as _handleRoomDisconnect,
  hasExistingMatch as _hasExistingMatch,
  joinRoom,
  leaveRoom,
  newMatch,
} from '../model/service.js';

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

export async function handleNewMatch(data, socket) {
  try {
    const { token, username, difficultyLevel } = data;
    if (token && username && difficultyLevel) {
      const authSuccess = await authenticateUser(username, token);
      if (!authSuccess) {
        socket.emit('match failure', {
          status: 403,
          message: 'Not allowed to access this resource',
        });
        return;
      }
      const hasExistingMatch = await _hasExistingMatch(username);
      if (hasExistingMatch) {
        socket.emit('match failure', {
          status: 409,
          message: 'There is an existing match',
        });
        return;
      }
      await newMatch(username, difficultyLevel, socket);
    } else {
      socket.emit('match failure', {
        status: 400,
        message: 'Missing token and/or username and/or difficultyLevel',
      });
    }
  } catch (err) {
    socket.emit('match failure', {
      status: 500,
      message: `The server encounters an error: ${err}`,
    });
  }
}

export async function handleJoinRoom(data, socket) {
  try {
    const { token, username } = data;
    if (token && username) {
      const authSuccess = await authenticateUser(username, token);
      if (!authSuccess) {
        socket.emit('join room failure', {
          status: 403,
          message: 'Not allowed to access this resource',
        });
        return;
      }
      await joinRoom(username, socket);
    } else {
      socket.emit('join room failure', {
        status: 400,
        message: 'Missing token and/or username',
      });
    }
  } catch (err) {
    socket.emit('join room failure', {
      status: 500,
      message: `The server encounters an error: ${err}`,
    });
  }
}

export async function handleLeaveRoom(data, socket) {
  try {
    const { token, username } = data;
    if (token && username) {
      const authSuccess = await authenticateUser(username, token);
      if (!authSuccess) {
        socket.emit('leave room failure', {
          status: 403,
          message: 'Not allowed to access this resource',
        });
        return;
      }
      await leaveRoom(username);
    } else {
      socket.emit('leave room failure', {
        status: 400,
        message: 'Missing token and/or username',
      });
    }
  } catch (err) {
    socket.emit('leave room failure', {
      status: 500,
      message: `The server encounters an error: ${err}`,
    });
  }
}

export async function handleMatchDisconnect(socket) {
  try {
    await _handleMatchDisconnect(socket);
  } catch (err) {
    console.error(err);
  }
}

export async function handleRoomDisconnect(socket) {
  try {
    await _handleRoomDisconnect(socket);
  } catch (err) {
    console.error(err);
  }
}
