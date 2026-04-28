import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouterState } from "@tanstack/react-router";

export function TopBar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const crumbs: Record<string, string> = {
    "/": "Overview",
    "/architecture": "Architecture",
    "/simulator": "Simulator",
    "/docs": "Docs",
  };
  const title = crumbs[path] ?? "Overview";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/70 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden h-4 w-px bg-border sm:block" />
        <div className="hidden items-center gap-2 text-xs sm:flex">
          <span className="text-muted-foreground">PoolForge</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium text-foreground">{title}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-mint pulse-dot" />
          <span>region</span>
          <span className="text-foreground">eu-west-1</span>
          <span className="text-muted-foreground/40">·</span>
          <span>v1.4.2</span>
        </div>
        <button className="rounded-md bg-gradient-to-br from-mint to-mint-glow px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_0_20px_-4px_var(--mint)] transition hover:brightness-110">
          Deploy pool
        </button>
      </div>
    </header>
  );
}
