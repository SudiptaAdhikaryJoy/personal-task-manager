"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Skeleton,
} from "@nextui-org/react";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

// Custom hook for handling window resize and grid layout
const useResponsiveGrid = () => {
  const [columns, setColumns] = useState(4);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
 const handleResize =
      () => {
        const width = window.innerWidth;
        setWindowWidth(width);

        if (width < 640) {
          setColumns(1);
        } else if (width < 768) {
          setColumns(3);
        }
        else if (width < 1024) {
          setColumns(4);
        } else {
          setColumns(4);
        }
      };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { columns, windowWidth };
};

const MovieCardSkeleton = ({ width }: { width: number }) => (
  <Card 
    className="h-[320px]" 
    style={{ width: `${width}px`, margin: "10px" }}
    data-testid="movie-skeleton"
  >
    <CardHeader className="pb-2">
      <Skeleton className="w-3/4 h-4 rounded-lg" />
    </CardHeader>
    <CardBody className="flex flex-col gap-2 overflow-hidden">
      <Skeleton className="w-[160px] h-[200px] mx-auto rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="w-full h-3 rounded-lg" />
        <Skeleton className="w-4/5 h-3 rounded-lg" />
      </div>
    </CardBody>
    <CardFooter>
      <Skeleton className="w-24 h-8 rounded-lg" />
    </CardFooter>
  </Card>
);

const MovieCard = ({ movie, width }: { movie: Movie; width: number }) => {
  const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

  return (
    <Card
      className="h-[320px] hover:shadow-xl transition-shadow"
      style={{ width: `${width}px`, margin: "10px" }}
      data-testid="movie-card"
    >
      <CardHeader className="pb-2 h-[40px]">
        <h3 className="text-sm font-medium text-center w-full line-clamp-1">
          {movie.title}
        </h3>
      </CardHeader>
      {movie.poster_path && (
        <CardBody className="py-2 px-4 flex flex-col items-center">
          <div className="relative w-[160px] h-[200px] flex-shrink-0">
            <Image
              src={`${BASE_IMAGE_URL}${movie.poster_path}`}
              alt={movie.title}
              width={250}
              height={150}
              className="rounded-lg shadow-xl object-cover"
              style={{
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            />
          </div>
          <p className="text-sm line-clamp-2 mt-2 text-gray-600 h-[40px] overflow-hidden">
            {movie.overview}
          </p>
        </CardBody>
      )}
      <div>
        <Button color="primary" size="sm" className="w-full ">
          Learn More
        </Button>
      </div>
    </Card>
  );
};

const MovieList = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { columns, windowWidth } = useResponsiveGrid();

  const calculateCardWidth = () => {
    const containerWidth = Math.min(windowWidth - 40, 1200);
    const gap = 20;
    const totalGaps = columns - 1;
    return Math.floor((containerWidth - totalGaps * gap) / columns);
  };

  useEffect(() => {
    const fetchMovieList = async () => {
      setLoading(true);
      const options = {
        method: "GET",
        url: "https://api.themoviedb.org/3/collection/10?language=en-US",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZWU1N2JkOWUzNDIwMTQ2YmI5OWE2NDg3NDQ3NDk2MSIsIm5iZiI6MTczMDM0NjkxOS41NDUwMTYsInN1YiI6IjY3MjJmM2Y1ZmUyYThhMDExZWQ3MzY5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MJMy3uqGvlyTPAZSnqPgu4OhYk5RPOGsg1AZvAfnlEo",
        },
      };

      try {
        const response = await axios.request(options);
        const movies: Movie[] = response?.data?.parts || [];
        setMovieList(movies);
      } catch (err) {
        setError((err as Error).message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieList();
  }, []);

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  };

  const gridStyle = {
    display: "flex",
    flexWrap: "wrap" as const,
    justifyContent: "center",
    gap: "20px",
    margin: "0 auto",
  };

  const cardWidth = calculateCardWidth();

  return (
    <div style={containerStyle}>
      <h1 className="text-center p-4 mb-6 text-2xl font-semibold">
        Movie List
      </h1>

      {error && (
        <div className="text-center text-red-500 mb-4">Error: {error}</div>
      )}

      <div style={gridStyle}>
        {loading ? (
          Array.from({ length: columns * 2 }).map((_, index) => (
            <MovieCardSkeleton key={index} width={cardWidth} />
          ))
        ) : movieList.length > 0 ? (
          movieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} width={cardWidth} />
          ))
        ) : (
          <div className="text-center w-full">No movies found.</div>
        )}
      </div>
    </div>
  );
};

export default MovieList;
