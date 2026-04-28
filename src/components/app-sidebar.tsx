import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, Boxes, Cpu, Gauge, BookOpen, Github } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Overview", url: "/", icon: Gauge },
  { title: "Architecture", url: "/architecture", icon: Boxes },
  { title: "Simulator", url: "/simulator", icon: Activity },
  { title: "Docs", url: "/docs", icon: BookOpen },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-mint to-mint-glow text-primary-foreground">
            <Cpu className="h-5 w-5" strokeWidth={2.5} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-mint pulse-dot" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-bold tracking-tight">PoolForge</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              thread orchestration
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Cluster</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Pool · prod-eu-1
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-mint">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint pulse-dot" /> live
                </span>
              </div>
              <div className="mt-2 font-mono text-xs text-foreground/80">
                <div className="flex justify-between">
                  <span>workers</span>
                  <span className="text-mint">12 / 16</span>
                </div>
                <div className="flex justify-between">
                  <span>queue</span>
                  <span>34</span>
                </div>
                <div className="flex justify-between">
                  <span>p99</span>
                  <span>4.2ms</span>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="GitHub">
              <a href="#" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span>github.com/poolforge</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
