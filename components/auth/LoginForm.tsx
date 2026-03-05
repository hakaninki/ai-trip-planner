"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            router.push("/dashboard");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md bg-white/[0.04] border-white/[0.08] text-white shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
                <div className="flex items-center gap-2.5 mb-2">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                        <MapPin className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-bold text-white/90 tracking-tight">Voyagen</span>
                </div>
                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                <CardDescription className="text-white/40">
                    Sign in to access your travel plans
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-white/60 text-xs uppercase tracking-wide">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/25 focus:border-violet-400 h-11"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-white/60 text-xs uppercase tracking-wide">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/25 focus:border-violet-400 h-11"
                        />
                    </div>
                    {error && (
                        <div className="rounded-lg bg-red-500/8 border border-red-500/20 px-3 py-2.5 text-sm text-red-400">
                            {error}
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold h-11 rounded-xl"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <ArrowRight className="h-4 w-4 mr-2" />
                        )}
                        {loading ? "Signing in…" : "Sign In"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center pt-2">
                <p className="text-sm text-white/30">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                        Create one
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
