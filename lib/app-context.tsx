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

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("tt_theme") as Theme | null;
    const savedLang = localStorage.getItem("tt_lang") as Lang | null;
    const savedAi = localStorage.getItem("tt_ai");
    
    const uid = localStorage.getItem("tt_user_id") || "guest";
    setUsernameState(uid);
    const savedAvatar = localStorage.getItem(`tt_avatar_${uid}`);
    const savedName = localStorage.getItem(`tt_name_${uid}`);

    if (savedTheme) setThemeState(savedTheme);
    if (savedLang) setLangState(savedLang);
    if (savedAi) setAiLevel(savedAi);
    if (savedAvatar) setAvatarState(savedAvatar);
    if (savedName) setNameState(savedName);

    const pullLiveName = async () => {
      if (uid !== "guest") {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.user_metadata?.first_name) {
             setNameState(user.user_metadata.first_name);
             localStorage.setItem(`tt_name_${uid}`, user.user_metadata.first_name);
          }
        } catch {}
      }
    };
    pullLiveName();
    
    setMounted(true);
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
    }
    localStorage.setItem("tt_theme", theme);
  }, [theme, mounted]);

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
