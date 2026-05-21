import { Request, Response, NextFunction } from 'express';
import { SearchHistory } from '../models/SearchHistory';
import { TrendingEntry } from '../types';

export async function getTrending(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const trending: TrendingEntry[] = await SearchHistory.aggregate([
      { $match: { searchedAt: { $gte: since } } },
      { $group: { _id: '$username', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, username: '$_id', count: 1 } },
    ]);

    const count = await SearchHistory.countDocuments();
    console.log('SearchHistory total docs:', count);
    console.log('trending result:', JSON.stringify(trending));

    res.json(trending);
  } catch (err) {
    next(err);
  }
}
