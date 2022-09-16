import PendingMatch from './match-model.js';

export async function createPendingMatch(params) {
  return PendingMatch.create(params);
}
