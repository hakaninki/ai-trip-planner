// SERVER ONLY — never import this in a client component
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cookie-based server client using the ANON key.
 * This reads the user's session from cookies, so auth.getUser() works correctly.
 * RLS policies on the database handle data access control.
 */
export async function createServerClient() {
    const cookieStore = await cookies();
    return createSupabaseServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ← anon key, not service role
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Called from a Server Component — safe to ignore.
                    }
                },
            },
        }
    );
}
