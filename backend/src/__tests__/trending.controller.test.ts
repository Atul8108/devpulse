import { Request, Response, NextFunction } from 'express';

jest.mock('../models/SearchHistory', () => ({
  SearchHistory: {
    aggregate: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

import { SearchHistory } from '../models/SearchHistory';
import { getTrending } from '../controllers/trending.controller';

const mockAggregate = SearchHistory.aggregate as jest.Mock;
const mockCountDocuments = SearchHistory.countDocuments as jest.Mock;

function makeRes() {
  const res = { json: jest.fn() } as unknown as Response;
  return res;
}

const next: NextFunction = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockCountDocuments.mockResolvedValue(0);
});

test('returns empty array when no searches in last 7 days', async () => {
  mockAggregate.mockResolvedValue([]);
  const res = makeRes();
  await getTrending({} as Request, res, next);
  expect(res.json).toHaveBeenCalledWith([]);
});

test('returns sorted trending list', async () => {
  const trending = [
    { username: 'alice', count: 10 },
    { username: 'bob', count: 4 },
  ];
  mockAggregate.mockResolvedValue(trending);
  const res = makeRes();
  await getTrending({} as Request, res, next);
  expect(res.json).toHaveBeenCalledWith(trending);
});

test('calls next with error when aggregate throws', async () => {
  const error = new Error('DB failure');
  mockAggregate.mockRejectedValue(error);
  const res = makeRes();
  await getTrending({} as Request, res, next);
  expect(next).toHaveBeenCalledWith(error);
});
