import gitLog from "git-log"
import fs from "fs"
import path from "path"

const commits = await gitLog()
// 寫入檔案 至 src/cofig/git-log.json
console.log("commits", commits)
fs.writeFileSync(
    path.resolve(__dirname, "../config/git-log.json"),
    JSON.stringify(commits, null, 2)
)
