"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("analyst@sentinelswarm.ai");
  const [password, setPassword] = useState("sentinel-demo");
  const [message, setMessage] = useState("");

  async function submit() {
    setMessage("");
    const supabase = createClient();
    const action =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await action;
    if (error) {
      setMessage("Supabase is not configured yet. Demo access is available from the dashboard CTA.");
      return;
    }
    router.push("/dashboard");
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
          <Button className="w-full" onClick={submit}>{mode === "login" ? "Login" : "Sign up"}</Button>
          <Button variant="ghost" className="w-full" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Need an account?" : "Already have an account?"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
