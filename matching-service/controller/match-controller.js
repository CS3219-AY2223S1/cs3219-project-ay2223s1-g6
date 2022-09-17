import { ormFindMatch as _findMatch } from '../model/match-orm.js';

export async function findMatch(req, res) {
  try {
    const { userId, username, difficultyLevel } = req.body;
    if (userId && username && difficultyLevel) {
      const resp = await _findMatch(userId, username, difficultyLevel);
      console.log(resp);
      if (resp.err) {
        return res.status(400).json({ message: 'Could not create a new pending match!' });
      } else {
        console.log(`Pending match created for user ${username}`);
        return res.status(200).json({ message: `Pending match created for user ${username}` });
      }
    } else {
      return res.status(400).json({ message: 'UserId or Username and/or DifficultyLevel are missing!' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failure when creating new pending match!' });
  }
}
