import { EasyPendingMatch, HardPendingMatch, MediumPendingMatch } from './match-model.js';
import { Room } from './room-model.js';

export async function createPendingMatch(username, difficultyLevel, roomId) {
  switch (difficultyLevel) {
    case 'easy':
      return EasyPendingMatch.create({ username, roomId });
    case 'medium':
      return MediumPendingMatch.create({ username, roomId });
    case 'hard':
      return HardPendingMatch.create({ username, roomId });
    default:
      throw new Error('Invalid difficulty level');
  }
}

export async function deletePendingMatch(username, difficultyLevel) {
  switch (difficultyLevel) {
    case 'easy':
      return EasyPendingMatch.destroy({ where: { username } });
    case 'medium':
      return MediumPendingMatch.destroy({ where: { username } });
    case 'hard':
      return HardPendingMatch.destroy({ where: { username } });
    default:
      throw new Error('Invalid difficulty level');
  }
}

export async function findSameLevelPendingMatch(difficultyLevel) {
  switch (difficultyLevel) {
    case 'easy':
      return EasyPendingMatch.findOne();
    case 'medium':
      return MediumPendingMatch.findOne();
    case 'hard':
      return HardPendingMatch.findOne();
    default:
      throw new Error('Invalid difficulty level');
  }
}

export async function createRoom(username, roomId, difficultyLevel, questionId) {
  if (difficultyLevel === 'easy' || difficultyLevel === 'medium' || difficultyLevel === 'hard') {
    return Room.create({ username, roomId, difficultyLevel, questionId });
  } else {
    throw new Error('Invalid difficulty level');
  }
}

export async function updateRoom(username, socketId) {
  if (!socketId) {
    throw new Error('Invalid socketId');
  }
  const room = await Room.findByPk(username);
  if (!room) {
    throw new Error(`Room for ${username} does not exist`);
  }
  room.socketId = socketId;
  return room.save();
}

export async function deleteRoomsByRoomId(roomId) {
  return Room.destroy({ where: { roomId } });
}

export async function getRoomByUsername(username) {
  return Room.findByPk(username);
}

export async function getRoomBySocketId(socketId) {
  return Room.findOne({ socketId });
}
