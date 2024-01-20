import { cookies } from "next/headers"

import Card from "@/components/course-attendance-record/card"
// import { useState, useEffect } from "react"
import Title from "@/components/Title"
import { site } from "@/config/site"
import { CourseAttendanceRecord } from "@/types"

const getData = async () => {
  const res = await fetch(`${site.url}/api/course-attendance-record`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString()
    }
  })

  if (!res.ok) {
    throw new Error("獲取資料失敗")
  }

  return await res.json()
}

const CourseAttendanceRecordPage = async () => {
  const data: CourseAttendanceRecord = await getData()
  const title = {
    title: "請假缺曠記錄",
    position: "text-center",
    close: true
  }
  // 只顯示曠課，事假，病假，生理假，公假，喪假
  const leaveType = ["曠課", "事假", "病假", "生理假", "公假", "喪假"]
  return (
    <>
      <div className='mb-2 w-full px-2'>
        <Title title={title} />
        {data?.list?.length > 0 ? (
          <>
            <div className='mb-2 grid grid-cols-2 gap-2'>
              {data?.total.map((item, index) => {
                if (leaveType.includes(item.type)) {
                  return (
                    <div key={index} className='rounded-xl border bg-background p-2'>
                      <div>{item.type}</div>
                      <div className='w-full text-right text-lg font-bold'>{item.count}</div>
                    </div>
                  )
                }
              })}
            </div>
            <div className='sticky left-0 top-0 mb-2 rounded-xl border bg-background p-2 md:top-[68px]'>
              <div>總計</div>
              <div className='w-full text-right text-lg font-bold'>
                {data?.total.reduce((a, b) => a + b.count, 0)}
              </div>
            </div>
            {data?.list?.map((item, index) => <Card key={index} data={item} />)}
          </>
        ) : (
          <div className='text-center text-2xl'>沒有請假</div>
        )}
      </div>
    </>
  )
}

export default CourseAttendanceRecordPage
