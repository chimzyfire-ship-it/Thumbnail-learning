import Link from "next/link";
import { Mail, ShieldCheck, Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const supportEmail = "support@aethelsolutions.com";
const supportHref = `mailto:${supportEmail}?subject=Aethel%20Solutions%20Support%20Request`;

export default function SupportPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b14] px-4 py-16 sm:px-6 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.16),transparent_35%),linear-gradient(180deg,rgba(7,11,20,0)_0%,#070b14_70%)]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-10">
        <section className="max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[#c9a84c]/80">Support</p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Get help with your Aethel account or lessons.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#9ca3b4] sm:text-lg">
            If something feels confusing, broken, or unclear, use this page to reach us. Keep your message simple and include the email you used to sign up.
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-3">
          <Card className="border-[#c9a84c]/20 bg-[#111827]/70">
            <CardContent className="p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a84c]/10 text-[#c9a84c]">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Email support</h2>
              <p className="mt-2 text-sm leading-6 text-[#9ca3b4]">
                This is the official launch support path for account, lesson, and file issues.
              </p>
              <a href={supportHref} className="mt-5 inline-flex text-sm font-bold text-[#c9a84c] hover:underline">
                {supportEmail}
              </a>
            </CardContent>
          </Card>

          <Card className="border-[#c9a84c]/20 bg-[#111827]/70">
            <CardContent className="p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a84c]/10 text-[#c9a84c]">
                <Camera className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Send context</h2>
              <p className="mt-2 text-sm leading-6 text-[#9ca3b4]">
                If the issue is visual, attach a screenshot. It helps us understand the exact screen faster.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#c9a84c]/20 bg-[#111827]/70">
            <CardContent className="p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9a84c]/10 text-[#c9a84c]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Privacy first</h2>
              <p className="mt-2 text-sm leading-6 text-[#9ca3b4]">
                Do not send passwords or payment details. We will never ask for your password.
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="rounded-3xl border border-[#c9a84c]/20 bg-gradient-to-br from-[#111827]/90 to-[#0a0e1a]/90 p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">What to include</h2>
              <p className="mt-2 text-sm leading-7 text-[#9ca3b4]">
                Your account email, what you clicked, what you expected, and what happened instead.
              </p>
            </div>
            <a href={supportHref}>
              <Button className="w-full bg-[#c9a84c] px-6 py-6 font-bold text-[#0a0e1a] hover:bg-[#d4b95e] md:w-auto">
                Email Support <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </section>

        <div className="flex flex-wrap gap-4 text-sm text-[#7a8194]">
          <Link href="/terms" className="hover:text-[#c9a84c] hover:underline">Terms</Link>
          <Link href="/privacy" className="hover:text-[#c9a84c] hover:underline">Privacy</Link>
          <Link href="/login" className="hover:text-[#c9a84c] hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
