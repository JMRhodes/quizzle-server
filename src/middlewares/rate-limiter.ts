import { cloudflareRateLimiter } from "@hono-rate-limiter/cloudflare";

export type AppType = {
  Variables: {
    rateLimit: boolean;
  };
  Bindings: {
    SERVER_RATE_LIMITER: RateLimit;
  };
};

export const rateLimiter = cloudflareRateLimiter<AppType>({
  rateLimitBinding: c => c.env.SERVER_RATE_LIMITER,
  keyGenerator: c => c.req.header("cf-connecting-ip") ?? "", // Method to generate custom identifiers for clients.
});
