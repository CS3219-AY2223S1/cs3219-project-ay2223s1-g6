import { enterRoom, leaveRoom, newMatch } from '../model/service.js';

export async function handleNewMatch(data, socket) {
  try {
    const { token, username, difficultyLevel } = data;
    if (username && difficultyLevel) {
      await newMatch(username, difficultyLevel, socket);
    } else {
      socket.emit('match failure', { message: 'Missing username and/or difficultyLevel' });
    }
  } catch (err) {
    console.log(err);
    socket.emit('match failure', { message: `The server encounters an error: ${err}` });
  }
}

export async function handleEnterRoom(data, socket) {
  try {
    const { token, username } = data;
    if (username) {
      await enterRoom(username, socket);
    } else {
      socket.emit('enter room failure', { message: 'Missing username' });
    }
  } catch (err) {
    socket.emit('enter room failure', { message: `The server encounters an error: ${err}` });
  }
}

export async function handleLeaveRoom(data, socket) {
  try {
    const { token, username } = data;
    if (username) {
      await leaveRoom(username);
    } else {
      socket.emit('leave room failure', { message: 'Missing username' });
    }
  } catch (err) {
    socket.emit('leave room failure', { message: `The server encounters an error: ${err}` });
  }
}

// TODO: handle disconnection
