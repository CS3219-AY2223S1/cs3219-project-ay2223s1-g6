import axios from 'axios';
import { joinRoom, leaveRoom, newMatch } from '../model/service.js';

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

// TODO: handle disconnection
