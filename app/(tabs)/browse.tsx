import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useFetch from "@/services/usefetch";
import { fetchBrowseMovies, fetchGenres } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { MOVIE_GENRES } from "@/constants/genres";

const Browse = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined
  );
  const [selectedYear, setSelectedYear] = useState<string | undefined>(
    undefined
  );
  const [selectedRating, setSelectedRating] = useState<string | undefined>(
    undefined
  );
  const {
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(
    () =>
      fetchBrowseMovies({
        genre: selectedGenre,
        year: selectedYear,
        rating: selectedRating,
      }),
    false
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      await loadMovies();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [selectedGenre, selectedYear, selectedRating]);

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 px-5 pt-5 bg-primary">
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ gap: 16, marginBottom: 16 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingTop: insets.top,
        }}
        ListHeaderComponent={
          <>
            <View className="flex-row gap-x-2 items-center h-10">
              <View className="bg-light-100 rounded flex-1 max-h-full justify-center">
                <Picker
                  selectedValue={selectedGenre ?? "All"}
                  onValueChange={(value) =>
                    value === "All"
                      ? setSelectedGenre(undefined)
                      : setSelectedGenre(value)
                  }
                >
                  {MOVIE_GENRES.map((g) => (
                    <Picker.Item
                      key={g.label}
                      label={g.label}
                      value={g.id ?? "All"}
                    />
                  ))}
                </Picker>
              </View>

              <TextInput
                placeholder="Year"
                keyboardType="numeric"
                maxLength={4}
                value={selectedYear}
                onChangeText={(val) =>
                  val ? setSelectedYear(val) : setSelectedYear(undefined)
                }
                className="bg-light-100 px-3 py-2 rounded w-20"
              />

              <TextInput
                placeholder="Rating"
                keyboardType="numeric"
                maxLength={3}
                value={selectedRating}
                onChangeText={(val) =>
                  val ? setSelectedRating(val) : setSelectedRating(undefined)
                }
                className="bg-light-100 px-3 py-2 rounded w-28"
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                setSelectedGenre(undefined);
                setSelectedYear(undefined);
                setSelectedRating(undefined);
              }}
              className="mt-3 self-end"
            >
              <Text className="text-light-200 mb-5">Clear Filters</Text>
            </TouchableOpacity>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="mt-10" />
          ) : (
            <Text className="text-light-200 text-center mt-10">
              No movies found
            </Text>
          )
        }
        renderItem={({ item }) => <MovieCard {...item} />}
      />
      
    </View>
  );
};

export default Browse;
