import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { signIn, signUp } from "@/services/auth";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "signin" | "signup";

const AuthScreen = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { redirect } = useLocalSearchParams<{ redirect?: string }>();

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUp(fullName.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }

      if (redirect === "save") {
        router.replace("../(tabs)/save");
      } else {
        router.replace("../(tabs)/profile");
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-primary px-10 justify-center">
        <View className="flex-row items-center justify-between">
        <Text className="text-white text-3xl font-bold mb-2">
          {mode === "signin" ? "Welcome Back" : "Join Us"}
        </Text>
        <Pressable
          onPress={() => router.replace("../(tabs)")}
        >
          <Text className="text-white text-base">← Back</Text>
        </Pressable>
        </View>

        <Text className="text-light-300 mb-8">
          {mode === "signin"
            ? "Sign in to continue"
            : "Sign up to save movies and personalize"}
        </Text>

        {mode === "signup" && (
          <TextInput
            placeholder="Full name"
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={setFullName}
            className="bg-dark-200 text-white px-4 py-3 rounded-lg mb-4"
          />
        )}

        <TextInput
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          className="bg-dark-200 text-white px-4 py-3 rounded-lg mb-4"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="bg-dark-200 text-white px-4 py-3 rounded-lg mb-4"
        />

        {error && <Text className="text-red-400 mb-3 text-sm">{error}</Text>}

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className="bg-secondary py-3 rounded-lg items-center mt-4"
        >
          {loading ? (
            <ActivityIndicator color="#0000ff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              {mode === "signin" ? "Log In" : "Sign Up"}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6"
        >
          <Text className="text-light-100 text-center">
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </Text>
        </Pressable>
      </SafeAreaView>
    </>
  );
};

export default AuthScreen;
