"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import toast from "react-hot-toast"
import { IconX } from "@tabler/icons-react"
import { useRollCallVerifyStore } from "@/store/roll-call-verify"

const RollCallVerify = ({ courseID }: { courseID: string }) => {
    const [password, setPassword] = useState("")
    const { setRollCallPassword } = useRollCallVerifyStore()
    const router = useRouter()

    return (
        <Dialog.Root>
            <Dialog.Trigger className='px-1 rounded-lg text-center border ripple mt-1 w-full'>
                點名
            </Dialog.Trigger>
            <Dialog.Overlay className='fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />
            <Dialog.Content className='fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[85vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg focus:outline-none data-[state=open]:animate-contentShow flex flex-col justify-center items-center space-y-2'>
                <Dialog.Title className='text-center text-xl font-bold'>請輸入授權碼</Dialog.Title>
                <Dialog.Description className='flex justify-center'>
                    <input
                        type='password'
                        className='bg-white rounded-lg p-1 h-8 border text-center'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Dialog.Description>
                <Dialog.Close className='absolute top-2 right-2'>
                    <IconX />
                </Dialog.Close>
                <button
                    className='w-20 p-1 rounded-lg text-center border hover:bg-gray-200'
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
                                password,
                            }),
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
