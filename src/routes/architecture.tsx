import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown, Cpu, Database, Layers, Lock, Power } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture — PoolForge Thread Pool" },
      {
        name: "description",
        content:
          "Inside PoolForge: dispatcher, work queue, worker lifecycle, synchronization primitives, and graceful shutdown.",
      },
    ],
  }),
  component: ArchitecturePage,
});

const stages = [
  {
    icon: Database,
    title: "Submission",
    code: "pool.submit(task)",
    body: "Tasks enter through a thread-safe MPMC queue with bounded capacity and pluggable rejection policy (caller-runs, drop-oldest, abort).",
  },
  {
    icon: Layers,
    title: "Dispatch",
    code: "scheduler.steal()",
    body: "A work-stealing scheduler hands tasks to idle workers. Hot workers pull from their local deque; idle ones steal from siblings.",
  },
  {
    icon: Cpu,
    title: "Execution",
    code: "worker.run(task)",
    body: "Pre-warmed OS threads execute tasks. Per-worker context (allocators, RNG, tracing span) is reused across runs to avoid setup cost.",
  },
  {
    icon: Lock,
    title: "Synchronization",
    code: "barrier.await()",
    body: "Built-in latches, barriers, condition variables, and futures coordinate fan-in / fan-out without manual locking.",
  },
  {
    icon: Power,
    title: "Termination",
    code: "pool.shutdown()",
    body: "Drain mode rejects new work, flushes the queue, and joins workers within a timeout. Outstanding futures resolve or cancel cleanly.",
  },
];

function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-mint">
        // System diagram
      </div>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
        How a task flows through PoolForge
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Five stages, one shared lifecycle. Each layer is independently observable and configurable.
      </p>

      <div className="mt-12 space-y-4">
        {stages.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="grid items-stretch gap-4 rounded-2xl border border-border bg-card/50 p-5 md:grid-cols-[auto_1fr_auto]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-mint/20 to-mint/5 text-mint ring-mint">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    stage {i + 1} · 0{i + 1}
                  </span>
                </div>
                <h2 className="mt-1 font-display text-xl font-semibold">{s.title}</h2>
                <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{s.body}</p>
              </div>
              <div className="flex items-center md:justify-end">
                <code className="rounded-md border border-border bg-background/60 px-3 py-1.5 font-mono text-xs text-mint">
                  {s.code}
                </code>
              </div>
            </div>
            {i < stages.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="h-5 w-5 text-mint/60" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { k: "Worker states", v: "idle · running · draining · joined" },
          { k: "Queue model", v: "bounded MPMC + per-worker deque" },
          { k: "Scheduler", v: "FIFO + work-stealing fallback" },
        ].map((c) => (
          <div key={c.k} className="rounded-xl border border-border bg-card/40 p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.k}</div>
            <div className="mt-1 font-mono text-sm text-foreground">{c.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
