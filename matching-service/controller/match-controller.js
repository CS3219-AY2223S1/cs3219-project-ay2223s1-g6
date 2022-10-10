import { enterRoom, leaveRoom, newMatch } from '../model/service.js';

export async function handleNewMatch(data, socket) {
  try {
    const { token, username, difficultyLevel } = data;
    if (token && username && difficultyLevel) {
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

export async function handleEnterRoom(data, socket) {
  try {
    const { token, username } = data;
    if (token && username) {
      await enterRoom(username, socket);
    } else {
      socket.emit('enter room failure', {
        status: 400,
        message: 'Missing token and/or username',
      });
    }
  } catch (err) {
    socket.emit('enter room failure', {
      status: 500,
      message: `The server encounters an error: ${err}`,
    });
  }
}

export async function handleLeaveRoom(data, socket) {
  try {
    const { token, username } = data;
    if (token && username) {
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
