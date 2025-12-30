import { View, Text, ActivityIndicator, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("../auth");
        return;
      }

      const user = data.session.user;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name ?? "User",
        });

        setName(user.user_metadata?.full_name ?? "User");
      } else {
        setName(profile?.full_name ?? "User");
      }

      setLoading(false);
    });
  }, []);

  const greeting = "Welcome Back!";
  const introduction =
    "MovieVerse is a sleek and intuitive movie discovery app powered by The Movie Database (TMDB). It lets users explore trending and popular movies, dive into detailed information like ratings, genres, and summaries, and save interesting titles to their personal watchlist. Presenting an all in one seamless experience. 🎬✨";

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary px-6 pb-28">
      <View className="items-center mt-14">
        <View className="w-40 h-40 rounded-full bg-light-100 items-center justify-center mb-6">
          <Text className="text-dark-100 text-8xl font-bold">
            {name?.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      <View className="items-center mt-6 gap-9 px-4">
        <Text className="text-light-100 text-2xl font-semibold">
          {greeting}
        </Text>

        <Text className="text-white text-5xl font-bold">{name}</Text>

        <Text className="text-light-100 text-base text-center italic">
          {introduction}
        </Text>
      </View>
      <View className="mt-auto">
        <Pressable
          onPress={async () => {
            await supabase.auth.signOut();
            router.replace("../auth");
          }}
          className="bg-light-100 py-3 rounded-lg items-center mb-6"
        >
          <Text className="text-dark-100 font-semibold text-base">Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
