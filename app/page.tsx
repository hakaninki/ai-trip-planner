import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Sparkles,
  CalendarDays,
  BookMarked,
  ArrowRight,
  Globe,
  Zap,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080912] text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full bg-violet-700/15 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-700/15 blur-[140px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-pink-700/8 blur-[120px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/[0.06] bg-black/30 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <MapPin className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Voyagen
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white/60 hover:text-white hover:bg-white/8 text-sm"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-white text-[#080912] hover:bg-white/90 font-semibold text-sm px-4 rounded-lg"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-20 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-10 tracking-wide uppercase">
          <Zap className="h-3 w-3 text-violet-400" />
          AI-Powered Travel Intelligence
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
          Your Journey,{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Perfectly Planned
            </span>
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Describe your destination. Tell us your style. Receive a complete,
          hour-by-hour itinerary — crafted around your budget, interests, and
          travel preferences.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-base px-8 h-12 shadow-xl shadow-violet-700/30 rounded-xl"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Plan Your Trip
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-white/12 text-white/70 hover:text-white hover:bg-white/8 text-base px-8 h-12 rounded-xl"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        {/* Social proof strip */}
        <div className="mt-14 flex items-center justify-center gap-8 text-white/30 text-xs">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/60" />
            No subscription required
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-violet-400/60" />
            Any destination worldwide
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-cyan-400/60" />
            Plans ready in under a minute
          </span>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-16">
        <p className="text-center text-white/30 text-xs uppercase tracking-widest mb-10 font-medium">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              icon: <MapPin className="h-5 w-5 text-violet-400" />,
              title: "Define Your Trip",
              description:
                "Enter your destination, travel dates, budget, and the experiences you care about most.",
            },
            {
              step: "02",
              icon: <Sparkles className="h-5 w-5 text-fuchsia-400" />,
              title: "Refine with AI",
              description:
                "Answer a short set of personalization questions. The more context you give, the better the plan.",
            },
            {
              step: "03",
              icon: <CalendarDays className="h-5 w-5 text-cyan-400" />,
              title: "Get Your Itinerary",
              description:
                "Receive a structured, day-by-day schedule with real venues, timings, and local recommendations.",
            },
          ].map((f) => (
            <div
              key={f.step}
              className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-7 hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                  {f.icon}
                </div>
                <span className="text-white/10 font-black text-2xl tracking-tight">
                  {f.step}
                </span>
              </div>
              <h3 className="font-semibold text-white/90 mb-2">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-900/30 to-cyan-900/20 backdrop-blur-sm p-10 text-center">
          <BookMarked className="h-8 w-8 text-violet-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">
            Save every itinerary to your dashboard
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            All generated plans are stored securely in your account. Revisit,
            share, or regenerate them at any time.
          </p>
          <Button
            asChild
            className="bg-white text-[#080912] hover:bg-white/90 font-semibold rounded-xl px-6"
          >
            <Link href="/signup">Create a Free Account</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
