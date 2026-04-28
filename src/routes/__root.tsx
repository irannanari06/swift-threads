import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-mint">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Thread not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The worker you're looking for has been terminated.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-br from-mint to-mint-glow px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Back to overview
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PoolForge — Thread Pool Management for High-Concurrency Servers" },
      {
        name: "description",
        content:
          "PoolForge is a thread pool framework that orchestrates worker creation, reuse, synchronization, and graceful shutdown for scalable server applications.",
      },
      { property: "og:title", content: "PoolForge — Thread Pool Management" },
      {
        property: "og:description",
        content: "Efficient worker orchestration for concurrent servers.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <TopBar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
