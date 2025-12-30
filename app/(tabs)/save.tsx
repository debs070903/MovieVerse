import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { getSavedMovies } from "@/services/save";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import MovieCard from "@/components/MovieCard";
import { savedEvents } from "@/lib/savedEvents";

const Save = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let active = true;
  
    const load = async () => {
      const data = await getSavedMovies();
      if (active) setMovies(data);
    };
  
    load();
  
    const unsuscribe = savedEvents.subscribe(load);
  
    return () => {
      active = false;
      unsuscribe();
    };
  }, []);

  if (movies.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center">
        <Text className="text-light-300">No saved movies yet</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 80,
          paddingTop: 16,
        }}
        columnWrapperStyle={{
          gap: 16,
          marginBottom: 16,
        }}
        renderItem={({ item }) => (
          <MovieCard
            id={item.movie_id}
            title={item.title}
            poster_path={item.poster_path}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Save;
