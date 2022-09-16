import { ormCreateNewMatch as _createPendingMatch } from '../model/match-orm.js';

export async function createPendingMatch(req, res) {
  try {
    const { username, difficultyLevel } = req.body;
    if (username && difficultyLevel) {
      const resp = await _createPendingMatch(username, difficultyLevel);
      console.log(resp);
      if (resp.err) {
        return res.status(400).json({ message: 'Could not create a new pending match!' });
      } else {
        console.log(`Pending match created for user ${username}`);
        return res.status(200).json({ message: `Pending match created for user ${username}` });
      }
    } else {
      return res.status(400).json({ message: 'Username and/or DifficultyLevel are missing!' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failure when creating new pending match!' });
  }
}
