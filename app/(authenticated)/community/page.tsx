import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 max-w-3xl mx-auto w-full p-0 sm:p-2 py-12 sm:py-20 text-center">
      
      {/* Hero */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-[#c9a84c]/10 border-2 border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
          <img src="/icon-community.png" alt="Community" className="w-20 h-20 object-contain" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Community Hub</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          The Aethel Solutions community is not open yet. For MVP launch, this space stays clearly marked as coming soon instead of showing fake posts or fake signups.
        </p>
      </div>

      {/* Coming Soon Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
        {[
          { icon: "/icon-discussion.png", title: "Discussion Forums", desc: "Ask questions, share tips, and help others." },
          { icon: "/icon-trophy.png", title: "Leaderboards", desc: "Compete with other learners and track your ranking." },
          { icon: "/icon-community.png", title: "Study Groups", desc: "Join or create study groups with peers on similar paths." },
        ].map((feature) => (
          <Card key={feature.title} className="bg-secondary/20 border-border/50">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden">
                <img src={feature.icon} alt={feature.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-white text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Honest MVP CTA */}
      <div className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/30 rounded-2xl p-6 sm:p-8 border border-primary/20 w-full">
        <h3 className="text-xl font-bold text-white mb-2">Need help before community opens?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Use the support page for account issues, course questions, or launch feedback.
        </p>
        <Link href="/support" passHref legacyBehavior>
          <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold gap-2 px-6">
            <LifeBuoy className="w-4 h-4" /> Open Support
          </Button>
        </Link>
      </div>
    </div>
  );
}
