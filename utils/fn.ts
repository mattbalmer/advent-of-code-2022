export const memoize = <
  T extends (...args: any[]) => any
>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): (...args: Parameters<T>) => ReturnType<T> => {
  const map = new Map<string, ReturnType<T>>();
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    if (map.has(key)) {
      return map.get(key);
    }
    const res = fn(...args);
    map.set(key, res);
    return res;
  }
}