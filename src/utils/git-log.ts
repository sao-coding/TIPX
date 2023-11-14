import { promises as fs } from "fs"

const getGitLog = async () => {
    // 讀取檔案
    // /app/src/data/git-log.json
    const commits = JSON.parse(await fs.readFile(process.cwd() + "/app/data/git-log.json", "utf8"))
    return commits
}

export default getGitLog
