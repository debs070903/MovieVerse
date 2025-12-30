import { supabase } from "@/lib/supabase";

export const signUp = async (
  fullName: string,
  email: string,
  password: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (!data.user) {
    throw new Error("User not created");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      full_name: fullName,
    });

  if (profileError) {
    console.error("PROFILE INSERT ERROR:", profileError);
    throw profileError;
  }

  return data;
};


export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
