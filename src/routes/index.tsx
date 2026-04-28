import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Cpu,
  Layers,
  Lock,
  Power,
  Workflow,
  Zap,
  Activity,
  Gauge,
} from "lucide-react";
import { MiniPool } from "@/components/mini-pool";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PoolForge — Thread Pool Management Overview" },
      {
        name: "description",
        content:
          "Overview of PoolForge: a thread pool framework that manages creation, reuse, synchronization, and termination for concurrent servers.",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { label: "p50 latency", value: "1.2ms", delta: "−38%", tone: "mint" },
  { label: "throughput", value: "184k rps", delta: "+2.4×", tone: "mint" },
  { label: "thread reuse", value: "99.7%", delta: "warm pool", tone: "muted" },
  { label: "graceful exits", value: "100%", delta: "0 leaks", tone: "muted" },
];

const features = [
  {
    icon: Layers,
    title: "Bounded worker pool",
    body: "Pre-warmed workers eliminate spawn overhead. Bounded size prevents thread storms under load spikes.",
  },
  {
    icon: Workflow,
    title: "Lock-free task queue",
    body: "MPMC ring buffer with backpressure. Tasks flow into idle workers without contending on a global mutex.",
  },
  {
    icon: Lock,
    title: "Synchronization primitives",
    body: "Condition variables, latches, and barriers built in — coordinate fan-in/fan-out without rolling your own.",
  },
  {
    icon: Power,
    title: "Graceful termination",
    body: "Drain mode finishes in-flight tasks, signals workers, and joins cleanly. No orphaned threads, no data races.",
  },
  {
    icon: Gauge,
    title: "Adaptive sizing",
    body: "Pool grows toward maxThreads under pressure and shrinks during idle windows to free resources.",
  },
  {
    icon: Activity,
    title: "Observability",
    body: "Per-worker metrics, queue depth histograms, and OpenTelemetry spans for every dispatched task.",
  },
];

export default function Index() {}
function Index() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "var(--gradient-glow)" }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-[11px] text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-mint pulse-dot" />
              v1.4.2 · zero-allocation hot path
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl"
            >
              Orchestrate <span className="text-gradient-mint">millions</span> of tasks across a
              handful of threads.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg"
            >
              PoolForge is a thread pool framework that handles creation, reuse, synchronization,
              and graceful termination — so your server scales without thread-per-request collapse.
            </motion.p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/simulator"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-mint to-mint-glow px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--mint)] transition hover:brightness-110"
              >
                Launch live simulator
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/architecture"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-mint/50 hover:bg-card"
              >
                See architecture
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card/50 p-3 backdrop-blur"
                >
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="mt-1 font-display text-xl font-bold text-foreground">
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-[11px] text-mint">{s.delta}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-border bg-card/60 p-5 shadow-[var(--shadow-card)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-mint" />
                  <span className="font-display text-sm font-semibold">Pool · live preview</span>
                </div>
                <span className="rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[10px] text-mint">
                  RUNNING
                </span>
              </div>
              <MiniPool />
              <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="rounded-md bg-background/60 p-2">
                  <div className="text-muted-foreground">workers</div>
                  <div className="text-foreground">8</div>
                </div>
                <div className="rounded-md bg-background/60 p-2">
                  <div className="text-muted-foreground">in-flight</div>
                  <div className="text-mint">6</div>
                </div>
                <div className="rounded-md bg-background/60 p-2">
                  <div className="text-muted-foreground">queue</div>
                  <div className="text-foreground">12</div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-6 -z-10 bg-gradient-to-tr from-mint/0 via-mint/10 to-transparent blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-mint">
              // Core capabilities
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Everything a concurrent server needs
            </h2>
          </div>
          <Link
            to="/docs"
            className="hidden text-sm text-muted-foreground hover:text-mint md:inline-flex"
          >
            Read the docs →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.04 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-5 transition hover:border-mint/40"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-mint/5 blur-2xl transition group-hover:bg-mint/15" />
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint/10 text-mint">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Code preview */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col justify-center">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-mint">
              // API surface
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              One call. Then submit work.
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              The pool boots in microseconds, registers signal handlers, and waits for tasks. Submit
              from any thread — PoolForge handles the rest.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/80">
              {[
                "Work-stealing dispatch across cores",
                "Per-task futures with cancellation",
                "Drain & shutdown with timeout",
                "Pluggable rejection policies",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-mint" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-[oklch(0.12_0.03_240)] p-1 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">main.ts</span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-background/60 p-5 font-mono text-[12.5px] leading-relaxed text-foreground/90">
              <code>{`import { ThreadPool } from "poolforge";

const pool = new ThreadPool({
  minThreads: 4,
  maxThreads: 32,
  queueCapacity: 4096,
  keepAliveMs: 30_000,
  rejectionPolicy: "caller-runs",
});

// Submit work from anywhere
const result = await pool.submit(async () => {
  return await renderInvoice(payload);
});

// Coordinate a batch
await pool.barrier(jobs.map((j) => () => process(j)));

// Graceful shutdown
process.on("SIGTERM", () => pool.shutdown({ drainMs: 5_000 }));`}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
