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

export async function createRoom(username, roomId, difficultyLevel) {
  if (difficultyLevel === 'easy' || difficultyLevel === 'medium' || difficultyLevel === 'hard') {
    return Room.create({ username, roomId, difficultyLevel });
  } else {
    throw new Error('Invalid difficulty level');
  }
}

export async function deleteRoomByRoomId(roomId) {
  return Room.destroy({ where: { roomId } });
}

export async function getRoomByUsername(username) {
  return Room.findByPk(username);
}
