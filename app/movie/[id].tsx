import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/services/usefetch";
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchWatchProviders,
} from "@/services/api";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import * as Localization from "expo-localization";
import { isSavedMovie, saveMovie, unsaveMovie } from "@/services/save";
import { supabase } from "@/lib/supabase";
import { savedEvents } from "@/lib/savedEvents";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const { data: credits } = useFetch(() => fetchMovieCredits(id as string));

  const { data: providers } = useFetch(() => fetchWatchProviders(id as string));

  const cast = credits?.cast?.slice(0, 10);
  const crew = credits?.crew || [];

  const getCrewByJob = (jobs: string[]) =>
    crew?.filter((c: any) => jobs.includes(c.job))?.slice(0, 6);

  const CrewSection = ({ title, people }: { title: string; people: any[] }) => {
    if (!people?.length) return null;

    return (
      <View className="mt-6">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {people.map((person) => (
            <View key={person.id} className="mr-4 items-center w-[80px]">
              <Image
                source={{
                  uri: person.profile_path
                    ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                    : "https://via.placeholder.com/80x120",
                }}
                className="w-[80px] h-[120px] rounded-lg"
              />
              <Text
                className="text-light-100 text-xs text-center mt-1"
                numberOfLines={2}
              >
                {person.name}
              </Text>
              <Text className="text-light-200 text-[10px] text-center">
                {person.job}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const insets = useSafeAreaInsets();
  const region = Localization.getLocales()[0]?.regionCode || "IN";
  const streaming = providers?.results?.[region]?.flatrate;

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });
  }, []);

  useEffect(() => {
    if (!movie?.id || !isAuthenticated) return;

    let isMounted = true;

    isSavedMovie(movie.id).then((result) => {
      if (isMounted) {
        setSaved(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [movie?.id, isAuthenticated]);

  const toggleSave = async () => {
    if (!movie?.id || !isAuthenticated) return;
    setSaving(true);

    try {
      if (saved) {
        await unsaveMovie(movie.id);
        savedEvents.emit();
        setSaved(false);
      } else {
        await saveMovie({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ?? null,
        });
        savedEvents.emit();
        setSaved(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="bg-primary flex-1">
      {loading ? (
        <SafeAreaView className="bg-primary flex-1">
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        </SafeAreaView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: "100%",
            paddingBottom: insets.bottom + 80,
          }}
        >
          <View className="relative">
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
              }}
              className="w-full h-[550px]"
              resizeMode="stretch"
            />
            {isAuthenticated && (
              <Pressable
                onPress={toggleSave}
                disabled={saving}
                className="absolute top-5 right-5"
              >
                <Image
                  source={saved ? icons.saved : icons.notsaved}
                  className="w-5 h-5"
                />
              </Pressable>
            )}
          </View>
          <View className="flex-col items-start justify-center mt-5 px-5">
            <Text className="text-white font-bold text-xl">{movie?.title}</Text>
            <View className="flex-row items-center gap-x-1 mt-2">
              <Text className="text-light-200 text-sm">
                {movie?.release_date?.split("-")[0]}
              </Text>
              <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
            </View>

            <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
              <Image source={icons.star} className="size-4" />
              <Text className="text-white font-bold text-sm">
                {Math.round(movie?.vote_average ?? 0)}/10
              </Text>
              <Text className="text-light-200 text-sm">
                ({movie?.vote_count} votes)
              </Text>
            </View>

            <MovieInfo label="Overview" value={movie?.overview} />

            <MovieInfo label="Original Title" value={movie?.original_title} />

            <MovieInfo
              label="Genres"
              value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
            />

            <View className="flex flex-row justify-between w-full">
              <MovieInfo
                label="Budget"
                value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
              />
              <MovieInfo
                label="Revenue"
                value={`$${Math.round(
                  (movie?.revenue ?? 0) / 1_000_000
                )} million`}
              />
              <MovieInfo
                label="Original Language"
                value={movie?.original_language}
              />
            </View>

            <MovieInfo
              label="Production Companies"
              value={
                movie?.production_companies?.map((c) => c.name).join(" • ") ||
                "N/A"
              }
            />
          </View>
          <View className="mt-5 px-5 justify-center items-start flex-col">
            <Text className="text-white font-bold text-lg mb-3">Cast</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cast?.map((actor: any) => (
                <View key={actor.id} className="mr-4 items-center w-[80px]">
                  <Image
                    source={{
                      uri: actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "https://via.placeholder.com/80x120",
                    }}
                    className="w-[80px] h-[120px] rounded-lg"
                  />
                  <Text
                    className="text-light-100 text-xs text-center mt-1"
                    numberOfLines={2}
                  >
                    {actor.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View className="mt-5 px-5 justify-center items-start flex-col">
            <Text className="text-white font-bold text-lg mb-3">Crew</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <CrewSection
                title="Director"
                people={getCrewByJob(["Director"])}
              />

              <CrewSection
                title="Writers"
                people={getCrewByJob(["Writer", "Screenplay"])}
              />

              <CrewSection
                title="Music"
                people={getCrewByJob(["Original Music Composer"])}
              />

              <CrewSection
                title="Cinematography"
                people={getCrewByJob(["Director of Photography"])}
              />
            </ScrollView>
          </View>

          <View className="mt-5 px-5">
            <Text className="text-white font-bold text-lg mb-3">
              Where to Watch
            </Text>

            {streaming?.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {streaming.map((p: any) => (
                  <View key={p.provider_id} className="mr-4 items-center">
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w92${p.logo_path}`,
                      }}
                      className="w-12 h-12 rounded-lg"
                    />
                    <Text className="text-light-200 text-xs mt-1">
                      {p.provider_name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text className="text-light-200 text-sm">
                Not available in your region
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Details;
