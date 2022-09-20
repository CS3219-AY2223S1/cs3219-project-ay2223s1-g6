import { newMatch as _newMatch } from '../model/service.js';

export async function handleNewMatch(data, socket) {
  try {
    const { userId, username, difficultyLevel } = data;
    if (userId && username && difficultyLevel) {
      await _newMatch(userId, username, difficultyLevel, socket);
    } else {
      socket.emit('match failure', { message: 'Missing userId and/or username and/or difficultyLevel' });
    }
  } catch (err) {
    console.log(err);
    socket.emit('match failure', { message: 'Could not create a new pending match' });
  }
}

// TODO: handle leave room

// TODO: handle disconnection
