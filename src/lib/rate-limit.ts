export function rateLimit({
  interval = 60 * 1000, // 1 minute
  uniqueTokenPerInterval = 500,
}: {
  interval?: number;
  uniqueTokenPerInterval?: number;
}) {
  // Use a Map instead of LRUCache for better compatibility
  const tokenCache = new Map<string, number[]>();

  // Cleanup function to remove expired entries
  const cleanup = () => {
    const now = Date.now();
    for (const [token, timestamps] of tokenCache.entries()) {
      const validTimestamps = timestamps.filter(
        (time) => now - time < interval
      );
      if (validTimestamps.length === 0) {
        tokenCache.delete(token);
      } else {
        tokenCache.set(token, validTimestamps);
      }
    }
  };

  // Run cleanup periodically
  setInterval(cleanup, interval);

  return {
    check: async (limit: number, token: string) => {
      const now = Date.now();
      const timestamps = tokenCache.get(token) || [];
      const validTimestamps = timestamps.filter(
        (time) => now - time < interval
      );

      // Check if limit is exceeded
      if (validTimestamps.length >= limit) {
        throw new Error("Rate limit exceeded");
      }

      // Add current request
      validTimestamps.push(now);
      tokenCache.set(token, validTimestamps);

      // Enforce max size
      if (tokenCache.size > uniqueTokenPerInterval) {
        const oldestToken = Array.from(tokenCache.keys())[0];
        if (oldestToken) {
          tokenCache.delete(oldestToken);
        }
      }
    },
  };
}
