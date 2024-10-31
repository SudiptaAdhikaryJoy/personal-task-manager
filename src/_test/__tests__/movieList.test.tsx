import React from 'react';
import { render, screen, waitFor, RenderResult } from '@testing-library/react';
import axios, { AxiosResponse } from 'axios';
import MovieListComponent from '@/components/ui/features/MoveList';


// Types
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

interface ApiResponse {
  data: {
    parts: Movie[];
  };
}

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('MovieListComponent', () => {
  // Test data
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: "Test Movie 1",
      overview: "Test Overview 1",
      poster_path: "/test-path-1.jpg"
    },
    {
      id: 2,
      title: "Test Movie 2",
      overview: "Test Overview 2",
      poster_path: "/test-path-2.jpg"
    }
  ];

  const mockApiResponse: Partial<AxiosResponse<ApiResponse>> = {
    data: {
      parts: mockMovies
    }
  };

  const mockApiConfig = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/collection/10?language=en-US',
    headers: {
      accept: 'application/json',
      Authorization: expect.any(String)
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should show loading state on initial render', () => {
      // Arrange
      const expectedSkeletonCount = 6;

      // Act
      render(<MovieListComponent />);

      // Assert
      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons).toHaveLength(expectedSkeletonCount);
    });
  });

  describe('API Integration', () => {
    it('should make API call with correct parameters', async () => {
      // Arrange
      mockedAxios.request.mockResolvedValueOnce(mockApiResponse);

      // Act
      render(<MovieListComponent />);

      // Assert
      expect(mockedAxios.request).toHaveBeenCalledWith(mockApiConfig);
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
    });

    it('should display movies when API call succeeds', async () => {
      // Arrange
      mockedAxios.request.mockResolvedValueOnce(mockApiResponse);
      let component: RenderResult;

      // Act
      component = render(<MovieListComponent />);

      // Assert
      await waitFor(() => {
        mockMovies.forEach(movie => {
          expect(screen.getByText(movie.title)).toBeInTheDocument();
          expect(screen.getByText(movie.overview)).toBeInTheDocument();
        });
      });

      const images = await screen.findAllByRole('img');
      images.forEach((img, index) => {
        expect(img).toHaveAttribute(
          'src',
          `https://image.tmdb.org/t/p/w500${mockMovies[index].poster_path}`
        );
      });
    });

    it('should handle API error state', async () => {
      // Arrange
      const errorMessage = 'Failed to fetch movies';
      mockedAxios.request.mockRejectedValueOnce(new Error(errorMessage));

      // Act
      render(<MovieListComponent />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
      });
    });

    it('should handle empty movie list', async () => {
      // Arrange
      const emptyResponse: Partial<AxiosResponse<ApiResponse>> = {
        data: {
          parts: []
        }
      };
      mockedAxios.request.mockResolvedValueOnce(emptyResponse);

      // Act
      render(<MovieListComponent />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('No movies found.')).toBeInTheDocument();
      });
    });
  });

  describe('UI Elements', () => {
    it('should render movie cards with all required elements', async () => {
      // Arrange
      mockedAxios.request.mockResolvedValueOnce(mockApiResponse);

      // Act
      render(<MovieListComponent />);

      // Assert
      await waitFor(() => {
        mockMovies.forEach(movie => {
          // Header
          expect(screen.getByText(movie.title)).toBeInTheDocument();
          
          // Body
          expect(screen.getByText(movie.overview)).toBeInTheDocument();
          
          // Image
          const image = screen.getByAltText(movie.title);
          expect(image).toHaveAttribute(
            'src',
            `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          );
          
          // Button
          expect(screen.getAllByText('Learn More')).toHaveLength(mockMovies.length);
        });
      });
    });

    it('should maintain correct grid layout', async () => {
      // Arrange
      mockedAxios.request.mockResolvedValueOnce(mockApiResponse);

      // Act
      const { container } = render(<MovieListComponent />);

      // Assert
      await waitFor(() => {
        const gridContainer = container.querySelector('.grid');
        expect(gridContainer).toHaveClass('grid-cols-4', 'sm:grid-cols-2', 'lg:grid-cols-3');
      });
    });
  });

  describe('Loading State', () => {
    it('should show and hide loading state correctly', async () => {
      // Arrange
      mockedAxios.request.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockApiResponse), 100))
      );

      // Act
      render(<MovieListComponent />);

      // Assert - Initially loading
      expect(screen.getAllByTestId('skeleton')).toHaveLength(6);

      // Assert - Loading finished
      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        expect(screen.getAllByText('Learn More')).toHaveLength(mockMovies.length);
      });
    });
  });
});