import React, { useEffect } from "react"
import { User } from "next-auth"
import clsx from "clsx"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { motion } from "framer-motion"

import { db } from "@/lib/firebase"
import { useDeleteMessageStore } from "@/store/delete"
import { useEditMessageStore } from "@/store/edit"
import { useReplyMessageStore } from "@/store/reply"
import { Message } from "@/types"
// import dayjs from "dayjs"
import updateMessage from "@/utils/updateMessage"
import * as Popover from "@radix-ui/react-popover"
import { IconUser } from "@tabler/icons-react"

const Message = React.forwardRef<HTMLDivElement, { user: User; message: Message }>(
  ({ user, message }, ref) => {
    const { replyMessage, setReplyMessage, resetReplyMessage } = useReplyMessageStore()
    const { setEditMessage } = useEditMessageStore()
    const { deleteMessage, setDeleteMessage } = useDeleteMessageStore()

    useEffect(() => {
      const deleteMsg = async () => {
        const docRef = doc(db, "forum", deleteMessage.id)
        const docSnap = await getDoc(docRef)
        const deleteTimestamp = new Date().toISOString()
        if (docSnap.exists()) {
          await setDoc(docRef, {
            ...docSnap.data(),
            deleted_timestamp: deleteTimestamp
          })
          updateMessage(deleteMessage.id, message.content, deleteTimestamp)
        }
      }
      if (deleteMessage.status && deleteMessage.email === user.email) {
        deleteMsg()
        setDeleteMessage({
          id: "",
          email: "",
          status: false
        })
      }
    }, [deleteMessage.status])

    return (
      <div
        ref={ref}
        className={clsx(
          "mb-2 flex flex-col",
          user.email === message.author?.email?.toLowerCase() ? "items-end" : "items-start"
        )}
      >
        <div className='flex items-center px-1 py-1'>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-orange-300'>
            {message.author?.avatar && message.author?.anonymous === false ? (
              <img className='rounded-full' src={message.author.avatar} alt='' />
            ) : (
              <IconUser className='p-1' />
            )}
          </div>

          <div className='ml-1'>
            {message.author?.anonymous ? (
              <div className='text-xs text-gray-400'>匿名</div>
            ) : (
              <div className='text-xs text-gray-400'>{message.author?.username}</div>
            )}
          </div>
        </div>
        {!message.deleted_timestamp && (
          <Popover.Root modal={true}>
            <Popover.Trigger asChild>
              <div className='max-w-xs whitespace-pre-line break-words rounded-2xl border bg-card-background px-2 py-1'>
                {message?.message_reference?.status && (
                  <div className='flex'>
                    <div className='mr-1 w-1 rounded-full bg-slate-700' />
                    <div>
                      <div className='text-xs text-gray-400'>
                        {/* 回覆 {message?.message_reference?.author?.username}{" "} */}
                        回覆{" "}
                        {message?.message_reference?.author?.anonymous
                          ? "匿名"
                          : message?.message_reference?.author?.username}{" "}
                        的訊息
                      </div>
                      <div className=''>
                        {message?.message_reference?.deleted_timestamp === "" ? (
                          <>
                            {
                              // 只顯示10個字 後續用...代替  刪除\n
                              message?.message_reference?.content?.length > 10
                                ? message?.message_reference?.content
                                    ?.slice(0, 10)
                                    .replace(/\n/g, "") + "..."
                                : message?.message_reference?.content?.replace(/\n/g, "")
                            }
                          </>
                        ) : (
                          <div className='text-xs text-red-500'>已刪除訊息</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {message.content}
              </div>
            </Popover.Trigger>
            <Popover.Anchor className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' />
            <Popover.Portal>
              <Popover.Content asChild>
                <motion.div
                  className='w-48 rounded-2xl border bg-background p-2 outline-none'
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.08 }}
                >
                  <Popover.Close asChild>
                    <button
                      className='block w-full rounded-md p-1 text-center outline-none hover:bg-slate-200'
                      onClick={() => {
                        setReplyMessage({
                          id: message.id,
                          author: message.author,
                          content: message.content,
                          timestamp: message.timestamp,
                          edited_timestamp: message.edited_timestamp ?? "",
                          deleted_timestamp: message.deleted_timestamp ?? "",
                          status: true
                        })
                        setEditMessage({
                          id: "",
                          email: "",
                          content: "",
                          status: false
                        })
                      }}
                    >
                      回覆
                    </button>
                  </Popover.Close>
                  {user.email === message.author?.email?.toLowerCase() && (
                    <>
                      <Popover.Close asChild>
                        <button
                          className='block w-full rounded-md p-1 text-center outline-none hover:bg-slate-200'
                          onClick={() => {
                            setEditMessage({
                              id: message.id,
                              email: message.author?.email?.toLowerCase(),
                              content: message.content,
                              status: true
                            })
                            resetReplyMessage()
                          }}
                        >
                          編輯
                        </button>
                      </Popover.Close>
                      <Popover.Close asChild>
                        <button
                          className='block w-full rounded-md p-1 text-center outline-none hover:bg-slate-200'
                          onClick={() => {
                            setDeleteMessage({
                              id: message.id,
                              email: message.author?.email?.toLowerCase(),
                              status: true
                            })
                          }}
                        >
                          刪除
                        </button>
                      </Popover.Close>
                    </>
                  )}
                </motion.div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}
        {message.deleted_timestamp && <div className='text-xs text-red-500'>已刪除訊息</div>}
        <div className='gary-400 text-xs'>
          {message.deleted_timestamp ? (
            new Date(message.deleted_timestamp).toLocaleString("zh-TW", {
              timeZone: "Asia/Taipei"
            }) + " 已刪除"
          ) : (
            <>
              {message.edited_timestamp
                ? new Date(message.edited_timestamp).toLocaleString("zh-TW", {
                    timeZone: "Asia/Taipei"
                  }) + " 已編輯"
                : new Date(message.timestamp).toLocaleString("zh-TW", {
                    timeZone: "Asia/Taipei"
                  })}
            </>
          )}
        </div>
        {/* <div className='text-xs gary-400'>{message.id}</div> */}
        {user.studentID === "D11019139" && (
          <div className='gary-400 text-xs'>{message.author.stuID}</div>
        )}
      </div>
    )
  }
)

Message.displayName = "Message"

export default Message
