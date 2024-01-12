"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { IconTemperature, IconCloudRain, IconLoader2 } from "@tabler/icons-react"
import formatDatetime from "@/utils/format-datetime"
import { Weather } from "@/types"

const Weather = () => {
    const fetchWeather = async (city: string, location: string) => {
        const res = await fetch(
            `/api/weather?date=${formatDatetime(
                new Date(),
                "weather"
            )}&city=${city}&location=${location}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )

        const data = await res.json()

        return data
    }
    const [location, setLocation] = useState("")
    const { isLoading, data } = useQuery<Weather[]>({
        queryKey: ["weather"],
        queryFn: async () => {
            let city = "臺北市"
            let location = "內湖區"
            let data
            if (localStorage.getItem("location") === "true") {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude

                    const locationRes = await fetch(`/api/location?lat=${lat}&lng=${lng}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })

                    const locationData = await locationRes.json()
                    city = locationData.city
                    location = locationData.suburb
                    setLocation(locationData.suburb)

                    data = await fetchWeather(city, location)
                })
                data = await fetchWeather(city, location)
            } else {
                data = await fetchWeather(city, location)
            }
            return data
        },
        refetchOnWindowFocus: false,
    })

    const nowTime = (type: string) => {
        // xxxx-xx-xx xx:xx:xx
        const today = new Date()
            .toLocaleString("zh-TW", {
                timeZone: "Asia/Taipei",
                hour12: false,
            })
            .replace(/\//g, "-")
        // const today = "2023-12-14 1:00:00"

        // console.log("today", today)
        // type 等於 data 的 elementName 時，today 等於 data 的 time 的 startTime ~ endTime 之間 回傳 index

        let indexValue = 0
        data?.map((item) => {
            if (item.elementName === type) {
                // console.log("item", item)
                item.time.map((time, index) => {
                    // console.log("time", time)
                    if (today >= time.startTime && today <= time.endTime) {
                        // console.log("index", index)
                        indexValue = index
                    }
                })
            }
        })
        // console.log("index", indexValue)
        return indexValue
    }

    return (
        <div className='w-full rounded-xl p-2 bg-main-color-1 md:border md:bg-transparent'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                    <IconTemperature className='text-red-500' />
                    <div className='text-2xl font-bold flex items-center'>
                        {isLoading ? (
                            <IconLoader2 className='mx-1 animate-spin' />
                        ) : (
                            <>
                                {data?.map((item) => {
                                    if (item.elementName === "MaxT") {
                                        return (
                                            <div key={item.elementName} className='ml-1'>
                                                {item.time[nowTime("MaxT")].elementValue[0].value}
                                            </div>
                                        )
                                    }
                                })}
                            </>
                        )}
                        /
                        {isLoading ? (
                            <IconLoader2 className='mx-1 animate-spin' />
                        ) : (
                            <>
                                {data?.map((item) => {
                                    if (item.elementName === "MinT") {
                                        return (
                                            <div key={item.elementName}>
                                                {item.time[nowTime("MinT")].elementValue[0].value}
                                            </div>
                                        )
                                    }
                                })}
                            </>
                        )}
                    </div>
                    <div>°C</div>
                    {/* 體感溫度 最低 最高 */}
                    <div className='ml-2 text-xs text-gray-400'>
                        {isLoading ? (
                            <IconLoader2 size={16} className='mx-1 animate-spin' />
                        ) : (
                            <>
                                {data?.map((item) => {
                                    if (item.elementName === "MaxAT") {
                                        return (
                                            <div key={item.elementName}>
                                                {item.time[nowTime("MaxAT")].elementValue[0].value}
                                            </div>
                                        )
                                    }
                                })}
                            </>
                        )}
                    </div>
                    <div className='text-xs text-gray-400'>/</div>
                    <div className='text-xs text-gray-400'>
                        {isLoading ? (
                            <IconLoader2 size={16} className='mx-1 animate-spin' />
                        ) : (
                            <>
                                {data?.map((item) => {
                                    if (item.elementName === "MinAT") {
                                        return (
                                            <div key={item.elementName}>
                                                {item.time[nowTime("MinAT")].elementValue[0].value}
                                            </div>
                                        )
                                    }
                                })}
                            </>
                        )}
                    </div>
                    <div className='text-xs text-gray-400'>°C</div>
                </div>
                <div className='ml-auto'>
                    <div className='text-xs text-gray-400'>
                        {isLoading ? "更新中" : "更新於 " + new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
            <div className='flex items-center'>
                <div className='flex items-center'>
                    {/* 降雨機率 */}
                    <IconCloudRain className='text-blue-500' />
                    {isLoading ? (
                        <IconLoader2 className='mx-1 animate-spin' />
                    ) : (
                        <>
                            {data?.map((item) => {
                                if (item.elementName === "PoP12h") {
                                    return (
                                        <div key={item.elementName} className='ml-1'>
                                            {item.time[nowTime("PoP12h")].elementValue[0].value}
                                        </div>
                                    )
                                }
                            })}
                        </>
                    )}
                    <div>%</div>
                </div>
                <div className='ml-auto flex items-center space-x-2'>
                    {/* 目前地區 */}
                    {isLoading ? (
                        <IconLoader2 className='mx-1 animate-spin' />
                    ) : (
                        <div className=''>{location}</div>
                    )}
                    <div className='text-xs text-gray-400'>
                        {/* Wx */}
                        {isLoading ? (
                            <IconLoader2 className='mx-1 animate-spin' />
                        ) : (
                            <>
                                {data?.map((item) => {
                                    if (item.elementName === "Wx") {
                                        return (
                                            <div key={item.elementName}>
                                                {item.time[nowTime("Wx")].elementValue[0].value}
                                            </div>
                                        )
                                    }
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Weather
