"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Radio, Search, Settings, ShieldAlert, Terminal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/providers/toast-provider";

const actions = [
  { label: "Open command center", hint: "Dashboard", href: "/dashboard?demo=1", icon: Terminal },
  { label: "Open incident queue", hint: "Threats", href: "/incidents?demo=1", icon: ShieldAlert },
  { label: "Run battle simulation", hint: "Battle Lab", event: "battle", icon: Radio },
  { label: "Generate incident report", hint: "Reports", event: "report", icon: FileText },
  { label: "Open security settings", hint: "Admin", href: "/settings?demo=1", icon: Settings },
];

export function CommandPalette() {
  const router = useRouter();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(
    () => actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()) || action.hint.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  function runAction(action: (typeof actions)[number]) {
    setOpen(false);
    if ("href" in action && action.href) {
      router.push(action.href);
      return;
    }
    notify({
      title: action.label,
      description: action.event === "battle" ? "Blue Team AI simulation round queued." : "Incident PDF workflow prepared for the active incident.",
      tone: "success",
    });
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} className="hidden sm:inline-flex">
        <Search className="h-4 w-4" />
        Command
        <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">Ctrl K</span>
      </Button>
      {open ? (
        <div className="fixed inset-0 z-40 bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="mx-auto mt-20 max-w-xl rounded-lg border border-white/10 bg-slate-950 p-3 shadow-2xl">
            <div className="mb-3 flex items-center gap-2">
              <Search className="ml-2 h-4 w-4 text-cyan-200" />
              <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search commands, incidents, settings..." className="border-0 bg-transparent focus:ring-0" />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close command palette">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-2">
              {filtered.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="flex items-center justify-between rounded-md border border-white/10 bg-white/[.035] p-3 text-left transition hover:border-cyan-300/35 hover:bg-cyan-300/10"
                    onClick={() => runAction(action)}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-cyan-200" />
                      <span>
                        <span className="block text-sm font-medium text-white">{action.label}</span>
                        <span className="text-xs text-slate-500">{action.hint}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
              {!filtered.length ? <p className="p-4 text-sm text-slate-400">No command matched that query.</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
