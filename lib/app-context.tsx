"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

type Theme = "dark" | "light";

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  aiLevel: string;
  setAiLevel: (l: string) => void;
  avatar: string | null;
  setAvatar: (a: string | null) => void;
  name: string;
  setName: (n: string) => void;
  username: string;
}

const AppContext = createContext<AppContextType>({
  theme: "dark",
  setTheme: () => {},
  lang: "en",
  setLang: () => {},
  aiLevel: "Balanced",
  setAiLevel: () => {},
  avatar: null,
  setAvatar: () => {},
  name: "User",
  setName: () => {},
  username: "guest",
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [lang, setLangState] = useState<Lang>("en");
  const [aiLevel, setAiLevel] = useState("Balanced");
  const [avatarState, setAvatarState] = useState<string | null>(null);
  const [nameState, setNameState] = useState<string>("User");
  const [usernameState, setUsernameState] = useState<string>("guest");
  const [mounted, setMounted] = useState(false);

  // Load saved preferences AND derive identity from the live Supabase session
  useEffect(() => {
    const savedLang = localStorage.getItem("tt_lang") as Lang | null;
    const savedAi = localStorage.getItem("tt_ai");
    if (savedLang) setLangState(savedLang);
    if (savedAi) setAiLevel(savedAi);

    // Derive identity from the active Supabase session, not localStorage
    const hydrateUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const uid = user.id;
          setUsernameState(uid);
          localStorage.setItem("tt_user_id", uid);

          // Priority: user_metadata (set at signup) > cached localStorage > fallback
          const firstName = user.user_metadata?.first_name;
          const cached = localStorage.getItem(`tt_name_${uid}`);
          const displayName = firstName || cached || "User";

          setNameState(displayName);
          localStorage.setItem(`tt_name_${uid}`, displayName);

          // Avatar
          const savedAvatar = localStorage.getItem(`tt_avatar_${uid}`);
          if (savedAvatar) setAvatarState(savedAvatar);
        } else {
          // No session — fall back to guest
          setUsernameState("guest");
          setNameState("User");
        }
      } catch {
        // Auth check failed, stay as guest
      }
    };

    hydrateUser();
    setMounted(true);
  }, []);

  // Re-hydrate when the auth state changes (login, logout, token refresh)
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const uid = session.user.id;
        setUsernameState(uid);
        localStorage.setItem("tt_user_id", uid);

        const firstName = session.user.user_metadata?.first_name;
        const cached = localStorage.getItem(`tt_name_${uid}`);
        const displayName = firstName || cached || "User";

        setNameState(displayName);
        localStorage.setItem(`tt_name_${uid}`, displayName);
      } else {
        setUsernameState("guest");
        setNameState("User");
        setAvatarState(null);
        localStorage.removeItem("tt_user_id");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Always enforce dark mode — Aethel is a dark-only brand
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    html.classList.add("dark");
    html.classList.remove("light");
  }, [mounted]);

  // Persist language
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("tt_lang", lang);
  }, [lang, mounted]);

  // Persist AI level
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("tt_ai", aiLevel);
  }, [aiLevel, mounted]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setLang = (l: Lang) => setLangState(l);

  const setAvatar = (a: string | null) => {
    setAvatarState(a);
    if (a) localStorage.setItem(`tt_avatar_${usernameState}`, a);
    else localStorage.removeItem(`tt_avatar_${usernameState}`);
  };

  const setName = (n: string) => {
    setNameState(n);
    localStorage.setItem(`tt_name_${usernameState}`, n);
  };

  return (
    <AppContext.Provider value={{ 
      theme, setTheme, lang, setLang, aiLevel, setAiLevel,
      avatar: avatarState, setAvatar, name: nameState, setName, username: usernameState
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
