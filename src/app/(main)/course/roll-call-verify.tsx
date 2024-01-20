"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { useRollCallVerifyStore } from "@/store/roll-call-verify"
import * as Dialog from "@radix-ui/react-dialog"
import { IconX } from "@tabler/icons-react"

const RollCallVerify = ({ courseID }: { courseID: string }) => {
  const [password, setPassword] = useState("")
  const { setRollCallPassword } = useRollCallVerifyStore()
  const router = useRouter()

  return (
    <Dialog.Root>
      <Dialog.Trigger className='ripple mt-1 w-full rounded-lg border py-px text-center'>
        點名
      </Dialog.Trigger>
      <Dialog.Overlay className='fixed inset-0 z-20 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />
      <Dialog.Content className='fixed left-1/2 top-1/2 z-20 flex max-h-[85vh] w-[85vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center space-y-2 rounded-lg bg-card-background p-4 shadow-lg focus:outline-none data-[state=open]:animate-contentShow'>
        <Dialog.Title className='text-center text-xl font-bold'>請輸入授權碼</Dialog.Title>
        <Dialog.Description className='flex justify-center'>
          <input
            type='password'
            className='h-8 rounded-lg border bg-card-background p-1 text-center'
            onChange={(e) => setPassword(e.target.value)}
          />
        </Dialog.Description>
        <Dialog.Close className='absolute right-2 top-2'>
          <IconX />
        </Dialog.Close>
        <button
          className='w-20 rounded-lg border p-1 text-center hover:bg-main-color-3'
          onClick={async () => {
            // if (password === "") {
            //     toast.error("請輸入授權碼")
            //     return
            // }
            // if (password !== "1209") {
            //     toast.error("授權碼錯誤")
            //     return
            // }

            const res = await fetch("/api/roll-call-verify", {
              method: "POST",
              body: JSON.stringify({
                password
              })
            })
            const data = await res.json()

            if (data.status === "error") {
              toast.error("授權碼錯誤")
              return
            } else {
              setRollCallPassword(password)
              router.push(`/course/${courseID}/roll-call`)
            }
          }}
        >
          確認
        </button>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default RollCallVerify
