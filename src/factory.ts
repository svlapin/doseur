/**
 * Creates a new `doseur` instance
 * @param fn function to be invoked when either queue exceeds `maxQueueLength` or timeout set after the first enqueueing fires
 * @param maxQueueLength maximum number of items to store in the queue. When reached, invokes `fn` right away
 * @param timeoutMs number of milliseconds to wait since the first enqueueing before flushing the queue
 * @returns an instance of `doesuer`.
 */
export default function factory<T, F extends (...args: T[]) => void>(
  fn: F,
  maxQueueLength: number,
  timeoutMs: number
) {
  let queue: T[] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  const flushQueue = () => {
    fn(...queue.splice(0));
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
  };

  return {
    enqueue: (...items: T[]) => {
      queue.push(...items);

      if (queue.length >= maxQueueLength) {
        flushQueue();
      } else if (!timeoutId) {
        timeoutId = setTimeout(flushQueue, timeoutMs);
      }
    },

    reset: () => {
      queue = [];
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
}
