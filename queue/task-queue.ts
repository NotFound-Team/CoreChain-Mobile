// TaskQueue.ts
export type TaskFunction<T> = (signal?: AbortSignal) => Promise<T>;

export class TaskQueue {
  private concurrency: number;
  private queue: {
    task: TaskFunction<any>;
    signal?: AbortSignal;
    resolve: (v: any) => void;
    reject: (e: any) => void;
  }[] = [];
  private running = 0;
  private idleResolvers: (() => void)[] = [];

  constructor(concurrency = 1) {
    if (concurrency <= 0) throw new Error("concurrency must be >= 1");
    this.concurrency = concurrency;
  }

  enqueue<T>(task: TaskFunction<T>, signal?: AbortSignal): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ task, signal, resolve, reject });
      // Try to run immediately if there's capacity
      this.runNext();
    });
  }

  private runNext() {
    // Start as many tasks as allowed by concurrency
    while (this.running < this.concurrency && this.queue.length > 0) {
      const item = this.queue.shift()!;
      this.running++;
      (async () => {
        try {
          const result = await item.task(item.signal);
          item.resolve(result);
        } catch (err) {
          item.reject(err);
        } finally {
          this.running--;
          // If idle now, resolve waiters
          if (this.isIdle()) {
            this.idleResolvers.forEach((r) => r());
            this.idleResolvers = [];
          }
          // Continue with next queued tasks
          this.runNext();
        }
      })();
    }
  }

  // Remove all pending (not running) tasks
  clear() {
    this.queue = [];
  }

  // Total tasks (running + pending)
  size() {
    return this.queue.length + this.running;
  }

  // Only pending (not running)
  pending() {
    return this.queue.length;
  }

  isIdle() {
    return this.running === 0 && this.queue.length === 0;
  }

  // Wait until queue is idle
  waitForIdle(): Promise<void> {
    if (this.isIdle()) return Promise.resolve();
    return new Promise((res) => this.idleResolvers.push(res));
  }
}
