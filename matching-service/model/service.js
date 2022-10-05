import {
  createPendingMatch,
  createRoom,
  deletePendingMatch,
  deleteRoomByRoomId,
  findSameLevelPendingMatch,
  getRoomByUsername,
} from './repository.js';
import io from '../index.js';

export async function newMatch(username, difficultyLevel, socket) {
  // console.log(socket.rooms);
  // TODO: There should be a check here to verify the user is not in the DB (same level probably)
  const pendingMatch = await findSameLevelPendingMatch(difficultyLevel);
  if (pendingMatch === null) {
    // no existing pending match, create a new one and wait for 30 seconds
    console.log('no match found');
    const roomId = (Math.random() + 1).toString(36).slice(2, 18);
    await createPendingMatch(username, difficultyLevel, roomId);
    socket.join(roomId);
    // console.log(socket.rooms);
    socket.emit('start waiting', 'no match at current moment, waiting for 30 seconds');
    console.log(`user ${username} has joined a new room: ${roomId}`);
    console.log('start waiting for 30 seconds');
    setTimeout(async () => {
      // after 30 seconds, check if the user is still in the DB
      // in -> match failure, remove the user
      const numUsersDeleted = await deletePendingMatch(username, difficultyLevel);
      if (numUsersDeleted === 1) {
        socket.leave(roomId);
        socket.emit('match failure', 'no match could be found after waiting for 30 seconds');
        console.log('finish waiting for 30 seconds and no match found');
      }
    }, 30 * 1000);
  } else {
    // TODO: There is a potential bug here if another match is made before deletion,
    // TODO: but let's not concern about it for now
    await deletePendingMatch(pendingMatch.username, difficultyLevel);
    socket.join(pendingMatch.roomId);
    // add both users into Room DB
    await createRoom(pendingMatch.username, pendingMatch.roomId, difficultyLevel);
    await createRoom(username, pendingMatch.roomId, difficultyLevel);
    // TODO: Anything to return for success?
    // console.log(socket.rooms);
    io.of('/api/match').in(pendingMatch.roomId).emit('match success');
    console.log('found a match instantly!');
    console.log(`user ${username} and ${pendingMatch.username} are in room: ${pendingMatch.roomId}`);
  }
  return true;
}

export async function enterRoom(username, socket) {
  const room = await getRoomByUsername(username);
  if (room) {
    socket.join(room.roomId);
    socket.emit('in room', { roomId: room.roomId, difficultyLevel: room.difficultyLevel });
  } else {
    throw new Error(`No room for user ${username} to enter. Ensure 'match success' is received before 'enter room'.`);
  }
}

export async function leaveRoom(username) {
  const room = await getRoomByUsername(username);
  console.log('123');
  if (room) {
    await deleteRoomByRoomId(room.roomId);
  } else {
    throw new Error(`No room for user ${username} to leave. Ensure 'match success' is received before 'leave room'.`);
  }

  // for frontend to close the room for both users
  io.of('/api/match').in(room.roomId).emit('room closing');
}
