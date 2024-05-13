import Redis from "ioredis"

let errorOccurred = false

const redis = new Redis(process.env.REDIS_URL!)
console.log("🔌 Connecting to Redis server...", process.env.REDIS_URL)
redis.on("error", (error) => {
  if (!errorOccurred) {
    console.error(`❌ Failed to connect to Redis server: ${error.message}`)
    errorOccurred = true
  }
})

redis.on("connect", () => {
  console.log("✅ Redis Connected Successfully")
})

export default redis
