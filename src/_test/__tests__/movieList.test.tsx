import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MovieList from '../../components/ui/features/MoveList';

// Mock axios
jest.mock('axios');

// Mock window.innerWidth
window.innerWidth = 1200;

// Mock response data
const mockMovies = [
  {
    id: 1,
    title: "Test Movie 1",
    overview: "Test Overview 1",
    poster_path: "/test1.jpg"
  },
  {
    id: 2,
    title: "Test Movie 2",
    overview: "Test Overview 2",
    poster_path: "/test2.jpg"
  }
];

describe('MovieList Component', () => {
  beforeEach(() => {
    // Reset mock between tests
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(<MovieList />);
    
    // Check for loading cards (we can look for multiple skeleton elements)
    const skeletonCards = screen.getAllByTestId('movie-skeleton');
    expect(skeletonCards).toHaveLength(8); // 4 columns * 2 rows
  });

  it('should render movies after loading', async () => {
    // Mock successful API response
    axios.request.mockResolvedValueOnce({ 
      data: { 
        parts: mockMovies 
      } 
    });

    render(<MovieList />);

    // Wait for movies to load
    await waitFor(() => {
      const movieCards = screen.getAllByTestId('movie-card');
      expect(movieCards).toHaveLength(2);
    });

    // Check if movie titles are rendered
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
  });

  it('should render error message when API fails', async () => {
    // Mock API error
    axios.request.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<MovieList />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
    });
  });

  it('should render no movies message when API returns empty array', async () => {
    // Mock empty response
    axios.request.mockResolvedValueOnce({ 
      data: { 
        parts: [] 
      } 
    });

    render(<MovieList />);

    // Wait for no movies message
    await waitFor(() => {
      expect(screen.getByText('No movies found.')).toBeInTheDocument();
    });
  });
});