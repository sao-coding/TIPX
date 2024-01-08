"use client"

import { User } from "next-auth"
import { useEffect, useRef, useState } from "react"
import { IconX } from "@tabler/icons-react"
import {
    query,
    collection,
    getDocs,
    orderBy,
    onSnapshot,
    startAfter,
    limit,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useInView } from "react-intersection-observer"
import MessageCP from "@/app/forum/message"
import LoadingCP from "@/app/forum/loading"
import { Message } from "@/types"
import { useDeleteMessageStore } from "@/store/delete"
import SendCP from "@/app/forum/send"
import { useEditMessageStore } from "@/store/edit"
import { useReplyMessageStore } from "@/store/reply"
const Container = ({ user }: { user: User }) => {
    const { editMessage, setEditMessage } = useEditMessageStore()
    const { replyMessage, setReplyMessage, resetReplyMessage } = useReplyMessageStore()
    const [messages, setMessages] = useState<Message[]>([])
    const [noMore, setNoMore] = useState(false)
    const { ref, inView } = useInView({
        delay: 800,
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
                            ...doc.data(),
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
                                                        url: window.location.href,
                                                    },
                                                    actions: [
                                                        {
                                                            action: "open",
                                                            title: "開啟",
                                                            icon: "/icons/icon-192x192.png",
                                                        },
                                                        {
                                                            action: "close",
                                                            title: "關閉",
                                                            icon: "/icons/icon-192x192.png",
                                                        },
                                                    ],
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
                        ...doc.data(),
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
            behavior: "smooth",
        })
    }, [lastMessageId])

    return (
        <>
            <div
                className='overflow-y-scroll px-2 flex flex-col-reverse overflow-x-hidden flex-grow'
                ref={containerRef}
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
            >
                <div className='flex items-center'>
                    {editMessage.status && (
                        <div className='bg-main-color-2 rounded-lg px-1 flex items-center'>
                            <div>編輯訊息</div>
                            <IconX
                                className='ml-1 cursor-pointer'
                                onClick={() => {
                                    setEditMessage({
                                        id: "",
                                        email: "",
                                        content: "",
                                        status: false,
                                    })
                                }}
                            />
                        </div>
                    )}
                    {replyMessage.content && (
                        <div className='bg-main-color-2 rounded-lg px-1 flex items-center w-full justify-between'>
                            <div>
                                {replyMessage.author?.anonymous ? (
                                    <div className='text-xs text-gray-600'>回覆 匿名</div>
                                ) : (
                                    <div className='text-xs text-gray-600'>
                                        回覆 {replyMessage.author?.username}
                                    </div>
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
                        return (
                            <MessageCP ref={ref} key={message.id} user={user} message={message} />
                        )
                    }
                    return <MessageCP key={message.id} user={user} message={message} />
                })}
                {!noMore &&
                    Array.from(Array(6).keys()).map((index) => (
                        <LoadingCP key={index} index={index} />
                    ))}
            </div>
            <SendCP user={user} />
        </>
    )
}

export default Container
