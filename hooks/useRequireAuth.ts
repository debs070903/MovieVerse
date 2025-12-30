import { supabase } from "@/lib/supabase";

export const useRequireAuth = () => {
  return async (onAuthed: () => void, onUnauthed: () => void) => {
    const { data } = await supabase.auth.getSession();
    data.session ? onAuthed() : onUnauthed();
  };
};
