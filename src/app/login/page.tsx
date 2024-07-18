"use client"
import * as React from "react"
import clsx from "clsx"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import Login from "@/components/login"
import Logo from "@/components/logo"
// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Announcement, Log } from "@/types"
import { IconCalendarTime, IconCategory, IconPinFilled } from "@tabler/icons-react"
// import { useQuery } from "@tanstack/react-query"

const HomePage = () => {
  const [data, setData] = React.useState<Announcement[]>([])

  // https://tipx.sao-x.com/api/post?type=all&page=1&limit=10

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://tipx.sao-x.com/api/post?type=all&page=1&limit=20")
      const data = await response.json()
      setData(data)
    }
    fetchData()
  }, [])

  // const {
  //   isLoading,
  //   isError,
  //   data: haha
  // } = useQuery<Log>({
  //   queryKey: ["post"],
  //   queryFn: async () => {
  //     const res = await fetch(`/api/post?type=one&id`)
  //     const json = await res.json()
  //     // error
  //     if (!res.ok) throw new Error("沒有這篇公告")
  //     return json
  //   }
  // })

  const chartData = [
    { day: "7/18", user_active: 0 },
    { day: "7/17", user_active: 3 },
    { day: "7/16", user_active: 37 },
    { day: "7/15", user_active: 0 },
    { day: "7/14", user_active: 2 },
    { day: "7/13", user_active: 25 },
    { day: "7/12", user_active: 13 }
  ]

  const chartConfig = {
    user_active: {
      label: "活躍人數",
      color: "hsl(var(--chart-1))"
    }
  } satisfies ChartConfig

  return (
    <div className='min-h-screen'>
      <div className='fixed left-0 top-0 h-screen w-screen bg-slate-900'></div>
      <div className='shape1 fixed left-0 top-0 h-screen w-screen bg-gradient-to-br from-primary to-amber-500'></div>
      <div className='shape2 fixed right-0 top-0 h-screen w-screen bg-gradient-to-br from-primary to-amber-500 opacity-50'></div>
      <div className='relative mx-auto mb-4 w-11/12 space-y-4 pt-32 sm:w-[400px] lg:ml-24 lg:max-w-lg'>
        <Card className='w-full'>
          <CardHeader className='text-center'>
            <CardTitle className='my-4'>
              <Logo className='h-10 w-full' />
            </CardTitle>
            <CardDescription>學生資訊系統</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <button className='w-full rounded-full bg-primary px-2 py-1'>登入</button>
              </DialogTrigger>
              <DialogContent className='w-4/5 max-w-[425px] rounded-lg'>
                <DialogHeader>
                  <DialogTitle>TIPX</DialogTitle>
                  <DialogDescription>登入以繼續使用TIPX</DialogDescription>
                </DialogHeader>
                <Login />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        <div className='flex space-x-4'>
          <Card className='w-1/2'>
            <CardHeader>
              <CardDescription>使用者</CardDescription>
              <CardTitle>75</CardTitle>
            </CardHeader>
          </Card>
          <Card className='w-1/2'>
            <CardHeader>
              <CardDescription>今日登入</CardDescription>
              <CardTitle>17</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Card className='w-full'>
          <CardHeader>
            <ChartContainer config={chartConfig} className='min-h-[200px] w-full'>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='day'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey='user_active' fill='var(--color-user_active)' radius={4} />
              </BarChart>
            </ChartContainer>
          </CardHeader>
        </Card>
      </div>
      <div className='relative bottom-0 right-0 top-0 mx-auto mb-4 w-11/12 sm:w-[400px] lg:fixed lg:right-16 lg:w-[450px] lg:py-32'>
        <div className='flex h-96 flex-col rounded-lg bg-card md:h-[50vh] lg:h-full'>
          <div className='border-b p-6 text-2xl font-semibold leading-none tracking-tight'>
            學校公告
          </div>
          <div className='space-y-2 overflow-auto px-6 py-2'>
            {data.map((item, i) => (
              <React.Fragment key={item.id}>
                <div className='relative p-2'>
                  <h1 className='mr-8 line-clamp-1'>{item.title}</h1>
                  <div
                    className={clsx(
                      "absolute right-0 top-0 rounded-full p-2 text-red-500",
                      item.sticky ? "block" : "hidden"
                    )}
                  >
                    {item.sticky ? <IconPinFilled size={20} /> : ""}
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                      <IconCategory size={20} />
                      {item.category}
                    </div>
                    <div className='flex items-center gap-1'>
                      <IconCalendarTime size={20} />
                      {item.date}
                    </div>
                  </div>
                </div>
                {i !== data.length - 1 && <hr />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
