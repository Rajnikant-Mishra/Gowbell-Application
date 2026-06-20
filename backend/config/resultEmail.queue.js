import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const resultEmailQueue = new Queue("result-email", {
  connection: redisConnection,
});