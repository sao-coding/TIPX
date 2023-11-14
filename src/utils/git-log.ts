import fs from "fs"
import path from "path"

const getGitLog = async () => {
    // 讀取檔案
    // /app/src/data/git-log.json
    const commits = JSON.parse(
        await fs.readFileSync(process.cwd() + "/app/src/data/git-log.json", "utf8")
    )
    return commits
}

export default getGitLog
