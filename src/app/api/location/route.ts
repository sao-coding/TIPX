import { NextRequest, NextResponse } from "next/server"
import formatDatetime from "@/utils/format-datetime"
import { Location } from "@/types"

export const dynamic = "force-dynamic"

export const GET = async (req: NextRequest) => {
    const lat = req.nextUrl.searchParams.get("lat") ?? "25.087694"
    const lng = req.nextUrl.searchParams.get("lng") ?? "121.566483"
    const url = new URL("https://api.opencagedata.com/geocode/v1/json")
    const params = new URLSearchParams({
        q: `${lat}+${lng}`,
        key: "dbd4f61147d542c681e1639e5f49a0d1",
        language: "zh-TW",
        pretty: "1",
        no_annotations: "1",
    })

    // 返回目前縣市代號
    url.search = params.toString()
    const res = await fetch(url.toString())
    const data = await res.json()

    const locationData: Location = data.results[0].components

    const location = {
        city: locationData.city,
        suburb: locationData.suburb,
    }

    return NextResponse.json(location)
}
