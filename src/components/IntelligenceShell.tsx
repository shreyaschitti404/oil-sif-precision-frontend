import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Database,
  FileSearch,
  Gauge,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
type AppPath = "/dashboard" | "/data" | "/sif-intelligence" | "/sites" | "/rules" | "/patterns" | "/reports" | "/analytics";
const nav = [
  ["/dashboard", "Command Center", Gauge],
  ["/data", "Data Upload", Upload],
  ["/sif-intelligence", "SIF Intelligence", ShieldCheck],
  ["/sites", "Site Intelligence", Database],
  ["/rules", "Life-Saving Rules", Activity],
  ["/patterns", "Precursor Patterns", BrainCircuit],
  ["/reports", "Reports", FileSearch],
  ["/analytics", "Analytics", BarChart3],
] satisfies ReadonlyArray<readonly [AppPath, string, LucideIcon]>;
const utilityLinks: ReadonlyArray<readonly [LucideIcon, string]> = [[Settings, "Settings"], [CircleHelp, "Help"]];
const searchSuggestions: ReadonlyArray<readonly [string, AppPath]> = [["Energy Isolation", "/rules"], ["Isolation Not Verified", "/patterns"], ["Duliajan Central Facility", "/sites"], ["Report OIL-001482", "/reports"]];
export function IntelligenceShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false),
    [search, setSearch] = useState(false),
    [notices, setNotices] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const side = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="grid size-9 shrink-0 place-items-center bg-primary font-display text-sm font-bold text-primary-foreground">
          OIL
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground">SIF Intelligence</p>
            <p className="text-[10px] uppercase text-sidebar-muted">Precursor command</p>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map(([to, label, Icon]) => (
          <Link
            key={to}
            to={to}
            onClick={() => setMobile(false)}
            className={cn(
              "flex h-10 items-center gap-3 border-l-2 px-3 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
              pathname.startsWith(to)
                ? "border-l-primary bg-sidebar-accent text-sidebar-foreground"
                : "border-l-transparent",
            )}
          >
            {<Icon className="size-4 shrink-0" />}
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-success">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          {!collapsed && "AI ENGINE • ONLINE"}
        </div>
        {utilityLinks.map(([Icon, label]) => (
          <div
                key={label}
            className="flex h-9 items-center gap-3 px-3 text-sm text-sidebar-muted"
          >
            <Icon className="size-4" />
            {!collapsed && label}
          </div>
        ))}
      </div>
    </>
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-all lg:flex lg:flex-col",
          collapsed ? "w-20" : "w-64",
        )}
      >
        {side}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-4 top-20 size-8 rounded-full"
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </aside>
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-overlay" onClick={() => setMobile(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-sidebar">
            {side}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3"
              onClick={() => setMobile(false)}
            >
              <X />
            </Button>
          </aside>
        </div>
      )}
      <div className={cn("transition-all", collapsed ? "lg:pl-20" : "lg:pl-64")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobile(true)}>
            <Menu />
          </Button>
          <div className="hidden min-w-0 md:block">
            <p className="truncate text-xs font-semibold uppercase text-muted-foreground">
              Oil India Limited
            </p>
            <p className="truncate text-sm font-medium">Safety intelligence network</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="hidden h-9 w-72 items-center gap-2 border border-input bg-muted px-3 text-sm text-muted-foreground md:flex"
              onClick={() => setSearch(true)}
            >
              <Search className="size-4" />
              Search intelligence <kbd className="ml-auto text-xs">⌘K</kbd>
            </button>
            <select
              aria-label="Date range"
              className="hidden h-9 border border-input bg-background px-2 text-xs sm:block"
            >
              <option>Last 12 months</option>
              <option>Last 90 days</option>
              <option>Last 30 days</option>
            </select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotices((v) => !v)}
              aria-label="Notifications"
              className="relative"
            >
              <Bell />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-critical" />
            </Button>
            <div className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold">
              AR
            </div>
          </div>
        </header>
        {notices && (
          <div className="fixed right-4 top-16 z-50 w-[min(24rem,calc(100vw-2rem))] border border-border bg-popover p-4 shadow-2xl">
            <p className="mb-3 font-semibold">Intelligence notifications</p>
            {[
              "New SIF precursor cluster detected",
              "12 reports require HSE review",
              "Energy Isolation increased at Duliajan",
            ].map((n, i) => (
              <Link
                to={i === 2 ? "/sites" : "/patterns"}
                key={n}
                onClick={() => setNotices(false)}
                className="block border-t border-border py-3 text-sm hover:text-primary"
              >
                {n}
                <span className="mt-1 block text-xs text-muted-foreground">{i + 1}h ago</span>
              </Link>
            ))}
          </div>
        )}
        <main className="mx-auto max-w-[1600px] p-4 md:p-6">{children}</main>
      </div>
      {search && (
        <div
          className="fixed inset-0 z-[60] bg-overlay p-4 pt-[12vh]"
          onClick={() => setSearch(false)}
        >
          <div
            className="mx-auto max-w-2xl border border-border bg-popover shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-border px-4">
              <Search className="size-5 text-muted-foreground" />
              <Input
                autoFocus
                className="h-14 border-0 shadow-none focus-visible:ring-0"
                placeholder="Search reports, sites, rules and patterns…"
              />
              <Button variant="ghost" size="icon" onClick={() => setSearch(false)}>
                <X />
              </Button>
            </div>
            <div className="p-3">
              <p className="px-2 py-2 text-xs uppercase text-muted-foreground">
                Suggested intelligence
              </p>
              {searchSuggestions.map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setSearch(false)}
                  className="flex items-center gap-3 px-3 py-3 text-sm hover:bg-accent"
                >
                  <Search className="size-4 text-muted-foreground" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
