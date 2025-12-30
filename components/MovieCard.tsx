import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";
import { isSavedMovie, saveMovie, unsaveMovie } from "@/services/save";
import { supabase } from "@/lib/supabase";
import { savedEvents } from "@/lib/savedEvents";

const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "https://placehold.co/600x900/1a1a1a/FFFFFF.png";

interface MovieCardProps {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average?: number;
  release_date?: string;
}

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: MovieCardProps) => {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const loggedIn = !!data.session;
      setIsAuthenticated(loggedIn);

      if (loggedIn) {
        isSavedMovie(id).then(setSaved);
      }
    });
  }, [id]);

  const toggleSave = async () => {
    if (saving) return;

    setSaving(true);
    try {
      if (saved) {
        await unsaveMovie(id);
        savedEvents.emit();
        setSaved(false);
      } else {
        await saveMovie({
          id,
          title,
          poster_path: poster_path ?? null,
        });
        savedEvents.emit();
        setSaved(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="flex-1 max-w-36">
        <View className="relative">
          <Image
            source={{
              uri: poster_path
                ? `${POSTER_BASE}${poster_path}`
                : FALLBACK_POSTER,
            }}
            className="w-full aspect-[2/3] rounded-lg"
            resizeMode="cover"
          />

          {isAuthenticated && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleSave();
              }}
              disabled={saving}
              className="absolute top-2 right-2 bg-black/60 p-2 rounded-full"
            >
              <Image
                source={saved ? icons.saved : icons.notsaved}
                className="w-4 h-4"
              />
            </Pressable>
          )}
        </View>

        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>

        {typeof vote_average === "number" && (
          <View className="flex-row items-center gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-xs text-white font-bold">
              {Math.round(vote_average / 2)}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          {release_date && (
            <Text className="text-xs text-light-300 font-medium mt-1">
              {release_date?.split("-")[0]}
            </Text>
          )}
          <Text className="text-xs font-medium text-light-300 uppercase">
            movie
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
