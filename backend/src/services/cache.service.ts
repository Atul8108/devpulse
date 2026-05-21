import { Profile } from '../models/Profile';
import { GitHubProfile } from '../types';

export async function getCached(username: string): Promise<GitHubProfile | null> {
  const doc = await Profile.findOne({ username: username.toLowerCase() });
  return doc ? (doc.data as GitHubProfile) : null;
}

export async function setCached(username: string, data: GitHubProfile): Promise<void> {
  await Profile.findOneAndUpdate(
    { username: username.toLowerCase() },
    { data, cachedAt: new Date() },
    { upsert: true, new: true }
  );
}

export async function invalidateCache(username: string): Promise<void> {
  await Profile.deleteOne({ username: username.toLowerCase() });
}
