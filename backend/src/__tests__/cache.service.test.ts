import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { getCached, setCached } from '../services/cache.service';
import { GitHubProfile } from '../types';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

const mockProfile: GitHubProfile = {
  user: {
    login: 'testuser',
    name: 'Test User',
    avatar_url: 'https://avatars.githubusercontent.com/u/1',
    bio: null,
    company: null,
    location: null,
    blog: null,
    twitter_username: null,
    public_repos: 10,
    followers: 5,
    following: 3,
    created_at: '2020-01-01T00:00:00Z',
  },
  contributionCalendar: { totalContributions: 100, weeks: [] },
  languages: [{ name: 'TypeScript', color: '#3178c6', size: 5000 }],
  totalStars: 42,
  pinnedRepos: [],
};

test('getCached returns null for unknown username', async () => {
  const result = await getCached('unknownuser');
  expect(result).toBeNull();
});

test('setCached stores data and getCached retrieves it', async () => {
  await setCached('testuser', mockProfile);
  const result = await getCached('testuser');
  expect(result).not.toBeNull();
  expect(result!.totalStars).toBe(42);
  expect(result!.user.login).toBe('testuser');
});

test('getCached is case-insensitive', async () => {
  await setCached('TestUser', mockProfile);
  const result = await getCached('testuser');
  expect(result).not.toBeNull();
});

test('setCached overwrites existing cache entry', async () => {
  await setCached('testuser', mockProfile);
  const updated = { ...mockProfile, totalStars: 99 };
  await setCached('testuser', updated);
  const result = await getCached('testuser');
  expect(result!.totalStars).toBe(99);
});
