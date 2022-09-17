import { createPendingMatch } from './repository.js';

export async function ormCreateNewMatch(userId, username, difficultyLevel) {
  try {
    // TODO: logic of checking whether there's match in DB or should create a new pending match should be here


    await createPendingMatch({ userId, username, difficultyLevel });
    return true;
  } catch (err) {
    console.log('ERROR: Could not create a new pending match');
    return { err };
  }
}
