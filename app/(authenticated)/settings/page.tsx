"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Palette,
  Globe,
  BrainCircuit,
  Crown,
  Check,
  Languages,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { t, langNames, type Lang } from "@/lib/i18n";

const settingsSections = [
  { id: "profile",       labelKey: "settings.profile",       icon: User },
  { id: "account",       labelKey: "settings.account",       icon: Shield },
  { id: "notifications", labelKey: "settings.notifications", icon: Bell },
  { id: "subscription",  labelKey: "settings.billing",       icon: CreditCard },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const router = useRouter();
  const { lang } = useApp();

  const handleLogOut = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full p-2 pb-20">
      
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
            <button
              onClick={handleLogOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all border border-transparent"
            >
              <LogOut className="w-4 h-4" />
              {t("settings.logOut", lang)}
            </button>
          </div>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeSection === "profile"       && <ProfileSection />}
        {activeSection === "account"       && <AccountSection />}
        {activeSection === "notifications" && <NotificationsSection />}
        {activeSection === "subscription"  && <SubscriptionSection />}
      </div>
    </div>
  );
}

// ─── PROFILE ───────────────────────────────────────────────────────

function ProfileSection() {
  const { lang, aiLevel, setAiLevel, avatar, setAvatar, name, setName, username: globalUsername } = useApp();
  const [username, setUsername] = useState(globalUsername.startsWith("@") ? globalUsername : "@" + globalUsername);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("Learning AI skills to build the future.");
  const [saved, setSaved] = useState(false);

  const init = name ? name.charAt(0).toUpperCase() : "U";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-secondary border-2 border-primary/30 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
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
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
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

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-8">
              {saved ? t("profile.saved", lang) : t("profile.save", lang)}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Preferences */}
      <Card className="bg-secondary/20 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" /> {t("profile.aiTitle", lang)}
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
  const { theme, setTheme, lang, setLang } = useApp();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "success" | "error">("idle");
  const [accentColor, setAccentColor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handlePasswordUpdate = () => {
    if (!currentPw || !newPw || !confirmPw || newPw !== confirmPw) {
      setPwStatus("error");
      setTimeout(() => setPwStatus("idle"), 2500);
      return;
    }
    setPwStatus("success");
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwStatus("idle"), 2500);
  };

  const isDark = theme === "dark";
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
          {pwStatus === "error" && <p className="text-xs text-red-400">{t("account.pwError", lang)}</p>}
          {pwStatus === "success" && <p className="text-xs text-green-400">{t("account.pwSuccess", lang)}</p>}
          <Button variant="outline" onClick={handlePasswordUpdate}>{t("account.updatePw", lang)}</Button>
        </CardContent>
      </Card>

      {/* Preferences: Theme */}
      <Card className="bg-secondary/20 border-border/50">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold">{t("account.prefs", lang)}</h3>

          {/* Dark / Light Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <div>
                <p className="text-sm font-medium">{t("account.darkMode", lang)}</p>
                <p className="text-xs text-muted-foreground">{t("account.darkDesc", lang)}</p>
              </div>
            </div>
            <button onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${isDark ? "bg-primary" : "bg-secondary border border-border"}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${isDark ? "translate-x-4" : "translate-x-0"}`} />
            </button>
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
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-red-500/50 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                onClick={() => { setShowDeleteConfirm(false); router.push("/login"); }}>
                {t("account.confirmDelete", lang)}
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                {t("account.cancel", lang)}
              </Button>
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

  const notifKeys = [
    { labelKey: "notif.courseUpdates",        descKey: "notif.courseUpdatesDesc",        defaultOn: true  },
    { labelKey: "notif.learningReminders",    descKey: "notif.learningRemindersDesc",    defaultOn: true  },
    { labelKey: "notif.communityActivity",    descKey: "notif.communityActivityDesc",    defaultOn: false },
    { labelKey: "notif.achievementUnlocked",  descKey: "notif.achievementUnlockedDesc",  defaultOn: true  },
    { labelKey: "notif.productUpdates",       descKey: "notif.productUpdatesDesc",       defaultOn: false },
    { labelKey: "notif.emailDigest",          descKey: "notif.emailDigestDesc",          defaultOn: true  },
  ];

  const [enabled, setEnabled] = useState(notifKeys.map((n) => n.defaultOn));

  const toggle = (i: number) => setEnabled((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">{t("notif.title", lang)}</h2>
        <p className="text-muted-foreground text-sm">{t("notif.desc", lang)}</p>
      </div>

      <Card className="bg-secondary/20 border-border/50">
        <CardContent className="p-6 space-y-4">
          {notifKeys.map((notif, i) => (
            <div key={notif.labelKey} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30">
              <div>
                <p className="text-sm font-medium">{t(notif.labelKey, lang)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t(notif.descKey, lang)}</p>
              </div>
              <button onClick={() => toggle(i)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${enabled[i] ? "bg-primary" : "bg-secondary border border-border"}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${enabled[i] ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── SUBSCRIPTION ──────────────────────────────────────────────────

function SubscriptionSection() {
  const { lang } = useApp();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = () => { setUpgrading(true); setTimeout(() => setUpgrading(false), 2000); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">{t("billing.title", lang)}</h2>
        <p className="text-muted-foreground text-sm">{t("billing.desc", lang)}</p>
      </div>

      <Card className="bg-secondary/20 border-primary/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">{t("billing.freePlan", lang)}</h3>
              <p className="text-xs text-muted-foreground">{t("billing.freeDesc", lang)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Progress value={60} className="h-2 flex-1 [&>div]:bg-cyan-400" />
            <span className="text-sm font-bold">3/5 {t("billing.used", lang)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-secondary/30 border-border/50 hover:border-primary/30 transition-colors">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold">Pro Plan</h3>
            <div className="text-3xl font-black text-primary">$9.99<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> All Tier 1 & 2 Courses</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> AI-Powered Feedback</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority Support</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Certificates</li>
            </ul>
            <Button onClick={handleUpgrade} disabled={upgrading}
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold">
              {upgrading ? t("billing.processing", lang) : t("billing.upgrade", lang)}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-primary/10 to-secondary/30 border-primary/30 relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">Coming Soon</div>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold">Enterprise</h3>
            <div className="text-3xl font-black">Custom<span className="text-sm font-normal text-muted-foreground">/team</span></div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> All Tiers (1, 2, 3)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Team Management</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Custom AI Training</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Account Manager</li>
            </ul>
            <Button variant="outline" className="w-full" disabled>Contact Sales</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
