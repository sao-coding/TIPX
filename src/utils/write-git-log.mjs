import fs from "fs"
import gitLog from "git-log"
import path from "path"
import { fileURLToPath } from "url"

const commits = await gitLog()
// 寫入檔案 至 src/cofig/git-log.json
// console.log("commits", commits)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
fs.writeFileSync(path.resolve(__dirname, "../data/git-log.json"), JSON.stringify(commits, null, 2))
