import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, RotateCcw, Power } from "lucide-react";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Live Simulator — PoolForge" },
      {
        name: "description",
        content:
          "Interactive thread pool simulator: tune pool size and task rate, watch workers, queue, and metrics in real time.",
      },
    ],
  }),
  component: SimulatorPage,
});

type Task = { id: number; cost: number };
type WorkerState = {
  id: number;
  task: Task | null;
  progress: number;
  totalDone: number;
};

function SimulatorPage() {
  const [poolSize, setPoolSize] = useState(8);
  const [arrivalRate, setArrivalRate] = useState(6); // tasks per sec
  const [avgCost, setAvgCost] = useState(900); // ms
  const [running, setRunning] = useState(true);
  const [draining, setDraining] = useState(false);

  const [workers, setWorkers] = useState<WorkerState[]>(() =>
    Array.from({ length: 8 }, (_, i) => ({ id: i, task: null, progress: 0, totalDone: 0 })),
  );
  const [queue, setQueue] = useState<Task[]>([]);
  const [completed, setCompleted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const taskIdRef = useRef(1);
  const startTimes = useRef<Map<number, number>>(new Map());
  const queueCap = 30;

  // Resize worker array when pool size changes
  useEffect(() => {
    setWorkers((prev) => {
      if (prev.length === poolSize) return prev;
      if (prev.length < poolSize) {
        const extras = Array.from({ length: poolSize - prev.length }, (_, i) => ({
          id: prev.length + i,
          task: null,
          progress: 0,
          totalDone: 0,
        }));
        return [...prev, ...extras];
      }
      // shrink: keep busy workers; mark surplus as draining (drop tasks)
      return prev.slice(0, poolSize);
    });
  }, [poolSize]);

  // Task arrival
  useEffect(() => {
    if (!running || draining) return;
    const intervalMs = Math.max(40, 1000 / arrivalRate);
    const t = setInterval(() => {
      setQueue((q) => {
        if (q.length >= queueCap) {
          setRejected((r) => r + 1);
          return q;
        }
        const cost = avgCost * (0.6 + Math.random() * 0.8);
        const task = { id: taskIdRef.current++, cost };
        startTimes.current.set(task.id, performance.now());
        return [...q, task];
      });
    }, intervalMs);
    return () => clearInterval(t);
  }, [running, draining, arrivalRate, avgCost]);

  // Tick: assign + progress
  useEffect(() => {
    if (!running) return;
    const tickMs = 80;
    const t = setInterval(() => {
      setWorkers((prev) => {
        const next = prev.map((w) => ({ ...w }));
        // progress busy workers
        for (const w of next) {
          if (w.task) {
            w.progress += (tickMs / w.task.cost) * 100;
            if (w.progress >= 100) {
              const start = startTimes.current.get(w.task.id);
              if (start != null) {
                setLatencies((ls) => [...ls.slice(-49), performance.now() - start]);
                startTimes.current.delete(w.task.id);
              }
              setCompleted((c) => c + 1);
              w.totalDone += 1;
              w.task = null;
              w.progress = 0;
            }
          }
        }
        // assign idle workers from queue
        setQueue((q) => {
          if (q.length === 0) return q;
          const copy = [...q];
          for (const w of next) {
            if (!w.task && copy.length > 0) {
              w.task = copy.shift()!;
              w.progress = 0;
            }
          }
          return copy;
        });
        return next;
      });
    }, tickMs);
    return () => clearInterval(t);
  }, [running]);

  // Drain logic
  useEffect(() => {
    if (!draining) return;
    if (queue.length === 0 && workers.every((w) => !w.task)) {
      setRunning(false);
      setDraining(false);
    }
  }, [draining, queue, workers]);

  const busy = workers.filter((w) => w.task).length;
  const utilization = workers.length ? Math.round((busy / workers.length) * 100) : 0;
  const avgLatency = useMemo(
    () => (latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0),
    [latencies],
  );
  const p99 = useMemo(() => {
    if (!latencies.length) return 0;
    const sorted = [...latencies].sort((a, b) => a - b);
    return Math.round(sorted[Math.floor(sorted.length * 0.99) - 1] ?? sorted[sorted.length - 1]);
  }, [latencies]);

  const reset = () => {
    setQueue([]);
    setCompleted(0);
    setRejected(0);
    setLatencies([]);
    setWorkers((prev) => prev.map((w) => ({ ...w, task: null, progress: 0, totalDone: 0 })));
    startTimes.current.clear();
    taskIdRef.current = 1;
    setDraining(false);
    setRunning(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-mint">
            // Live simulator
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Pool playground</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Tune the pool, then watch tasks arrive, queue, dispatch, execute, and complete in real
            time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:border-mint/50"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Resume"}
          </button>
          <button
            onClick={() => setDraining(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:border-warn/50"
          >
            <Power className="h-4 w-4" /> Drain
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-mint to-mint-glow px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Metric label="utilization" value={`${utilization}%`} accent />
        <Metric label="completed" value={completed.toString()} />
        <Metric label="queue depth" value={`${queue.length} / ${queueCap}`} />
        <Metric label="avg latency" value={`${avgLatency}ms`} />
        <Metric label="p99 latency" value={`${p99}ms`} warn={p99 > 2000} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Visualization */}
        <div className="space-y-6">
          {/* Queue */}
          <div className="rounded-2xl border border-border bg-card/50 p-5">
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>incoming task queue</span>
              <span>
                {draining ? "draining…" : running ? "accepting" : "paused"} · cap {queueCap}
              </span>
            </div>
            <div className="flex h-14 items-center gap-1.5 overflow-hidden rounded-lg border border-border bg-background/60 px-3">
              <AnimatePresence initial={false}>
                {queue.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-mint/20 bg-mint/10 font-mono text-[9px] text-mint"
                    title={`task #${task.id}`}
                  >
                    {task.id}
                  </motion.div>
                ))}
              </AnimatePresence>
              {queue.length === 0 && (
                <span className="font-mono text-[11px] text-muted-foreground">queue empty</span>
              )}
            </div>
          </div>

          {/* Workers */}
          <div className="rounded-2xl border border-border bg-card/50 p-5">
            <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>worker pool</span>
              <span>
                {busy} / {workers.length} active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6">
              {workers.map((w) => (
                <motion.div
                  key={w.id}
                  layout
                  className={`relative overflow-hidden rounded-xl border p-3 transition ${
                    w.task
                      ? "border-mint/40 bg-mint/5"
                      : "border-border bg-background/40"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span>worker-{w.id.toString().padStart(2, "0")}</span>
                    <span
                      className={`flex items-center gap-1 ${w.task ? "text-mint" : "text-muted-foreground"}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${w.task ? "bg-mint pulse-dot" : "bg-muted-foreground/50"}`}
                      />
                      {w.task ? "running" : "idle"}
                    </span>
                  </div>
                  <div className="mt-2 font-mono text-xs text-foreground">
                    {w.task ? `task #${w.task.id}` : "—"}
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background/60">
                    <motion.div
                      animate={{ width: `${w.task ? w.progress : 0}%` }}
                      transition={{ duration: 0.08, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-mint to-mint-glow"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span>done</span>
                    <span className="text-foreground/80">{w.totalDone}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/50 p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Configuration
            </h3>
            <div className="mt-4 space-y-5">
              <Control
                label="Pool size"
                value={`${poolSize} workers`}
                slider={
                  <Slider
                    min={1}
                    max={16}
                    step={1}
                    value={[poolSize]}
                    onValueChange={(v) => setPoolSize(v[0])}
                  />
                }
              />
              <Control
                label="Arrival rate"
                value={`${arrivalRate} tasks/s`}
                slider={
                  <Slider
                    min={1}
                    max={30}
                    step={1}
                    value={[arrivalRate]}
                    onValueChange={(v) => setArrivalRate(v[0])}
                  />
                }
              />
              <Control
                label="Avg task cost"
                value={`${avgCost}ms`}
                slider={
                  <Slider
                    min={200}
                    max={3000}
                    step={100}
                    value={[avgCost]}
                    onValueChange={(v) => setAvgCost(v[0])}
                  />
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Counters
            </h3>
            <dl className="mt-3 space-y-2 font-mono text-xs">
              <Row k="completed" v={completed.toString()} />
              <Row k="in queue" v={queue.length.toString()} />
              <Row k="rejected" v={rejected.toString()} tone={rejected ? "warn" : undefined} />
              <Row k="draining" v={draining ? "true" : "false"} />
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-mint/5 p-5">
            <p className="text-xs leading-relaxed text-foreground/80">
              <span className="text-mint">Try this:</span> push arrival rate to 25/s with pool size
              4. Watch the queue saturate and rejections climb — then bump pool to 12 and see p99
              recover.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
  warn,
}: {
  label: string;
  value: string;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`mt-1 font-display text-2xl font-bold ${
          warn ? "text-destructive" : accent ? "text-gradient-mint" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Control({
  label,
  value,
  slider,
}: {
  label: string;
  value: string;
  slider: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-mint">{value}</span>
      </div>
      {slider}
    </div>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "warn" }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={tone === "warn" ? "text-destructive" : "text-foreground"}>{v}</dd>
    </div>
  );
}
