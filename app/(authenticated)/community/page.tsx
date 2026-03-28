import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Trophy, Sparkles, Bell } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 max-w-3xl mx-auto w-full p-2 py-20 text-center">
      
      {/* Hero */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-6 relative">
          <Users className="w-14 h-14 text-primary" />
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary-foreground" />
          </span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Community Hub</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          Connect with fellow learners, share insights, and grow together. 
          The Thumbnail Learning community is launching soon!
        </p>
      </div>

      {/* Coming Soon Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
        {[
          { icon: MessageSquare, title: "Discussion Forums", desc: "Ask questions, share tips, and help others." },
          { icon: Trophy, title: "Leaderboards", desc: "Compete with other learners and track your ranking." },
          { icon: Users, title: "Study Groups", desc: "Join or create study groups with peers on similar paths." },
        ].map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="bg-secondary/20 border-border/50">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-white text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notify Me CTA */}
      <div className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/30 rounded-2xl p-8 border border-primary/20 w-full">
        <h3 className="text-xl font-bold text-white mb-2">Be the first to know</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Get notified when the Community Hub goes live.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
          <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold gap-2 px-6">
            <Bell className="w-4 h-4" /> Notify Me
          </Button>
        </div>
      </div>
    </div>
  );
}
