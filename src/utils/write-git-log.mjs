import gitLog from "git-log"
// 使用 fs
import fs from "fs"
const commits = await gitLog()
// 寫入檔案 至 src/cofig/git-log.json
console.log("commits", commits)
fs.writeFileSync("./src/config/git-log.json", JSON.stringify(commits))
