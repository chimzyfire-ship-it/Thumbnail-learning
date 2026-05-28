"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Shield,
  Bell,
  ChevronRight,
  LogOut,
  Moon,
  Palette,
  Check,
  Languages,
  AlertCircle,
  LifeBuoy,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { t, langNames, type Lang } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

const settingsSections = [
  { id: "profile",       labelKey: "settings.profile",       icon: User },
  { id: "account",       labelKey: "settings.account",       icon: Shield },
  { id: "notifications", labelKey: "settings.notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const { lang } = useApp();

  const handleLogOut = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    sessionStorage.clear();
    localStorage.removeItem("tt_user_id");
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto w-full p-0 sm:p-2 pb-20">
      
      {/* Settings Sidebar */}
      <div className="w-full lg:w-72 lg:flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-6">{t("settings.title", lang)}</h1>
        <nav className="space-y-1">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                {t(section.labelKey, lang)}
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isActive ? "rotate-90" : ""}`} />
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-border/50">
            <a
              href="/support"
              className="mb-2 flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/50"
            >
              <LifeBuoy className="w-4 h-4" />
              Help & Support
            </a>
            <button
              onClick={handleLogOut}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all border border-transparent disabled:opacity-60"
            >
              <LogOut className="w-4 h-4" />
              {loggingOut ? "Signing out..." : t("settings.logOut", lang)}
            </button>
          </div>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeSection === "profile"       && <ProfileSection />}
        {activeSection === "account"       && <AccountSection />}
        {activeSection === "notifications" && <NotificationsSection />}
      </div>
    </div>
  );
}

// ─── PROFILE ───────────────────────────────────────────────────────

function ProfileSection() {
  const { lang, aiLevel, setAiLevel, avatar, setAvatar, name, setName, username: globalUsername } = useApp();
  const [fullName, setFullName] = useState(name);
  const [username, setUsername] = useState(globalUsername.startsWith("@") ? globalUsername : "");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const init = fullName ? fullName.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("error");
        setMessage("Please sign in again to edit your profile.");
        return;
      }

      const displayName = user.user_metadata?.display_name || user.user_metadata?.first_name || name || "User";
      setFullName(displayName);
      setName(displayName);
      setEmail(user.email || "");
      setUsername(user.user_metadata?.username || "");
      setBio(user.user_metadata?.bio || "");
      setStatus("idle");
    };

    loadProfile();
  }, [name, setName]);

  const handleSave = async () => {
    setStatus("saving");
    setMessage("");

    const trimmedName = fullName.trim() || "User";
    const cleanUsername = username.trim().replace(/^@/, "");
    const supabase = createClient();
    const firstName = trimmedName.split(" ")[0] || trimmedName;
    const lastName = trimmedName.split(" ").slice(1).join(" ");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("error");
      setMessage("Please sign in again to save your profile.");
      return;
    }

    const authPayload: Parameters<typeof supabase.auth.updateUser>[0] = {
      data: {
        display_name: trimmedName,
        first_name: firstName,
        last_name: lastName,
        username: cleanUsername,
        bio: bio.trim(),
      },
    };

    if (email.trim() && email.trim() !== user.email) {
      authPayload.email = email.trim();
    }

    const { error } = await supabase.auth.updateUser(authPayload);
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    await supabase.from("users").update({
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      username: cleanUsername,
      bio: bio.trim(),
    }).eq("id", user.id);

    setName(trimmedName);
    setStatus("success");
    setMessage(email.trim() !== user.email ? "Profile saved. Check your email to confirm the new address." : "Profile saved.");
    setTimeout(() => setStatus("idle"), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Max 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setAvatar(base64String);
    };
    reader.readAsDataURL(file);
  };

  const aiOptions = [
    { key: "Simple",   labelKey: "profile.simple",   descKey: "profile.simpleDesc" },
    { key: "Balanced", labelKey: "profile.balanced",  descKey: "profile.balancedDesc" },
    { key: "Advanced", labelKey: "profile.advanced",  descKey: "profile.advancedDesc" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">{t("profile.title", lang)}</h2>
        <p className="text-muted-foreground text-sm">{t("profile.desc", lang)}</p>
      </div>

      <Card className="bg-secondary/20 border-border/50">
        <CardContent className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="w-20 h-20 rounded-full bg-secondary border-2 border-primary/30 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary">{init}</span>
              )}
            </div>
            <div>
              <input type="file" accept="image/png, image/jpeg, image/gif" id="avatarUpload" className="hidden" onChange={handleImageUpload} />
              <Button variant="outline" size="sm" onClick={() => document.getElementById('avatarUpload')?.click()}>
                {t("profile.avatar", lang) || "Change Picture"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">{t("profile.avatarHint", lang) || "JPG, PNG or GIF. Max 2MB."}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t("profile.fullName", lang)}</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t("profile.username", lang)}</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">{t("profile.email", lang)}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">{t("profile.bio", lang)}</label>
              <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none" />
            </div>
          </div>

          {message && (
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${status === "error" ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-green-500/20 bg-green-500/10 text-green-300"}`}>
              {status === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              <span>{message}</span>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={status === "loading" || status === "saving"} className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8">
              {status === "saving" ? "Saving..." : status === "success" ? t("profile.saved", lang) : t("profile.save", lang)}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Preferences */}
      <Card className="bg-secondary/20 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <img src="/icon-brain.png" alt="" className="w-6 h-6 object-contain" /> {t("profile.aiTitle", lang)}
          </CardTitle>
          <CardDescription>{t("profile.aiDesc", lang)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiOptions.map((opt) => {
              const isSelected = aiLevel === opt.key;
              return (
                <button key={opt.key} onClick={() => setAiLevel(opt.key)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected ? "border-primary bg-primary/10 text-primary" : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/30"
                  }`}>
                  <p className="font-semibold text-sm">{t(opt.labelKey, lang)}</p>
                  <p className="text-xs mt-1 opacity-70">{t(opt.descKey, lang)}</p>
                  {isSelected && <Check className="w-4 h-4 text-primary mt-2" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── ACCOUNT & SECURITY ────────────────────────────────────────────

function AccountSection() {
  const { lang, setLang } = useApp();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [email, setEmail] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [pwMessage, setPwMessage] = useState("");
  const [accentColor, setAccentColor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "deleting" | "error">("idle");
  const [deleteMessage, setDeleteMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setEmail(user?.email || "");
    };

    loadUser();
  }, []);

  const handlePasswordUpdate = async () => {
    if (!currentPw || !newPw || !confirmPw || newPw !== confirmPw) {
      setPwStatus("error");
      setPwMessage("Fill in all password fields and make sure the new passwords match.");
      setTimeout(() => setPwStatus("idle"), 2500);
      return;
    }

    if (newPw.length < 8) {
      setPwStatus("error");
      setPwMessage("Your new password must be at least 8 characters.");
      setTimeout(() => setPwStatus("idle"), 2500);
      return;
    }

    setPwStatus("saving");
    setPwMessage("");

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPw,
    });

    if (verifyError) {
      setPwStatus("error");
      setPwMessage("Your current password is not correct.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      setPwStatus("error");
      setPwMessage(error.message);
      return;
    }

    setPwStatus("success");
    setPwMessage("Password updated.");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwStatus("idle"), 2500);
  };

  const handleDeleteAccount = async () => {
    setDeleteStatus("deleting");
    setDeleteMessage("");

    const response = await fetch("/api/account/delete", { method: "DELETE" });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setDeleteStatus("error");
      setDeleteMessage(result.error || "Could not delete account. Please try again.");
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem("tt_user_id");
    sessionStorage.clear();
    router.replace("/login");
    router.refresh();
  };

  const languages: Lang[] = ["en", "pcm", "yo", "ig"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">{t("settings.account", lang)}</h2>
        <p className="text-muted-foreground text-sm">{t("account.changePw", lang)}</p>
      </div>

      {/* Password Card */}
      <Card className="bg-secondary/20 border-border/50">
        <CardContent className="p-6 space-y-4">
          <label className="text-sm font-medium text-muted-foreground">{t("account.changePw", lang)}</label>
          <input type="password" placeholder={t("account.currentPw", lang)} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
          <input type="password" placeholder={t("account.newPw", lang)} value={newPw} onChange={(e) => setNewPw(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
          <input type="password" placeholder={t("account.confirmPw", lang)} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
          {pwStatus === "error" && <p className="text-xs text-red-400">{pwMessage || t("account.pwError", lang)}</p>}
          {pwStatus === "success" && <p className="text-xs text-green-400">{pwMessage || t("account.pwSuccess", lang)}</p>}
          <Button variant="outline" onClick={handlePasswordUpdate} disabled={pwStatus === "saving" || !email}>
            {pwStatus === "saving" ? "Updating..." : t("account.updatePw", lang)}
          </Button>
        </CardContent>
      </Card>

      {/* Preferences: Theme */}
      <Card className="bg-secondary/20 border-border/50">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold">{t("account.prefs", lang)}</h3>

          {/* Dark Mode (Locked) */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{t("account.darkMode", lang)}</p>
                <p className="text-xs text-muted-foreground">Dark mode is always on for the Aethel experience.</p>
              </div>
            </div>
            <div className="w-10 h-6 rounded-full bg-primary flex items-center px-1">
              <div className="w-4 h-4 rounded-full bg-white translate-x-4 shadow-sm" />
            </div>
          </div>

          {/* Accent Color */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{t("account.accentColor", lang)}</p>
                <p className="text-xs text-muted-foreground">{accentColor ? "Blue" : "Cyan (Default)"}</p>
              </div>
            </div>
            <button onClick={() => setAccentColor(!accentColor)}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${accentColor ? "bg-primary" : "bg-secondary border border-border"}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${accentColor ? "translate-x-4" : "translate-x-0"}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ─── BIG Language Selector ────────────────────────────── */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/20 border-primary/20">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Languages className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t("lang.title", lang)}</h3>
              <p className="text-xs text-muted-foreground">{t("lang.desc", lang)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {languages.map((l) => {
              const isActive = lang === l;
              return (
                <button key={l} onClick={() => setLang(l)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isActive
                      ? "border-primary bg-primary/15 text-primary ring-2 ring-primary/30"
                      : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:bg-secondary/50"
                  }`}>
                  <p className="font-bold text-base">{langNames[l]}</p>
                  {isActive && <Check className="w-4 h-4 text-primary mx-auto mt-2" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-500/5 border-red-500/20">
        <CardContent className="p-6">
          <h3 className="font-bold text-red-400 mb-2">{t("account.danger", lang)}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t("account.deleteDesc", lang)}</p>
          {!showDeleteConfirm ? (
            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => setShowDeleteConfirm(true)}>
              {t("account.delete", lang)}
            </Button>
          ) : (
            <div className="space-y-3">
              {deleteStatus === "error" && (
                <p className="text-xs text-red-300">{deleteMessage}</p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="outline" className="border-red-500/50 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                disabled={deleteStatus === "deleting"}
                onClick={handleDeleteAccount}>
                {deleteStatus === "deleting" ? "Deleting..." : t("account.confirmDelete", lang)}
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={deleteStatus === "deleting"}>
                {t("account.cancel", lang)}
              </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── NOTIFICATIONS ─────────────────────────────────────────────────

function NotificationsSection() {
  const { lang } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">{t("notif.title", lang)}</h2>
        <p className="text-muted-foreground text-sm">Email notifications are not turned on for MVP launch yet.</p>
      </div>

      <Card className="bg-secondary/20 border-border/50">
        <CardContent className="p-6">
          <div className="rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/5 p-5">
            <h3 className="font-bold text-white">Launch-safe notification setup</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              To keep the platform honest, we are not showing switches that do not send real notifications yet. Important account emails still come from Supabase, including password reset and email confirmation.
            </p>
            <a href="/support" className="mt-4 inline-flex text-sm font-bold text-[#c9a84c] hover:underline">
              Contact support if you need help
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
