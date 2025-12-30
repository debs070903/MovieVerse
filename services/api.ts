export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
  },
};

export const fetchMovies = async ({
  query,
  limit = 10,
}: {
  query: string;
  limit?: number;
}): Promise<Movie[]> => {
  const today = new Date().toISOString().split("T")[0];

  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=release_date.desc&primary_release_date.lte=${today}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  const results = query ? data.results : data.results.slice(0, 10);

  return results;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchPopularReleases = async (limit = 10): Promise<Movie[]> => {
  const today = new Date().toISOString().split("T")[0];

  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&primary_release_date.lte=${today}`,
    { headers: TMDB_CONFIG.headers }
  );

  const data = await response.json();
  return data.results.slice(0, limit);
};

export const fetchHighestRated = async (limit = 10): Promise<Movie[]> => {
  const today = new Date().toISOString().split("T")[0];

  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=vote_average.desc&vote_average.gte=7.5&vote_count.gte=1000&primary_release_date.lte=${today}&with_poster_path=true`,
    { headers: TMDB_CONFIG.headers }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hidden gems");
  }

  const data = await response.json();
  return data.results.slice(0, limit);
};

type GenreMode = "AND" | "OR";

export const fetchMoviesByGenres = async ({
  genreIds,
  mode = "AND",
  page = 1,
}: {
  genreIds: number[];
  mode?: GenreMode;
  page?: number;
}): Promise<Movie[]> => {
  if (!genreIds.length) {
    throw new Error("At least one genreId is required");
  }

  const genreQuery = mode === "AND" ? genreIds.join(",") : genreIds.join("|");
  const today = new Date().toISOString().split("T")[0];

  const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreQuery}&sort_by=popularity.desc&primary_release_date.lte=${today}&page=${page}`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies by genres");
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieCredits = async (movieId: string) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_CONFIG.API_KEY}`,
    { headers: TMDB_CONFIG.headers }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch credits");
  }

  return response.json();
};

export const fetchWatchProviders = async (movieId: string) => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_CONFIG.API_KEY}`,
    { headers: TMDB_CONFIG.headers }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch watch providers");
  }

  return response.json();
};

export const fetchGenres = async () => {
  const res = await fetch(
    `${TMDB_CONFIG.BASE_URL}/genre/movie/list?api_key=${TMDB_CONFIG.API_KEY}`
  );
  console.log("GENRES:", res);
  return res.json();
};

interface DiscoverMoviesParams {
  genre?: string;
  year?: string;
  rating?: string;
}

export const fetchBrowseMovies = async ({
  genre,
  year,
  rating,
}: DiscoverMoviesParams): Promise<Movie[]> => {
  const params = new URLSearchParams();

  params.append("api_key", TMDB_CONFIG.API_KEY!);
  params.append("sort_by", "popularity.desc");
  params.append("include_adult", "false");
  params.append("include_video", "false");

  if (genre) params.append("with_genres", genre);
  if (year) params.append("primary_release_year", year);
  if (rating) params.append("vote_average.gte", rating);

  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/discover/movie?${params.toString()}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch browse movies");
  }

  const data = await response.json();
  return data.results;
};
