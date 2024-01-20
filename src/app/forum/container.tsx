"use client"

import { useEffect, useRef, useState } from "react"
import { User } from "next-auth"
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter
} from "firebase/firestore"
import { useInView } from "react-intersection-observer"

import LoadingCP from "@/app/forum/loading"
import MessageCP from "@/app/forum/message"
import SendCP from "@/app/forum/send"
import { db } from "@/lib/firebase"
import { useDeleteMessageStore } from "@/store/delete"
import { useEditMessageStore } from "@/store/edit"
import { useReplyMessageStore } from "@/store/reply"
import { Message } from "@/types"
import { IconX } from "@tabler/icons-react"
const Container = ({ user }: { user: User }) => {
  const { editMessage, setEditMessage } = useEditMessageStore()
  const { replyMessage, setReplyMessage, resetReplyMessage } = useReplyMessageStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [noMore, setNoMore] = useState(false)
  const { ref, inView } = useInView({
    delay: 800
  })
  const firstLoadRef = useRef(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const { deleteMessage } = useDeleteMessageStore()

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "forum"), orderBy("timestamp", "desc"), limit(10))
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        setMessages((currentMessages) => {
          const data: Message[] = []

          QuerySnapshot.docChanges().forEach((change) => {
            const doc = change.doc
            const messageData = {
              id: doc.id,
              ...doc.data()
            } as Message

            if (change.type === "added") {
              const existingMessage = currentMessages.find(
                (message) => message.id === messageData.id
              )

              if (!existingMessage) {
                data.push(messageData)
                // 通知訊息
                if (typeof window !== "undefined" && "Notification" in window) {
                  if (
                    Notification.permission === "granted" &&
                    messageData.author.email !== user?.email &&
                    !firstLoadRef.current &&
                    localStorage.getItem("notification") === "true"
                  ) {
                    navigator.serviceWorker.ready.then((registration) => {
                      registration.showNotification(
                        localStorage.getItem("anonymous") === "true"
                          ? "匿名"
                          : messageData.author.username,
                        {
                          body: messageData.content,
                          icon: messageData.author.avatar,
                          vibrate: [200, 100, 200, 100, 200, 100, 200],
                          tag: messageData.id,
                          renotify: true,
                          data: {
                            url: window.location.href
                          },
                          actions: [
                            {
                              action: "open",
                              title: "開啟",
                              icon: "/icons/icon-192x192.png"
                            },
                            {
                              action: "close",
                              title: "關閉",
                              icon: "/icons/icon-192x192.png"
                            }
                          ]
                        }
                      )
                    })
                  }
                }
              }
            } else if (change.type === "modified") {
              // 處理現有訊息的更新
              const existingIndex = currentMessages.findIndex(
                (message) => message.id === messageData.id
              )
              if (existingIndex !== -1) {
                // 更新現有訊息的內容
                currentMessages[existingIndex] = messageData
              }
            } else if (change.type === "removed") {
              // 處理現有訊息的刪除
              const existingIndex = currentMessages.findIndex(
                (message) => message.id === messageData.id
              )
              if (existingIndex !== -1) {
                currentMessages.splice(existingIndex, 1)
              }
            }
          })

          firstLoadRef.current = false
          setLastMessageId(data[data.length - 1]?.id ?? null)
          return [...data, ...currentMessages]
        })
      })

      return () => unsubscribe()
    }
  }, [user])

  useEffect(() => {
    if (inView) {
      console.log("inView", messages[messages.length - 1].timestamp)
      const getMore = async () => {
        const q = query(
          collection(db, "forum"),
          orderBy("timestamp", "desc"),
          startAfter(messages[messages.length - 1].timestamp),
          limit(10)
        )

        const data = await getDocs(q)

        const oldMessages: Message[] = []

        data.forEach((doc) => {
          oldMessages.push({
            id: doc.id,
            ...doc.data()
          } as Message)
        })

        setMessages((currentMessages) => [...currentMessages, ...oldMessages])
        console.log("oldMessages", oldMessages)
        if (oldMessages.length < 10) {
          setNoMore(true)
        }
      }
      console.log("isMouseDown", isMouseDown)
      !isMouseDown && getMore()
    }
  }, [inView, isMouseDown])

  useEffect(() => {
    // 到底部
    containerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [lastMessageId])

  return (
    <>
      <div
        className='flex flex-grow flex-col-reverse overflow-x-hidden overflow-y-scroll px-2'
        ref={containerRef}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
      >
        <div className='flex items-center'>
          {editMessage.status && (
            <div className='flex items-center rounded-lg bg-main-color-2 px-1'>
              <div>編輯訊息</div>
              <IconX
                className='ml-1 cursor-pointer'
                onClick={() => {
                  setEditMessage({
                    id: "",
                    email: "",
                    content: "",
                    status: false
                  })
                }}
              />
            </div>
          )}
          {replyMessage.content && (
            <div className='flex w-full items-center justify-between rounded-lg bg-main-color-2 px-1'>
              <div>
                {replyMessage.author?.anonymous ? (
                  <div className='text-xs text-gray-600'>回覆 匿名</div>
                ) : (
                  <div className='text-xs text-gray-600'>回覆 {replyMessage.author?.username}</div>
                )}
                {replyMessage.content.length > 20
                  ? replyMessage.content.slice(0, 20) + "..."
                  : replyMessage.content}
              </div>
              <IconX
                className='ml-1 cursor-pointer'
                onClick={() => {
                  resetReplyMessage()
                }}
              />
            </div>
          )}
        </div>
        {messages.map((message, i) => {
          if (messages.length === i + 1) {
            return <MessageCP ref={ref} key={message.id} user={user} message={message} />
          }
          return <MessageCP key={message.id} user={user} message={message} />
        })}
        {!noMore &&
          Array.from(Array(6).keys()).map((index) => <LoadingCP key={index} index={index} />)}
      </div>
      <SendCP user={user} />
    </>
  )
}

export default Container
