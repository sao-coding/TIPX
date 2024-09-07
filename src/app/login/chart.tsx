'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { IconLoader2 } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

const Chart = () => {
  type ChartData = {
    day: string
    user_active: number
  }

  const {
    isLoading,
    isError,
    data: chartData
  } = useQuery<ChartData[]>({
    queryKey: ['login-chart'],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?type=chart`)
      const data = await res.json()
      // error
      if (!res.ok) throw new Error('沒有這篇公告')
      return data
    }
  })

  const chartConfig = {
    user_active: {
      label: '活躍人數',
      color: 'hsl(var(--chart-1))'
    }
  } satisfies ChartConfig

  return (
    // https://blog.csdn.net/pzy_666/article/details/122819974
    // 父元素设置了min-height, 子元素设置height:100%无效
    <div className='flex'>
      <div className='min-h-[200px] w-full'>
        {isLoading ? (
          // 置中
          <div className='flex h-full w-full items-center'>
            <IconLoader2 className='mx-auto h-10 w-10 animate-spin' />
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
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
        )}
      </div>
    </div>
  )
}

export default Chart
