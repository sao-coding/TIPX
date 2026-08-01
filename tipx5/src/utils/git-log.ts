import fs from 'fs'
import { Commit } from 'git-log'
import path from 'path'

const getGitLog = async (limit?: string) => {
  // 讀取檔案
  // /app/src/data/git-log.json
  const commits = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/data/git-log.json'), 'utf-8')
  )

  if (limit) {
    console.log('limit', limit)
    // 排除提交訊息是 ✅ 更新 日誌
    // 排除跟上一個 commit 一樣的訊息
    return commits
      .filter((commit: Commit, index: number) => {
        if (commit.subject.includes('✅ 更新 日誌')) return false
        if (index === 0) return true
        return commit.subject !== commits[index - 1].subject
      })
      .slice(0, parseInt(limit))
  }
  return commits
}

export default getGitLog
