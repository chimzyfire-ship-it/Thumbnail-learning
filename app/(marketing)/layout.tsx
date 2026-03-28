import { MarketingNav } from "@/components/layout/MarketingNav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      
      <MarketingNav />
      <main className="flex-1 mt-16">{children}</main>
    </div>
  );
}
