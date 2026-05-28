"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("analyst@sentinelswarm.ai");
  const [password, setPassword] = useState("sentinel-demo");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reason = searchParams.get("reason");
  const next = searchParams.get("next") ?? "/dashboard";

  async function submit() {
    setMessage("");
    setIsSubmitting(true);
    const supabase = createClient();
    const action =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await action;
    setIsSubmitting(false);
    if (error) {
      setMessage(error.message || "Supabase rejected the sign-in request.");
      return;
    }
    router.push(next);
  }

  async function signInWithGoogle() {
    setMessage("");
    setIsSubmitting(true);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setIsSubmitting(false);
      setMessage("Google sign-in is not enabled yet. Check the Supabase Google provider settings.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#020617] px-5 text-white">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10">
            <ShieldCheck className="h-6 w-6 text-cyan-200" />
          </div>
          <CardTitle className="text-2xl">{mode === "login" ? "Access command center" : "Create operator account"}</CardTitle>
          <p className="text-sm leading-6 text-slate-400">Supabase Auth is wired and ready for real project credentials.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {reason === "session_required" ? (
            <p className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-100">
              Your secure session is required to enter the command center.
            </p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <Input id="email" className="pl-10" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <Input id="password" className="pl-10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
          </div>
          {message ? <p className="rounded-md border border-amber-300/20 bg-amber-400/10 p-3 text-sm text-amber-100">{message}</p> : null}
          <Button className="w-full" onClick={submit} disabled={isSubmitting}>{isSubmitting ? "Securing session..." : mode === "login" ? "Login" : "Sign up"}</Button>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <Button variant="secondary" className="w-full" onClick={signInWithGoogle} disabled={isSubmitting}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => router.push("/dashboard?demo=1")}>
            View protected demo mode
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Need an account?" : "Already have an account?"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
