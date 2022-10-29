import axios from 'axios';
import io from '../index.js';
import {
  createPendingMatch,
  createRoom,
  deletePendingMatch,
  deleteRoomByRoomId,
  findSameLevelPendingMatch,
  getRoomByUsername,
} from './repository.js';

export async function newMatch(username, difficultyLevel, socket) {
  // TODO: There should be a check here to verify the user is not in the DB (same level probably)

  const pendingMatch = await findSameLevelPendingMatch(difficultyLevel);
  if (pendingMatch === null) {
    // no existing pending match, create a new one and wait for 30 seconds
    const roomId = (Math.random() + 1).toString(36).slice(2, 18);
    await createPendingMatch(username, difficultyLevel, roomId);
    socket.join(roomId);
    socket.emit('start waiting', {
      status: 202,
      message: 'No match at current moment, start waiting for 30 seconds',
    });
    setTimeout(async () => {
      // after 30 seconds, check if the user is still in the DB
      // if in DB -> match failure, remove the user
      const numUsersDeleted = await deletePendingMatch(username, difficultyLevel);
      if (numUsersDeleted === 1) {
        socket.leave(roomId);
        socket.emit('match failure', {
          status: 404,
          message: 'No match could be found after waiting for 30 seconds',
        });
      }
    }, 30 * 1000);
  } else {
    // TODO: There is a potential bug here if another match is made before deletion
    await deletePendingMatch(pendingMatch.username, difficultyLevel);
    socket.join(pendingMatch.roomId);

    // ask question service for a random question id
    // TODO: reference config file for question service url
    const resp = await axios.get(`http://localhost:8002/api/questions/randomId/${difficultyLevel}`);
    const questionId = resp.data.questionId;

    // add both users into Room DB
    await createRoom(pendingMatch.username, pendingMatch.roomId, difficultyLevel, questionId);
    await createRoom(username, pendingMatch.roomId, difficultyLevel, questionId);

    io.of('/api/match').in(pendingMatch.roomId).emit('match success', {
      status: 200,
      message: 'Match found',
      data: {
        questionId: questionId,
      },
    });
    console.log(`user ${username} and ${pendingMatch.username} are in room: ${pendingMatch.roomId}`);
  }
  return true;
}

export async function joinRoom(username, socket) {
  const room = await getRoomByUsername(username);
  if (room) {
    socket.join(room.roomId);
    socket.emit('in room', {
      status: 200,
      message: 'Socket joined room successfully',
      data: {
        roomId: room.roomId,
        difficultyLevel: room.difficultyLevel,
        questionId: room.questionId,
      },
    });
  } else {
    // this is an internal server error because it indicates the caller's logic is badly written
    throw new Error(`No room for user ${username} to join. Ensure 'match success' is received before 'join room'.`);
  }
}

export async function leaveRoom(username) {
  const room = await getRoomByUsername(username);
  if (room) {
    await deleteRoomByRoomId(room.roomId);
  } else {
    // this is an internal server error because it indicates the caller's logic is badly written
    throw new Error(`No room for user ${username} to leave. Ensure 'match success' is received before 'leave room'.`);
  }

  // TODO: Should the socket leave the room?

  // for frontend to close the room for both users
  io.of('/api/match').in(room.roomId).emit('room closing', {
    status: 200,
    message: 'Room destroyed successfully',
  });
}
