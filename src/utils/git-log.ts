import gitLog from "git-log"

const getGitLog = async () => {
    const commits = await gitLog()
    return commits
}

export default getGitLog
