// Translation dictionary for Thumbnail Learning
// Supports: English (en), Pidgin (pcm), Yoruba (yo), Igbo (ig)

export type Lang = "en" | "pcm" | "yo" | "ig";

export const langNames: Record<Lang, string> = {
  en: "English",
  pcm: "Pidgin",
  yo: "Yorùbá",
  ig: "Igbo",
};

const translations: Record<string, Record<Lang, string>> = {
  // ─── Navigation ──────────────────────────────────
  "nav.home":        { en: "Home",       pcm: "Home",       yo: "Ilé",        ig: "Ụlọ"        },
  "nav.courses":     { en: "Courses",    pcm: "Courses",    yo: "Àwọn Ẹ̀kọ́",        ig: "Ọmụmụ Ihe"  },
  "nav.learning":    { en: "My Learning",   pcm: "My Learning",    yo: "Ẹ̀kọ́ Mi",       ig: "Ọmụmụ Ihe m"      },
  "nav.studySpace":  { en: "Study Space", pcm: "Study Space",      yo: "Aaye Kika",        ig: "Ebe Ọmụmụ"         },
  "nav.community":   { en: "Community",  pcm: "Community",  yo: "Àwùjọ",     ig: "Ọha"        },
  "nav.myCourses":   { en: "My Courses", pcm: "My Courses", yo: "Ẹ̀kọ́ Mi",    ig: "Ihe M Na-Amụ" },
  "nav.settings":    { en: "Settings",   pcm: "Settings",   yo: "Ètò",        ig: "Nhazi"      },
  "nav.navigation":  { en: "Navigation", pcm: "Navigation", yo: "Ìlànà",      ig: "Ụzọ"       },

  // ─── Settings Sections ───────────────────────────
  "settings.title":           { en: "Settings",              pcm: "Settings",              yo: "Ètò",                ig: "Nhazi"              },
  "settings.profile":         { en: "Profile",               pcm: "Profile",               yo: "Ìpele",              ig: "Profaịlụ"           },
  "settings.account":         { en: "Account & Security",    pcm: "Account & Security",    yo: "Àkọ́ọ̀lé àti Ààbò",   ig: "Akaụntụ na Nchekwa" },
  "settings.notifications":   { en: "Notifications",         pcm: "Notifications",         yo: "Ìfitónilétí",        ig: "Ọkwa"               },
  "settings.billing":         { en: "Billing & Subscription",pcm: "Billing & Subscription",yo: "Ìsanwó",             ig: "Ụgwọ"              },
  "settings.logOut":          { en: "Log Out",               pcm: "Log Out",               yo: "Jáde",               ig: "Pụọ"               },

  // ─── Profile ─────────────────────────────────────
  "profile.title":      { en: "Profile",                          pcm: "Profile",                               yo: "Ìpele rẹ",                         ig: "Profaịlụ gị"                      },
  "profile.desc":       { en: "Manage your public profile information.", pcm: "Manage your profile info.",        yo: "Ṣàkóso àlàyé ìpele rẹ.",          ig: "Jikwaa ozi profaịlụ gị."         },
  "profile.fullName":   { en: "Full Name",                        pcm: "Full Name",                             yo: "Orúkọ Kíkún",                     ig: "Aha Zuru Oke"                    },
  "profile.username":   { en: "Username",                         pcm: "Username",                              yo: "Orúkọ Olùlò",                     ig: "Aha Onye Ọrụ"                    },
  "profile.email":      { en: "Email",                            pcm: "Email",                                 yo: "Ímeèlì",                          ig: "Email"                            },
  "profile.bio":        { en: "Bio",                              pcm: "About You",                             yo: "Nípa Rẹ",                          ig: "Maka Gị"                          },
  "profile.save":       { en: "Save Changes",                     pcm: "Save Am",                               yo: "Fi Pamọ́",                         ig: "Chekwaa"                          },
  "profile.saved":      { en: "✓ Saved!",                         pcm: "✓ E Don Save!",                         yo: "✓ Ti Pamọ́!",                      ig: "✓ Echekwara!"                     },
  "profile.avatar":     { en: "Change Avatar",                    pcm: "Change Picture",                        yo: "Yí Àwòrán Padà",                  ig: "Gbanwee Foto"                     },
  "profile.avatarHint": { en: "JPG, PNG or GIF. Max 2MB.",        pcm: "JPG, PNG or GIF. Max 2MB.",             yo: "JPG, PNG tàbí GIF. 2MB ní ọ̀pọ̀lọpọ̀.", ig: "JPG, PNG ma ọ bụ GIF. Kacha 2MB." },
  "profile.aiTitle":    { en: "AI Assistant Preferences",         pcm: "AI Assistant Settings",                 yo: "Ètò Alárànṣe AI",                  ig: "Nhazi Onye Enyemaka AI"           },
  "profile.aiDesc":     { en: "Customize how AI explains concepts to you.", pcm: "Choose how AI go explain tins for you.", yo: "Ṣe àtúnṣe bí AI ṣe ṣàlàyé fún ẹ.", ig: "Họrọ otu AI si akọwara gị ihe." },
  "profile.simple":     { en: "Simple",                           pcm: "Simple",                                yo: "Rọrùn",                            ig: "Mfe"                              },
  "profile.simpleDesc": { en: "Explain like I'm 5",               pcm: "Explain like pikin",                    yo: "Ṣàlàyé bíi ọmọdé",                ig: "Kọwaa dị ka nwata"                },
  "profile.balanced":   { en: "Balanced",                         pcm: "Normal",                                yo: "Ìwọ̀ntúnwọ̀nsì",                    ig: "Nhatanha"                         },
  "profile.balancedDesc":{ en: "Clear, practical language",        pcm: "Clear, normal English",                yo: "Èdè tó mọ́yì",                     ig: "Asụsụ doro anya"                  },
  "profile.advanced":   { en: "Advanced",                         pcm: "Oga Level",                             yo: "Kíkéréje",                         ig: "Ọkwa Dị Elu"                     },
  "profile.advancedDesc":{ en: "Technical depth",                  pcm: "Full gbedu details",                   yo: "Ìjìnlẹ̀ ìmọ̀",                     ig: "Omimi Teknụzụ"                    },

  // ─── Account ─────────────────────────────────────
  "account.changePw":    { en: "Change Password",                 pcm: "Change Password",                       yo: "Yí Ọ̀rọ̀ Aṣínà Padà",              ig: "Gbanwee Okwuntụghe"              },
  "account.currentPw":   { en: "Current password",                pcm: "Your current password",                 yo: "Ọ̀rọ̀ aṣínà lọ́wọ́lọ́wọ́",            ig: "Okwuntụghe ugbu a"               },
  "account.newPw":       { en: "New password",                    pcm: "New password",                          yo: "Ọ̀rọ̀ aṣínà tuntun",               ig: "Okwuntụghe ọhụrụ"                },
  "account.confirmPw":   { en: "Confirm new password",            pcm: "Type am again",                         yo: "Fi ìdí múlẹ̀",                     ig: "Kwupụta ọzọ"                     },
  "account.updatePw":    { en: "Update Password",                 pcm: "Update Password",                       yo: "Ṣe Àtúnṣe",                       ig: "Melite Okwuntụghe"               },
  "account.pwError":     { en: "Please fill all fields and ensure passwords match.", pcm: "Abeg fill everything and make the passwords match.", yo: "Jọ̀wọ́ kún gbogbo rẹ̀, kí ọ̀rọ̀ aṣínà jọ.", ig: "Biko dejupụta ihe niile were hụ na okwuntụghe abụọ yiri." },
  "account.pwSuccess":   { en: "Password updated successfully!",  pcm: "Password don change!",                  yo: "Ọ̀rọ̀ aṣínà ti yí padà!",          ig: "Agbanweela okwuntụghe!"          },
  "account.prefs":       { en: "Preferences",                     pcm: "Preferences",                           yo: "Ohun Tí O Fẹ́",                    ig: "Ihe Ị Chọrọ"                     },
  "account.darkMode":    { en: "Dark Mode",                       pcm: "Dark Mode",                              yo: "Àṣà Dúdú",                        ig: "Ọchịchịrị"                      },
  "account.darkDesc":    { en: "Always use dark theme",            pcm: "Make everything dark",                  yo: "Lo àṣà dúdú nígbà gbogbo",        ig: "Jiri isiokwu ojii mgbe niile"     },
  "account.language":    { en: "Language",                         pcm: "Language",                               yo: "Èdè",                              ig: "Asụsụ"                           },
  "account.accentColor": { en: "Accent Color",                    pcm: "Color Style",                           yo: "Àwọ̀ Àkànṣe",                     ig: "Agba Pụrụ Iche"                   },
  "account.danger":      { en: "Danger Zone",                     pcm: "Danger Zone",                           yo: "Ibi Ewu",                          ig: "Ebe Nsogbu"                       },
  "account.deleteDesc":  { en: "Permanently delete your account and all associated data. This action cannot be undone.", pcm: "Delete your account forever. You no fit undo am.", yo: "Pa àkọ́ọ̀lé rẹ rẹ́ pátápátá. O kò lè yí padà.", ig: "Ihichapụ akaụntụ gị kpamkpam. Ọ gaghị alaghachi." },
  "account.delete":      { en: "Delete Account",                  pcm: "Delete Account",                        yo: "Pa Àkọ́ọ̀lé Rẹ́",                  ig: "Ihichapụ Akaụntụ"                },
  "account.confirmDelete":{ en: "Yes, Delete My Account",          pcm: "Yes, Remove Am",                       yo: "Bẹ́ẹ̀ni, Pa Rẹ́",                  ig: "Ee, Hichapụ Ya"                   },
  "account.cancel":      { en: "Cancel",                           pcm: "Cancel",                                yo: "Fagilee",                           ig: "Kagbuo"                           },

  // ─── Language Settings ───────────────────────────
  "lang.title":          { en: "App Language",                    pcm: "App Language",                          yo: "Èdè Àpù",                         ig: "Asụsụ Ngwa"                       },
  "lang.desc":           { en: "Translate the entire app into your preferred language.", pcm: "Change the language for the whole app.", yo: "Yí èdè àpù náà padà sí èdè tí o fẹ́.", ig: "Gbanwee asụsụ ngwa ahụ niile." },

  // ─── Notifications ──────────────────────────────
  "notif.title":        { en: "Notifications",                    pcm: "Notifications",                         yo: "Ìfitónilétí",                      ig: "Ọkwa"                            },
  "notif.desc":         { en: "Choose when and how you want to be notified.", pcm: "Choose how you wan receive notification.", yo: "Yan ìgbà àti bí a ṣe ṣàkíyèsí rẹ.", ig: "Họrọ oge ị chọrọ ka a gwa gị ozi." },
  "notif.courseUpdates": { en: "Course Updates",                   pcm: "Course Updates",                        yo: "Ìmúdójúìwọ̀n Ẹ̀kọ́",               ig: "Mmelite Kọọsụ"                   },
  "notif.courseUpdatesDesc": { en: "Get notified when new content is added.", pcm: "Know when new tins dey.", yo: "Mọ̀ nígbà tí a fi àkóónú tuntun kùn.", ig: "Mara mgbe agbakwunyere ihe ọhụrụ." },
  "notif.learningReminders": { en: "Learning Reminders",           pcm: "Learning Reminders",                    yo: "Ìránnilétí Ẹ̀kọ́",                 ig: "Nchetara Ịmụta"                  },
  "notif.learningRemindersDesc": { en: "Daily reminders to maintain your streak.", pcm: "Daily reminder to keep your streak.", yo: "Ìránnilétí ojoojúmọ́.", ig: "Nchetara ụbọchị ụbọchị." },
  "notif.communityActivity": { en: "Community Activity",           pcm: "Community Activity",                    yo: "Ìṣẹ̀lẹ̀ Àwùjọ",                   ig: "Ọrụ Ọha"                        },
  "notif.communityActivityDesc": { en: "Notifications from community discussions.", pcm: "Notification from community talk.", yo: "Ìfitónilétí láti àwùjọ.", ig: "Ọkwa sitere n'ọha." },
  "notif.achievementUnlocked": { en: "Achievement Unlocked",      pcm: "Achievement Unlocked",                  yo: "Àṣeyọrí Ṣíṣí",                    ig: "Ihe Emere Emere"                 },
  "notif.achievementUnlockedDesc": { en: "Celebrate milestones.", pcm: "Celebrate milestones.",                  yo: "Ṣe ayẹyẹ àmì àṣeyọrí.",           ig: "Mee emume ọkwa."                 },
  "notif.productUpdates": { en: "Product Updates",                 pcm: "Product Updates",                       yo: "Ìmúdójúìwọ̀n Ọja",                 ig: "Mmelite Ngwaahịa"                },
  "notif.productUpdatesDesc": { en: "News about Thumbnail Learning features.", pcm: "News about Thumbnail Learning features.", yo: "Ìròyìn nípa ẹ̀yà Thumbnail Learning.", ig: "Akụkọ banyere atụmatụ Thumbnail Learning." },
  "notif.emailDigest":  { en: "Email Digest",                     pcm: "Email Digest",                          yo: "Àkópọ̀ Ímeèlì",                   ig: "Nchịkọta Email"                  },
  "notif.emailDigestDesc": { en: "Weekly progress summary to email.", pcm: "Weekly summary to your email.", yo: "Àkópọ̀ ọ̀sẹ̀ sí Ímeèlì rẹ.", ig: "Nchịkọta izụ ụka na email gị." },

  // ─── Billing ─────────────────────────────────────
  "billing.title":     { en: "Billing & Subscription",            pcm: "Billing & Subscription",                yo: "Ìsanwó àti Ìforúkọsílẹ̀",          ig: "Ụgwọ na Ndenye Aha"              },
  "billing.desc":      { en: "Manage your subscription plan.",     pcm: "Manage your plan.",                     yo: "Ṣàkóso ètò ìsanwó rẹ.",           ig: "Jikwaa atụmatụ ụgwọ gị."         },
  "billing.freePlan":  { en: "Tier 1 — Free Plan",                pcm: "Tier 1 — Free Plan",                    yo: "Ìpele 1 — Ètò Ọ̀fẹ́",              ig: "Ọkwa 1 — Atụmatụ N'efu"          },
  "billing.freeDesc":  { en: "Access to beginner-level AI courses",pcm: "Beginner AI courses",                   yo: "Ẹ̀kọ́ AI àkọ́kọ́",                  ig: "Kọọsụ AI maka ndị mbido"         },
  "billing.used":      { en: "courses used",                      pcm: "courses used",                          yo: "ẹ̀kọ́ tí a ti lò",                 ig: "kọọsụ ejirila"                   },
  "billing.upgrade":   { en: "Upgrade to Pro",                    pcm: "Upgrade to Pro",                        yo: "Gba Sókè Sí Pro",                  ig: "Kwalite na Pro"                   },
  "billing.processing":{ en: "Processing...",                     pcm: "Processing...",                         yo: "Ń ṣiṣẹ́...",                       ig: "Na-arụ ọrụ..."                   },

  // ─── Common ──────────────────────────────────────
  "common.back":       { en: "Back",                              pcm: "Go Back",                               yo: "Padà",                              ig: "Laghachi"                        },
  "common.welcome":    { en: "Welcome back",                      pcm: "Welcome back",                          yo: "Ẹ kú àbọ̀",                        ig: "Nnọọ azụ"                        },
};

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.["en"] ?? key;
}
