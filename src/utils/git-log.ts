import fs from "fs"

const getGitLog = async () => {
    // 讀取檔案
    const commits = JSON.parse(fs.readFileSync("./src/config/git-log.json", "utf-8"))
    return commits
}

export default getGitLog
