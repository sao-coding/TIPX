"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Commit } from "git-log"
import Cookie from "js-cookie"

import * as Dialog from "@radix-ui/react-dialog"
import { IconLoader2, IconX } from "@tabler/icons-react"

const Notify = () => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [gitLog, setGitLog] = React.useState<Commit[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const router = useRouter()

  React.useEffect(() => {
    if (Cookie.get("update-log") !== "false") {
      setOpen(true)
    }
  }, [])

  React.useEffect(() => {
    const fetchData = async () => {
      // 當前日期
      const res = await fetch(`/api/git-log?limit=5`)
      const data: Commit[] = await res.json()
      setGitLog(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  // 已知問題
  const knownIssues = ["班級名單無法正確顯示", "班排名無法正確顯示", "系排名無法正確顯示"]

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Overlay className='fixed inset-0 z-20 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />
      <Dialog.Content className='fixed left-1/2 top-1/2 z-20 max-h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-card-background p-4 shadow-lg focus:outline-none data-[state=open]:animate-contentShow md:max-w-[500px] md:overflow-hidden'>
        <div className='flex items-center justify-between'>
          <Dialog.Title>更新日誌</Dialog.Title>
          {/* 設定一天內不再顯示 */}
          <Dialog.Close onClick={() => Cookie.set("update-log", "false", { expires: 1 })}>
            <IconX />
          </Dialog.Close>
        </div>
        <Dialog.Description>
          <div>
            當前
            <code className='mx-1'>3.0.0</code>
            版本
          </div>
          <div>
            最後更新
            <code className='mx-1'>{new Date(gitLog[0]?.date).toLocaleDateString()}</code>
          </div>
        </Dialog.Description>
        <div className='mt-4 space-y-4'>
          {/* 已知問題 */}
          <div>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>已知問題</h2>
              <Dialog.Close
                className='text-blue-500'
                onClick={() => {
                  Cookie.set("update-log", "false", { expires: 1 })
                  router.push("/forum")
                }}
              >
                查看更多
              </Dialog.Close>
            </div>
            <ul className='list-inside list-disc'>
              {knownIssues.map((item, index) => (
                <li key={index}>💥 {item}</li>
              ))}
            </ul>
          </div>
          {/* 更新日誌 */}
          <div>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>新增&修復</h2>
              <Dialog.Close
                className='text-blue-500'
                onClick={() => {
                  Cookie.set("update-log", "false", { expires: 1 })
                  router.push("/user/git-log")
                }}
              >
                查看更多
              </Dialog.Close>
            </div>

            <ul className='list-inside list-disc'>
              {loading && (
                <div className='flex w-full justify-center'>
                  <IconLoader2 className='h-6 w-6 animate-spin' />
                </div>
              )}
              {gitLog.length > 0 &&
                gitLog.map((item, index) => (
                  <li key={index} className='line-clamp-1'>
                    {item.subject}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default Notify
