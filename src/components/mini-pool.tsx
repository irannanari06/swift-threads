import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Worker = { id: number; busy: boolean };

export function MiniPool() {
  const [workers, setWorkers] = useState<Worker[]>(
    Array.from({ length: 8 }, (_, i) => ({ id: i, busy: i < 6 })),
  );
  const [queue, setQueue] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  useEffect(() => {
    const t = setInterval(() => {
      setWorkers((prev) =>
        prev.map((w) => (Math.random() > 0.55 ? { ...w, busy: !w.busy } : w)),
      );
      setQueue((q) => {
        const next = [...q];
        if (Math.random() > 0.5) next.push(next.length ? next[next.length - 1] + 1 : 1);
        if (next.length > 4 && Math.random() > 0.4) next.shift();
        return next.slice(-14);
      });
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>workers</span>
          <span>{workers.filter((w) => w.busy).length} active</span>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {workers.map((w) => (
            <motion.div
              key={w.id}
              animate={{
                backgroundColor: w.busy
                  ? "color-mix(in oklab, var(--mint) 80%, transparent)"
                  : "color-mix(in oklab, var(--mint) 12%, transparent)",
                boxShadow: w.busy ? "0 0 16px -2px var(--mint)" : "0 0 0 0 transparent",
              }}
              transition={{ duration: 0.4 }}
              className="aspect-square rounded-md border border-border"
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>task queue</span>
          <span>{queue.length} pending</span>
        </div>
        <div className="flex h-8 items-center gap-1 overflow-hidden rounded-md border border-border bg-background/50 px-2">
          {queue.map((id) => (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="h-4 w-4 shrink-0 rounded-sm bg-foreground/20"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
