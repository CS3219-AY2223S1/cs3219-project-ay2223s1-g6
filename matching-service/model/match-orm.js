import { findPendingMatch } from './repository.js';

export async function ormFindMatch(userId, username, difficultyLevel) {
  try {
    // TODO: logic of checking whether there's match in DB or should create a new pending match should be here


    const resp = await findPendingMatch({ userId, username, difficultyLevel });
    console.log(resp);
    return resp;
  } catch (err) {
    console.log('ERROR: Could not create a new pending match');
    return { err };
  }
}
