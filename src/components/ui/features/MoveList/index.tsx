'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Card,   CardHeader, CardBody, CardFooter, Button, Skeleton } from "@nextui-org/react";
import Image from 'next/image';

// Define TypeScript type for each movie
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

const MovieListComponent = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
  useEffect(() => {
    const fetchMovieList = async () => {
        setLoading(true);
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/collection/10?language=en-US',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZWU1N2JkOWUzNDIwMTQ2YmI5OWE2NDg3NDQ3NDk2MSIsIm5iZiI6MTczMDM0NjkxOS41NDUwMTYsInN1YiI6IjY3MjJmM2Y1ZmUyYThhMDExZWQ3MzY5MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MJMy3uqGvlyTPAZSnqPgu4OhYk5RPOGsg1AZvAfnlEo'
        }
      };

      try {
        const response = await axios.request(options);
        const movies: Movie[] = response?.data?.parts || [];
        setMovieList(movies);
      } catch (err) {
        setError((err as Error).message);
        console.error(err);
      }finally {
        setLoading(false)
      }
    };

    fetchMovieList();
  }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Skeleton />
//       </div>
//     );
//   }
  return (
    <div className="container mx-auto px-5">
      <h1 className='flex justify-center p-4 mb-6 text-2xl font-semibold'>Movie List</h1>
      <div className='flex justify-center text-center items-center gap-3'>
        {error && <p>Error: {error}</p>}
        {loading ? (
            // Display skeletons when loading
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="flex flex-col justify-center items-center gap-2 p-5 border border-gray-200 rounded-lg shadow-lg">
                <Skeleton height={24} width="60%" />
                <Skeleton height={300} width={200} className="rounded-lg shadow-lg" />
                <Skeleton height={16} width="80%" />
                <Skeleton height={16} width="90%" />
                <Skeleton height={16} width="70%" />
              </Card>
            ))
          ) : Array.isArray(movieList) && movieList.length > 0 ? (
       <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 max-w-[900px]">
          {movieList.map((movie) => (
            <Card key={movie.id} className="col-span-12 sm:col-span-4 h-[300px]">
              <CardHeader className="pb-4">
                <div className="text-sm font-medium text-center">
                  {movie.title}
                </div>
              </CardHeader>
                {movie.poster_path && (
                  <CardBody className="flex justify-center items-center py-4 px-5">
                    <Image
                      src={`${BASE_IMAGE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      width={200}
                      height={200}
                      className='rounded-lg shadow-lg'
                    />
                  </CardBody>
                )}
                <CardBody>
                  <p className='text-sm'>{movie.overview}</p>
                </CardBody>
                <CardFooter className='flex justify-start'>
                  <Button color="primary">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieListComponent;
