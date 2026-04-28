import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — PoolForge" },
      {
        name: "description",
        content: "API reference and guides for PoolForge thread pool framework.",
      },
    ],
  }),
  component: DocsPage,
});

const sections = [
  {
    title: "Installation",
    code: `bun add poolforge
# or
npm install poolforge`,
  },
  {
    title: "Creating a pool",
    code: `import { ThreadPool } from "poolforge";

const pool = new ThreadPool({
  minThreads: 4,        // pre-warmed workers
  maxThreads: 32,       // ceiling under pressure
  queueCapacity: 4096,  // bounded backpressure
  keepAliveMs: 30_000,  // shrink idle workers after this
  rejectionPolicy: "caller-runs",
});`,
  },
  {
    title: "Submitting work",
    code: `// Promise-returning task
const result = await pool.submit(() => expensive(input));

// Fire-and-forget
pool.dispatch(() => writeMetric(payload));

// Cancellable
const handle = pool.submit(longRunning);
setTimeout(() => handle.cancel(), 5_000);`,
  },
  {
    title: "Coordination",
    code: `// Wait for all tasks in a batch
await pool.barrier(jobs.map((j) => () => process(j)));

// Latch — waiters proceed when count reaches zero
const latch = pool.latch(3);
for (const job of jobs) pool.submit(async () => {
  await job(); latch.countDown();
});
await latch.await();`,
  },
  {
    title: "Graceful shutdown",
    code: `process.on("SIGTERM", async () => {
  await pool.shutdown({
    drainMs: 5_000,    // finish in-flight + queued
    forceAfterMs: 8_000, // hard-cancel after this
  });
  process.exit(0);
});`,
  },
];

function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-mint">
        // Reference
      </div>
      <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Documentation</h1>
      <p className="mt-3 text-muted-foreground">
        Everything you need to drop PoolForge into a production server today.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section
            key={s.title}
            className="rounded-2xl border border-border bg-card/40 p-5"
          >
            <h2 className="font-display text-xl font-semibold">{s.title}</h2>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-background/60 p-4 font-mono text-[12.5px] leading-relaxed text-foreground/90">
              <code>{s.code}</code>
            </pre>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-mint/30 bg-mint/5 p-6 text-center">
        <h3 className="font-display text-xl font-semibold">Ready to see it run?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The simulator visualizes every concept above with live workers and a real queue.
        </p>
        <a
          href="/simulator"
          className="mt-4 inline-flex rounded-lg bg-gradient-to-br from-mint to-mint-glow px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Open simulator →
        </a>
      </div>
    </div>
  );
}
