import { Request, Response, NextFunction } from 'express';
import { getCached, setCached } from '../services/cache.service';
import { fetchGitHubProfile } from '../services/github.service';
import { SearchHistory } from '../models/SearchHistory';
import { transformProfile } from '../utils/transform';
import { AppError } from '../middleware/errorHandler';

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { username } = req.params;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = await getCached(username);

    if (!result) {
      const raw = await fetchGitHubProfile(username);
      result = transformProfile({
        user: raw.user,
        contributionCalendar: raw.contributionCalendar,
        languages: raw.languages,
        totalStars: raw.totalStars,
        pinnedRepos: raw.pinnedRepos,
      });
      await setCached(username, result);
    }

    await SearchHistory.create({ username: username.toLowerCase() });

    res.json(result);
  } catch (err: unknown) {
    const error = err as AppError & { response?: { status: number } };
    if (error.response?.status === 404) {
      error.statusCode = 404;
      error.message = `GitHub user "${username}" not found`;
    }
    next(error);
  }
}
