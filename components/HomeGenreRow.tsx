import { View, Text, FlatList, ActivityIndicator } from "react-native";
import MovieCard from "@/components/MovieCard";
import useHomeGenres from "@/services/useHomeGenres";

type Props = {
  genreId: number;
  title: string;
};

const HomeGenreRow = ({ genreId, title }: Props) => {
  const { movies, loading, error } = useHomeGenres(genreId);

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color="#0000ff"
        className="mt-6"
      />
    );
  }

  if (error || !movies?.length) return null;

  return (
    <View className="mb-6">
      <Text className="text-lg text-white font-bold mb-3">
        Popular in {title}
      </Text>

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingRight: 20 }}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

export default HomeGenreRow;
