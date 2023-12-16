import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
    // https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-093?Authorization=CWB-B2DD23C3-AAB7-4A12-A50C-2FB1EE813769&locationId=F-D0047-063&locationName=%E5%85%A7%E6%B9%96%E5%8D%80&elementName=MinT,MaxT,PoP12h,Wx

    const url = new URL("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-093")
    const params = new URLSearchParams({
        Authorization: "CWB-B2DD23C3-AAB7-4A12-A50C-2FB1EE813769",
        locationId: "F-D0047-063",
        locationName: "內湖區",
        elementName: "MinT,MaxT,PoP12h,Wx",
    })

    url.search = params.toString()

    const res = await fetch(url.toString())
    const data = await res.json()

    // 取得今天日期的資料 xxxx-xx-xx 時區為台北
    const today = new Date()
        .toLocaleDateString("zh-TW", { timeZone: "Asia/Taipei" })
        .replace(/\//g, "-")

    // 取得今天日期的資料 降雨機率 早,晚 ，天氣現象 早,晚 ，最低溫度 早,晚 ，最高溫度 早,晚 若超過 2筆 以上取最後兩筆
    const todayData = data.records.locations[0].location[0].weatherElement.map((item: any) => {
        const time = item.time.filter((item: any) => {
            return item.startTime.includes(today)
        })

        const timeLength = time.length

        if (timeLength > 2) {
            return {
                elementName: item.elementName,
                description: item.description,
                time: [time[timeLength - 2], time[timeLength - 1]],
            }
        } else {
            return {
                elementName: item.elementName,
                description: item.description,
                today,
                time,
            }
        }
    })

    return NextResponse.json(todayData)
}
