import { NextRequest, NextResponse } from "next/server"
import formatDatetime from "@/utils/format-datetime"
import { Weather } from "@/types"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
    const today = new Date(new Date().toISOString())
    const todayFormat = formatDatetime(today, "weather")
    const tomorrowFormat = formatDatetime(new Date(today.setDate(today.getDate() + 1)), "weather")
    const url = new URL("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-093")
    const params = new URLSearchParams({
        Authorization: "CWB-B2DD23C3-AAB7-4A12-A50C-2FB1EE813769",
        locationId: "F-D0047-063",
        locationName: "內湖區",
        elementName: "MinT,MaxT,PoP12h,Wx",
        timeFrom: todayFormat,
        timeTo: tomorrowFormat,
    })

    url.search = params.toString()

    const res = await fetch(url.toString())
    const data = await res.json()

    const weatherData = data.records.locations[0].location[0].weatherElement.map(
        (item: Weather) => {
            const time = item.time.map((item) => {
                return {
                    startTime: item.startTime,
                    endTime: item.endTime,
                    elementValue: item.elementValue,
                }
            })

            return {
                elementName: item.elementName,
                description: item.description,
                time,
            }
        }
    )

    return NextResponse.json(weatherData, {
        headers: {
            "Cache-Control": "s-maxage=60, stale-while-revalidate",
        },
    })
}
