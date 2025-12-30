import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import useFetch from "@/services/usefetch";
import { fetchMovies } from "@/services/api";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const insets = useSafeAreaInsets();
  const safeMovies = movies ?? [];

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%",
          paddingBottom: insets.bottom + 60,
        }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search for a movie"
        />

        {loading && (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
        )}

        {error && (
          <Text className="text-center text-red-400 mt-10">
            Failed to fetch movies
          </Text>
        )}

        {!loading && !error && !safeMovies.length && searchQuery.trim() && (
          <Text className="text-center text-light-300 mt-10">
            No results found
          </Text>
        )}

        {!loading && !error && !safeMovies.length && !searchQuery.trim() && (
          <Text className="text-center text-light-300 mt-10">
            Start typing to search movies
          </Text>
        )}

        {!!safeMovies.length && (
          <FlatList
            data={safeMovies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              gap: 16,
              marginBottom: 16,
            }}
            className="mt-6"
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Search;
