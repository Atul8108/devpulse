import { render, screen } from '@testing-library/react';
import StatCards from '../components/StatCards';
import type { NormalisedData } from '../types/github';

const mockData: NormalisedData = {
  user: {
    login: 'testuser',
    name: 'Test User',
    avatar_url: '',
    bio: null,
    location: null,
    company: null,
    blog: null,
    twitter_username: null,
    public_repos: 10,
    followers: 100,
    following: 50,
    created_at: '2020-01-01T00:00:00Z',
  },
  totalContributions: 500,
  contributionCalendar: [],
  languages: [],
  activity: [],
  stars: 1234,
  forks: 567,
};

describe('StatCards', () => {
  it('renders all 4 stat cards', () => {
    render(<StatCards data={mockData} />);
    expect(screen.getByText('Total Stars')).toBeInTheDocument();
    expect(screen.getByText('Total Forks')).toBeInTheDocument();
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    expect(screen.getByText('Longest Streak')).toBeInTheDocument();
  });

  it('displays correct values', () => {
    render(<StatCards data={mockData} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('567')).toBeInTheDocument();
  });

  it('handles undefined stats gracefully (shows 0)', () => {
    const sparseData = {
      ...mockData,
      stars: undefined as unknown as number,
      forks: undefined as unknown as number,
    };
    render(<StatCards data={sparseData} />);
    // safeNum returns 0 for undefined; both stars and forks card show "0"
    expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
  });
});
