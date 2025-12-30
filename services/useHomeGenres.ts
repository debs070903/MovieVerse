import { View, Text } from "react-native";
import React from "react";
import useFetch from "./usefetch";
import { fetchMoviesByGenres } from "./api";

const useHomeGenres = (genreId: number) => {
  const { data, loading, error } = useFetch(() =>
    fetchMoviesByGenres({
      genreIds: [genreId],
      mode: "AND",
    })
  );
  return {
    movies: data,
    loading,
    error,
  };
};

export default useHomeGenres;
