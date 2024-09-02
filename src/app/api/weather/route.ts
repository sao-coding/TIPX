import { NextRequest, NextResponse } from 'next/server'

import { Weather } from '@/types'
import formatDatetime from '@/utils/format-datetime'

export const dynamic = 'force-dynamic'

export const GET = async (req: NextRequest) => {
  const cityCode = [
    { city: '宜蘭縣', code: 'F-D0047-003' },
    { city: '桃園市', code: 'F-D0047-007' },
    { city: '新竹縣', code: 'F-D0047-011' },
    { city: '苗栗縣', code: 'F-D0047-015' },
    { city: '彰化縣', code: 'F-D0047-019' },
    { city: '南投縣', code: 'F-D0047-023' },
    { city: '雲林縣', code: 'F-D0047-027' },
    { city: '嘉義縣', code: 'F-D0047-031' },
    { city: '屏東縣', code: 'F-D0047-035' },
    { city: '臺東縣', code: 'F-D0047-039' },
    { city: '花蓮縣', code: 'F-D0047-043' },
    { city: '澎湖縣', code: 'F-D0047-047' },
    { city: '基隆市', code: 'F-D0047-051' },
    { city: '新竹市', code: 'F-D0047-055' },
    { city: '嘉義市', code: 'F-D0047-059' },
    { city: '臺北市', code: 'F-D0047-063' },
    { city: '高雄市', code: 'F-D0047-067' },
    { city: '新北市', code: 'F-D0047-071' },
    { city: '臺中市', code: 'F-D0047-075' },
    { city: '臺南市', code: 'F-D0047-079' },
    { city: '連江縣', code: 'F-D0047-083' },
    { city: '金門縣', code: 'F-D0047-087' }
  ]
  const city =
    cityCode.find((item) => item.city === req.nextUrl.searchParams.get('city'))?.code ||
    'F-D0047-063'
  const location = req.nextUrl.searchParams.get('location') || '內湖區'
  const today =
    req.nextUrl.searchParams.get('date') ??
    formatDatetime(new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' }), 'weather')
  const tomorrow = formatDatetime(
    'weather',
    new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
  ).replace('00:00:00', '00:00:01')
  const url = new URL('https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-093')
  const params = new URLSearchParams({
    Authorization: 'CWB-B2DD23C3-AAB7-4A12-A50C-2FB1EE813769',
    locationId: city,
    locationName: location,
    elementName: 'MinT,MaxT,MinAT,MaxAT,PoP12h,Wx',
    timeFrom: today,
    timeTo: tomorrow
  })

  url.search = params.toString()

  const res = await fetch(url.toString())
  const data = await res.json()

  const weatherData = data.records.locations[0].location[0].weatherElement.map((item: Weather) => {
    const time = item.time.map((item) => {
      return {
        startTime: item.startTime,
        endTime: item.endTime,
        elementValue: item.elementValue
      }
    })
    return {
      elementName: item.elementName,
      description: item.description,
      today,
      tomorrow,
      city,
      location,
      time
    }
  })

  return NextResponse.json(weatherData, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate'
    }
  })
}
