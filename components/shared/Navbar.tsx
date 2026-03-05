"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { MapPin, LogOut, LayoutDashboard, PlusCircle } from "lucide-react";

export function Navbar() {
    const router = useRouter();
    const supabase = createClient();

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    }

    return (
        <nav className="border-b border-white/[0.06] bg-black/30 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                        <MapPin className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Voyagen
                    </span>
                </Link>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-white/50 hover:text-white hover:bg-white/8 text-sm"
                    >
                        <Link href="/dashboard">
                            <LayoutDashboard className="h-4 w-4 mr-1.5" />
                            Trips
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-white/50 hover:text-white hover:bg-white/8 text-sm"
                    >
                        <Link href="/planner">
                            <PlusCircle className="h-4 w-4 mr-1.5" />
                            New Trip
                        </Link>
                    </Button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-white/40 hover:text-white/80 hover:bg-white/8 text-sm"
                    >
                        <LogOut className="h-4 w-4 mr-1.5" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </nav>
    );
}
