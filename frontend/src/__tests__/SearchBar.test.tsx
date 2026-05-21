import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

const mockNavigate = jest.fn();
const mockAddRecentSearch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../store/useProfileStore', () => ({
  useProfileStore: () => ({
    recentSearches: [],
    addRecentSearch: mockAddRecentSearch,
  }),
}));

function renderSearchBar() {
  return render(
    <MemoryRouter>
      <SearchBar />
    </MemoryRouter>
  );
}

describe('SearchBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockAddRecentSearch.mockClear();
  });

  it('renders input and button', () => {
    renderSearchBar();
    expect(screen.getByPlaceholderText('Enter GitHub username…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('updates input value on type', async () => {
    const user = userEvent.setup();
    renderSearchBar();
    const input = screen.getByPlaceholderText('Enter GitHub username…');
    await user.type(input, 'torvalds');
    expect(input).toHaveValue('torvalds');
  });

  it('does not navigate on empty submit', async () => {
    const user = userEvent.setup();
    renderSearchBar();
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to /user/:username on valid submit', async () => {
    const user = userEvent.setup();
    renderSearchBar();
    await user.type(screen.getByPlaceholderText('Enter GitHub username…'), 'torvalds');
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/user/torvalds');
    expect(mockAddRecentSearch).toHaveBeenCalledWith('torvalds');
  });
});
