import { EasyPendingMatch, HardPendingMatch, MediumPendingMatch } from './match-model.js';

export async function createPendingMatch(userId, username, difficultyLevel, roomId) {
  switch (difficultyLevel) {
    case 'easy':
      return EasyPendingMatch.create({ userId, username, roomId });
    case 'medium':
      return MediumPendingMatch.create({ userId, username, roomId });
    case 'hard':
      return HardPendingMatch.create({ userId, username, roomId });
  }
}

export async function deletePendingMatch(userId, difficultyLevel) {
  switch (difficultyLevel) {
    case 'easy':
      return EasyPendingMatch.destroy({ where: { userId } });
    case 'medium':
      return MediumPendingMatch.destroy({ where: { userId } });
    case 'hard':
      return HardPendingMatch.destroy({ where: { userId } });
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
  }
}
