import { enterRoom, leaveRoom, newMatch } from '../model/service.js';

export async function handleNewMatch(data, socket) {
  try {
    const { username, difficultyLevel } = data;
    if (username && difficultyLevel) {
      await newMatch(username, difficultyLevel, socket);
    } else {
      socket.emit('match failure', 'Missing username and/or difficultyLevel');
    }
  } catch (err) {
    console.log(err);
    socket.emit('match failure', `The server encounters an error: ${err}`);
  }
}

export async function handleEnterRoom(data, socket) {
  try {
    const { username } = data;
    if (username) {
      await enterRoom(username, socket);
    } else {
      socket.emit('enter room failure', 'Missing username');
    }
  } catch (err) {
    socket.emit('enter room failure', `The server encounters an error: ${err}`);
  }
}

export async function handleLeaveRoom(data, socket) {
  try {
    const { username } = data;
    if (username) {
      await leaveRoom(username);
    } else {
      socket.emit('leave room failure', 'Missing username');
    }
  } catch (err) {
    socket.emit('leave room failure', `The server encounters an error: ${err}`);
  }
}

// TODO: handle disconnection
