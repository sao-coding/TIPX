"use client"

import * as Dialog from "@radix-ui/react-dialog"
import {
    IconX,
    IconIdBadge,
    IconLock,
    IconDeviceMobile,
    IconCake,
    IconSchool,
} from "@tabler/icons-react"
import toCopy from "@/utils/copy"
import formatDatetime from "@/utils/format-datetime"
import Copy from "@/components/Copy"
import Location from "./location"
import { student } from "@prisma/client"

const Info = ({ student }: { student: student }) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger className='bg-blue-500 text-white px-2 rounded-md -mr-2'>
                查詢
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm data-[state=open]:animate-overlayShow' />

                <Dialog.Content className='flex flex-col gap-2 fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[90vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg outline-none data-[state=open]:animate-contentShow'>
                    <div className='flex items-center justify-between'>
                        <Dialog.Title>學生資訊</Dialog.Title>
                        <Dialog.Close className='rounded-full p-1 hover:bg-gray-200'>
                            <IconX />
                        </Dialog.Close>
                    </div>
                    <div className='flex flex-wrap justify-between'>
                        <div>
                            <button
                                className='flex items-center space-x-1 bg-main-color-1 rounded-xl p-2 mt-2'
                                onClick={(e) => toCopy(e)}
                            >
                                <IconIdBadge />
                                <span>{student.userid}</span>
                            </button>
                        </div>
                        <div>
                            <button
                                className='flex items-center space-x-1 bg-main-color-1 rounded-xl p-2 mt-2'
                                onClick={(e) => toCopy(e)}
                            >
                                <IconLock />
                                <div>{student.password}</div>
                            </button>
                        </div>
                    </div>
                    <Location userid={student.userid} />
                    <div className='rounded-xl border p-2'>
                        <div className='flex items-center space-x-1'>
                            <IconDeviceMobile />
                            <div>{student.phone}</div>
                            <Copy />
                        </div>
                        <div className='flex items-center space-x-1'>
                            <IconCake />
                            {student.birthday ? (
                                <>
                                    <div>{formatDatetime(student.birthday, "birthday")}</div>
                                    <Copy />
                                </>
                            ) : (
                                <div className='text-gray-400'>未填寫生日</div>
                            )}
                        </div>
                        <div className='flex items-center space-x-1'>
                            <IconSchool />
                            <div>{student.previousEducation}</div>
                        </div>
                    </div>
                    <div className='flex-1 w-full overflow-y-auto rounded-xl border p-2'>
                        <div className='whitespace-pre-line break-words'>
                            {/* 減去 \n, \r, \t, \v, \f, \0, \b, \u2028, \u2029 等空白字元 後沒有內容 */}
                            {student.desc.replace(/[\s\u2028\u2029]+/g, "").length === 0 ? (
                                <div className='text-gray-400'>無資料</div>
                            ) : (
                                <>{student.desc}</>
                            )}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default Info
