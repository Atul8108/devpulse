import axios from 'axios';
import type { NormalisedData, TrendingItem } from '../types/github';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export async function fetchUser(username: string): Promise<NormalisedData> {
  const { data } = await api.get<NormalisedData>(`/api/user/${username}`);
  return data;
}

export async function fetchTrending(): Promise<TrendingItem[]> {
  const { data } = await api.get<TrendingItem[]>('/api/trending');
  return data;
}
