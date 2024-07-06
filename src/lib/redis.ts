import Redis from "ioredis"

let errorOccurred = false

// 設置 lazyConnect 為 true，這樣當我們啟動應用程序時，不會立即連接到 Redis 服務器，而是在需要時才連接。
const redis = new Redis(process.env.REDIS_URL!, {
  lazyConnect: true
})
console.log("🔌 Connecting to Redis server...", process.env.REDIS_URL)
redis.on("error", (error) => {
  if (!errorOccurred) {
    console.error(`❌ Failed to connect to Redis server ${process.env.REDIS_URL}: ${error.message}`)
    errorOccurred = true
  }
})

redis.on("connect", () => {
  console.log("✅ Redis Connected Successfully")
})

export default redis
