"use client"

import { useEffect, useRef, useState } from "react"
import { User } from "next-auth"
import clsx from "clsx"
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore"
import toast, { useToasterStore } from "react-hot-toast"

import { db } from "@/lib/firebase"
import { useEditMessageStore } from "@/store/edit"
import { useReplyMessageStore } from "@/store/reply"
import updateMessage from "@/utils/updateMessage"
import * as Dialog from "@radix-ui/react-dialog"
import * as Switch from "@radix-ui/react-switch"
import { IconBell, IconSend2, IconSettings, IconSpy, IconUser, IconX } from "@tabler/icons-react"
// 卷軸 type

const SendCP = ({ user }: { user: User }) => {
  const [changes, setChanges] = useState(1)
  const [notification, setNotification] = useState(false)
  const [anonymous, setAnonymous] = useState(false)
  const messageRef = useRef<HTMLTextAreaElement | null>(null)

  const { toasts } = useToasterStore()
  const { replyMessage, setReplyMessage, resetReplyMessage } = useReplyMessageStore()
  const { editMessage, setEditMessage } = useEditMessageStore()

  useEffect(() => {
    if (localStorage.getItem("notification") === "true") {
      setNotification(true)
    }
    if (localStorage.getItem("notification") === "false") {
      setNotification(false)
    }
    if (localStorage.getItem("anonymous") === "true") {
      setAnonymous(true)
    }
    if (localStorage.getItem("anonymous") === "false") {
      setAnonymous(false)
    }
  }, [])

  useEffect(() => {
    console.log("回覆模式")
    if (messageRef.current) {
      messageRef.current.value = ""
      messageRef.current.focus()
      setChanges(1)
    }
  }, [replyMessage])

  useEffect(() => {
    console.log("編輯模式")
    if (editMessage.status) {
      if (messageRef.current) {
        // 如果有換行符號
        if (editMessage.content.includes("\n")) {
          // changes
          const count = editMessage.content.split("\n").length
          // 大於 3 就不要增加 三元運算子
          setChanges(count > 3 ? 3 : count)
        } else {
          setChanges(1)
        }
        messageRef.current.value = editMessage.content
      } else {
        toast.error("沒有這個訊息")
      }
    } else {
      if (messageRef.current) {
        messageRef.current.value = ""
        setChanges(1)
      }
    }
  }, [editMessage])

  const TOAST_LIMIT = 2
  // Enforce Limit
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
      .forEach((t) => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) removal without animation
  }, [toasts])

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function (registration) {
          console.log("Service worker 註冊成功", registration.scope)
        })
        .catch(function (error) {
          toast.error("Service worker 註冊失敗")
        })
    }
  }, [])

  const sendMessage = async () => {
    if (messageRef.current) {
      // 如果是一堆空白就不要送出
      if (messageRef.current.value.trim() === "") {
        toast.error("沒有內容")
        return
      }
      // 搜索 firebase 有沒有這個 id
      console.log("編輯模式", editMessage, user.email)
      if (editMessage.status && editMessage.email === user.email) {
        if (messageRef.current.value === editMessage.content) {
          toast.error("沒有變更")
          return
        }
        const docRef = doc(db, "forum", editMessage.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          // 如果有這個 id 就更新
          try {
            await setDoc(docRef, {
              ...docSnap.data(),
              content: messageRef.current.value,
              edited_timestamp: new Date().toISOString()
            })
            updateMessage(editMessage.id, messageRef.current.value)
            messageRef.current.value = ""
            setChanges(1)
            setEditMessage({
              id: "",
              email: "",
              content: "",
              status: false
            })
            console.log("送出編輯訊息", editMessage.id)
            return
          } catch (error) {
            toast.error("發送失敗")
          }
        }
      } else {
        setEditMessage({
          id: "",
          email: "",
          content: "",
          status: false
        })
      }

      if (!editMessage.status) {
        const { name, image, email, studentID } = user
        const data = {
          author: {
            avatar: image,
            stuID: studentID,
            username: name,
            email: email,
            anonymous: anonymous
          },
          content: messageRef.current.value,
          message_reference: replyMessage,
          timestamp: new Date().toISOString(),
          edited_timestamp: "",
          deleted_timestamp: ""
        }

        try {
          console.log("送出訊息", data)
          await addDoc(collection(db, "forum"), data)
          messageRef.current.value = ""
          setChanges(1)
          // // 偵測捲軸自動捲到底部
          // scroll.current.scrollIntoView({ behavior: "smooth" })
          resetReplyMessage()
        } catch (error) {
          toast.error("發送失敗")
          console.log("發送失敗", error)
        }
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 如果是手機版，就不要做任何事情
    // 刪除
    if (event.key === "Backspace") {
      if (changes === 1) return
      setChanges(changes - 1)
    }
    if (window.innerWidth < 768) {
      if (event.key === "Enter") {
        if (changes > 2) return
        setChanges(changes + 1)
      }
    } else {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      } else if (event.key === "Enter" && event.shiftKey) {
        if (changes > 2) return
        setChanges(changes + 1)
      }
    }
  }

  const onNotification = async () => {
    // 開關通知
    if (notification) {
      localStorage.setItem("notification", "false")
      setNotification(false)
    }
    if (!notification) {
      localStorage.setItem("notification", "true")
      setNotification(true)
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("通知訊息", {
          body: "您已開啟通知",
          icon: "/pwa/android-launchericon-192-192.png",
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: "notification",
          renotify: true
        })
      })

      // 註冊通知
      // 是否允許瀏覽器通知
      await Notification.requestPermission()
      if (Notification.permission === "granted") {
        setNotification(true)
      }
      if (Notification.permission === "denied") {
        setNotification(false)
      }
    }
  }

  const onAnonymous = () => {
    // 開關匿名
    if (anonymous) {
      localStorage.setItem("anonymous", "false")
      setAnonymous(false)
    }
    if (!anonymous) {
      localStorage.setItem("anonymous", "true")
      setAnonymous(true)
    }
  }

  return (
    <>
      <div className='flex w-full items-end justify-between bg-background px-4 py-2'>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <div className='flex items-center justify-center p-2'>
              <IconSettings size={25} />
            </div>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />
            <Dialog.Content className='fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[90vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card-background p-4 shadow-lg outline-none data-[state=open]:animate-contentShow'>
              <Dialog.Close className='absolute right-0 flex items-center justify-end pr-4 outline-none'>
                <IconX />
              </Dialog.Close>
              <Dialog.Title asChild>
                <div className='flex items-center justify-center text-lg font-bold'>設定</div>
              </Dialog.Title>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center space-x-2'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-main-color-2'>
                    {user?.image && anonymous === false ? (
                      <img className='rounded-full' src={user?.image} alt='' />
                    ) : (
                      <IconUser />
                    )}
                  </div>
                  <div>{user.email}</div>
                </div>
                <div>{user.name}</div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <IconBell />
                    <div>通知訊息</div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div
                      className={clsx("text-xs", notification ? "text-green-500" : "text-red-500")}
                    >
                      {notification ? "已開啟" : "已關閉"}
                    </div>
                    <Switch.Root
                      className='h-6 w-11 rounded-full bg-black outline-none data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300'
                      defaultChecked={notification}
                      onCheckedChange={onNotification}
                      checked={notification}
                    >
                      <Switch.Thumb className='block h-5 w-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5' />
                    </Switch.Root>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <IconSpy />
                    <div>匿名模式</div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div className={clsx("text-xs", anonymous ? "text-green-500" : "text-red-500")}>
                      {anonymous ? "已開啟" : "已關閉"}
                    </div>
                    <Switch.Root
                      className='h-6 w-11 rounded-full bg-black outline-none data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300'
                      defaultChecked={anonymous}
                      onCheckedChange={onAnonymous}
                    >
                      <Switch.Thumb className='block h-5 w-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5' />
                    </Switch.Root>
                  </div>
                </div>
                <div className='text-xs text-gray-500'>
                  {"註： 匿名模式下，您的大頭貼與姓名將不會顯示在聊天室"}
                  <br />
                  {"註：使用不同裝置匿名設定不會同步"}
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        {/* </div> */}
        <textarea
          className={clsx(
            "h-full w-4/6 border bg-card-background px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-300",
            changes === 1 && "rounded-full",
            changes > 1 && "rounded-xl"
          )}
          rows={changes}
          ref={messageRef}
          onKeyDown={handleKeyDown}
          placeholder={anonymous ? "匿名模式" : "一般模式"}
        />
        <div className='flex items-center'>
          <button className='h-full rounded-md p-2' onClick={sendMessage}>
            {/* 旋轉 icon 45 度 */}
            <IconSend2 size={25} />
          </button>
        </div>
      </div>
    </>
  )
}

export default SendCP
