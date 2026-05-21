import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TrendingList from '../components/TrendingList';

// var is hoisted as undefined before jest.mock's factory runs;
// the arrow function inside create() captures mockGet by reference,
// so by the time any api.get() call happens in tests, mockGet is jest.fn().
// eslint-disable-next-line no-var
var mockGet = jest.fn();

jest.mock('axios', () => ({
  create: () => ({ get: (...args: unknown[]) => mockGet(...args) }),
}));

describe('TrendingList', () => {
  beforeEach(() => {
    mockGet.mockClear();
  });

  it('shows loading state initially', () => {
    mockGet.mockReturnValue(new Promise(() => {})); // never resolves
    render(
      <MemoryRouter>
        <TrendingList />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading trending/i)).toBeInTheDocument();
  });

  it('renders trending items after fetch', async () => {
    mockGet.mockResolvedValue({
      data: {
        trending: [
          { username: 'torvalds', searches: 150 },
          { username: 'gaearon', searches: 89 },
        ],
      },
    });
    render(
      <MemoryRouter>
        <TrendingList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('@torvalds')).toBeInTheDocument();
      expect(screen.getByText('@gaearon')).toBeInTheDocument();
    });
  });

  it('shows empty state when no data', async () => {
    mockGet.mockResolvedValue({ data: { trending: [] } });
    render(
      <MemoryRouter>
        <TrendingList />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/no trending developers/i)).toBeInTheDocument();
    });
  });
});
