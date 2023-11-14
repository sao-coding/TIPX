import fs from "fs"
import path from "path"

const getGitLog = async () => {
    // 讀取檔案
    const commits = JSON.parse(
        fs.readFileSync(path.resolve(process.cwd(), "src/data/git-log.json"), "utf-8")
    )
    return commits
}

export default getGitLog
