import PendingMatch from './match-model.js';

export async function createPendingMatch(params) {
  if (params.difficultyLevel.toString() == "easy") {
    return PendingMatch.easyLevel.create(params);
  } else if (params.difficultyLevel.toString() == "medium") {
    return PendingMatch.mediumLevel.create(params);
  } else if (params.difficultyLevel.toString() == "hard") {
    return PendingMatch.hardLevel.create(params);
  }
  // return PendingMatch.create(params);
}
