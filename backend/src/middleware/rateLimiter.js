import "dotenv/config";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "20 s"),
});

const rateLimiter = async (req, res, next) => {
    try {
        const identifier = req.ip || "anonymous";

        const { success } = await ratelimit.limit(identifier);

        if (!success) {
            return res.status(429).json({
                message: "Too many requests. Please try again later."
            });
        }

        next();

    } catch (error) {
        console.error("Rate limit error:", error);
        next(error);
    }
};

export default rateLimiter;