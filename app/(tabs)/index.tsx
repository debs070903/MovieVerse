import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React from "react";
import useFetch from "@/services/usefetch";
import {
  fetchHighestRated,
  fetchMovies,
  fetchPopularReleases,
} from "@/services/api";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { router } from "expo-router";
import MovieCard from "@/components/MovieCard";
import HomeGenreRow from "@/components/HomeGenreRow";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Index = () => {
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  const {
    data: popularMovies,
    loading: popularLoading,
    error: popularError,
  } = useFetch(() => fetchPopularReleases());

  const {
    data: highestMovies,
    loading: highestLoading,
    error: highestError,
  } = useFetch(() => fetchHighestRated());

  const HOME_GENRES = [
    { id: 28, title: "High-Octane Action" },
    { id: 10749, title: "Love & Emotion" },
    { id: 18, title: "Powerful Drama" },
    { id: 878, title: "Futuristic Visions" },
  ];

  const insets = useSafeAreaInsets();

  const isLoading = moviesLoading || popularLoading || highestLoading;
  const isError = moviesError || popularError || highestError;

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: insets.bottom + 60 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : isError ? (
          <Text>Error in Fetching Movies</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for a movie"
            />

            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Latest Releases
            </Text>

            <FlatList
              data={movies}
              renderItem={({ item }) =>  <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 16,
                paddingRight: 20,
              }}
              className="mt-2 pb-10"
              snapToAlignment="start"
              decelerationRate="fast"
            />
            <Text className="text-lg text-white font-bold mb-3">
              Latest Popular Releases
            </Text>

            <FlatList
              data={popularMovies}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 16,
                paddingRight: 20,
              }}
              className="mt-2 pb-10"
              snapToAlignment="start"
              decelerationRate="fast"
            />

            <Text className="text-lg text-white font-bold mb-3">
              Highest Rated
            </Text>

            <FlatList
              data={highestMovies}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 16,
                paddingRight: 20,
              }}
              className="mt-2 pb-10"
              snapToAlignment="start"
              decelerationRate="fast"
            />

            {HOME_GENRES.map((genre) => (
              <HomeGenreRow
                key={genre.id}
                genreId={genre.id}
                title={genre.title}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
