import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In — AI Trip Planner",
};

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-[#080912] flex items-center justify-center px-4">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-700/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-700/20 blur-[120px]" />
            </div>
            <div className="relative z-10 w-full max-w-md">
                <LoginForm />
            </div>
        </main>
    );
}
