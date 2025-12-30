import { supabase } from "@/lib/supabase";

export const saveMovie = async (movie: {
  id: number;
  title: string;
  poster_path: string | null;
}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Not aunthenticated");

  const { error } = await supabase.from("saved_movies").insert({
    user_id: session.user.id,
    movie_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
  });

  if (error) throw error;
};

export const unsaveMovie = async (movieId: number) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Not aunthenticated");

  const { error } = await supabase
    .from("saved_movies")
    .delete()
    .eq("user_id", session.user.id)
    .eq("movie_id", movieId);

  if (error) throw error;
};

export const getSavedMovies = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Not aunthenticated");

  const { data, error } = await supabase
    .from("saved_movies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const isSavedMovie = async (movieId: number) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Not aunthenticated");

  const { data, error } = await supabase
    .from("saved_movies")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("movie_id", movieId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};
