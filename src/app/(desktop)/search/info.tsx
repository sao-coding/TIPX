'use client'

import Copy from '@/components/ui/copy'
import toCopy from '@/utils/copy'
import formatDatetime from '@/utils/format-datetime'
import { Student } from '@prisma/client'
import * as Dialog from '@radix-ui/react-dialog'
import {
  IconCake,
  IconDeviceMobile,
  IconId,
  IconIdBadge,
  IconLock,
  IconSchool,
  IconX
} from '@tabler/icons-react'

import Location from './location'

const Info = ({ student }: { student: Student }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger className='-mr-2 rounded-md bg-blue-500 px-2 text-white'>查詢</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='data-[state=open]:animate-overlayShow fixed inset-0 z-10 bg-[rgba(0,0,0,.5)] backdrop-blur-sm' />

        <Dialog.Content className='data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 z-10 flex max-h-[85vh] w-[90vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-lg bg-background p-4 shadow-lg outline-none'>
          <div className='flex items-center justify-between'>
            <Dialog.Title>學生資訊</Dialog.Title>
            <Dialog.Close className='rounded-full p-1 hover:bg-gray-200'>
              <IconX />
            </Dialog.Close>
          </div>
          <div className='flex flex-wrap justify-between'>
            <div>
              <button
                className='mt-2 flex items-center space-x-1 rounded-xl bg-background2 p-2'
                onClick={(e) => toCopy(e)}
              >
                <IconIdBadge />
                <span>{student.userId}</span>
              </button>
            </div>
            <div>
              <button
                className='mt-2 flex items-center space-x-1 rounded-xl bg-background2 p-2'
                onClick={(e) => toCopy(e)}
              >
                <IconLock />
                <div>{student.password}</div>
              </button>
            </div>
          </div>
          <Location userid={student.userId} />
          <div className='rounded-xl border p-2'>
            <div className='flex items-center space-x-1'>
              <IconId />
              <div>{student.IDNumber}</div>
              <Copy />
            </div>
            <div className='flex items-center space-x-1'>
              <IconDeviceMobile />
              <div>{student.phone}</div>
              <Copy />
            </div>
            <div className='flex items-center space-x-1'>
              <IconCake />
              {student.birthday ? (
                <>
                  <div>{formatDatetime(student.birthday, 'birthday')}</div>
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
          <div className='w-full flex-1 overflow-y-auto rounded-xl border p-2'>
            <div className='whitespace-pre-line break-words'>
              {/* 減去 \n, \r, \t, \v, \f, \0, \b, \u2028, \u2029 等空白字元 後沒有內容 */}
              {student.desc.replace(/[\s\u2028\u2029]+/g, '').length === 0 ? (
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
