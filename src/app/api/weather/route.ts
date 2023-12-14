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

    //     {
    //     "success": "true",
    //     "result": {
    //         "fields": [
    //             {
    //                 "id": "contentDescription",
    //                 "type": "String"
    //             },
    //             {
    //                 "id": "datasetDescription",
    //                 "type": "String"
    //             },
    //             {
    //                 "id": "locationsName",
    //                 "type": "String"
    //             },
    //             {
    //                 "id": "dataid",
    //                 "type": "String"
    //             },
    //             {
    //                 "id": "locationName",
    //                 "type": "String"
    //             },
    //             {
    //                 "id": "geocode",
    //                 "type": "Double"
    //             },
    //             {
    //                 "id": "lat",
    //                 "type": "Double"
    //             },
    //             {
    //                 "id": "lon",
    //                 "type": "Double"
    //             },
    //             {
    //                 "id": "elementName",
    //                 "type": "String"
    //             },
    //             {
    //                 "id": "description",
    //                 "type": "String"
    //             },
    //             {
    //                 "id": "startTime",
    //                 "type": "Timestamp"
    //             },
    //             {
    //                 "id": "endTime",
    //                 "type": "Timestamp"
    //             },
    //             {
    //                 "id": "dataTime",
    //                 "type": "Timestamp"
    //             },
    //             {
    //                 "id": "value",
    //                 "type": "String"
    //             },
    //             {
    //                 "id": "measures",
    //                 "type": "String"
    //             }
    //         ]
    //     },
    //     "records": {
    //         "locations": [
    //             {
    //                 "datasetDescription": "臺灣各縣市鄉鎮未來1週逐12小時天氣預報",
    //                 "locationsName": "臺北市",
    //                 "dataid": "D0047-063",
    //                 "location": [
    //                     {
    //                         "locationName": "內湖區",
    //                         "geocode": "63000100",
    //                         "lat": "25.071182",
    //                         "lon": "121.58069",
    //                         "weatherElement": [
    //                             {
    //                                 "elementName": "PoP12h",
    //                                 "description": "12小時降雨機率",
    //                                 "time": [
    //                                     {
    //                                         "startTime": "2023-12-14 00:00:00",
    //                                         "endTime": "2023-12-14 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "0",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-14 06:00:00",
    //                                         "endTime": "2023-12-14 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "0",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-14 18:00:00",
    //                                         "endTime": "2023-12-15 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "0",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-15 06:00:00",
    //                                         "endTime": "2023-12-15 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "0",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-15 18:00:00",
    //                                         "endTime": "2023-12-16 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "30",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-16 06:00:00",
    //                                         "endTime": "2023-12-16 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "90",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-16 18:00:00",
    //                                         "endTime": "2023-12-17 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "80",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-17 06:00:00",
    //                                         "endTime": "2023-12-17 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": " ",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-17 18:00:00",
    //                                         "endTime": "2023-12-18 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": " ",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-18 06:00:00",
    //                                         "endTime": "2023-12-18 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": " ",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-18 18:00:00",
    //                                         "endTime": "2023-12-19 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": " ",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-19 06:00:00",
    //                                         "endTime": "2023-12-19 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": " ",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-19 18:00:00",
    //                                         "endTime": "2023-12-20 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": " ",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-20 06:00:00",
    //                                         "endTime": "2023-12-20 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": " ",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-20 18:00:00",
    //                                         "endTime": "2023-12-21 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": " ",
    //                                                 "measures": "百分比"
    //                                             }
    //                                         ]
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "elementName": "Wx",
    //                                 "description": "天氣現象",
    //                                 "time": [
    //                                     {
    //                                         "startTime": "2023-12-14 00:00:00",
    //                                         "endTime": "2023-12-14 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "晴時多雲",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "02",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-14 06:00:00",
    //                                         "endTime": "2023-12-14 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "晴時多雲",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "02",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-14 18:00:00",
    //                                         "endTime": "2023-12-15 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "晴時多雲",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "02",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-15 06:00:00",
    //                                         "endTime": "2023-12-15 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "晴時多雲",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "02",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-15 18:00:00",
    //                                         "endTime": "2023-12-16 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "多雲短暫雨",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "08",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-16 06:00:00",
    //                                         "endTime": "2023-12-16 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "陰短暫雨",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "11",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-16 18:00:00",
    //                                         "endTime": "2023-12-17 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "陰短暫雨",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "11",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-17 06:00:00",
    //                                         "endTime": "2023-12-17 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "陰短暫雨",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "11",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-17 18:00:00",
    //                                         "endTime": "2023-12-18 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "陰時多雲短暫雨",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "10",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-18 06:00:00",
    //                                         "endTime": "2023-12-18 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "多雲短暫雨",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "08",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-18 18:00:00",
    //                                         "endTime": "2023-12-19 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "晴時多雲",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "02",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-19 06:00:00",
    //                                         "endTime": "2023-12-19 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "多雲時陰短暫雨",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "09",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-19 18:00:00",
    //                                         "endTime": "2023-12-20 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "陰短暫雨",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "11",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-20 06:00:00",
    //                                         "endTime": "2023-12-20 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "陰短暫雨",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "11",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-20 18:00:00",
    //                                         "endTime": "2023-12-21 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "陰時多雲",
    //                                                 "measures": "自定義 Wx 文字"
    //                                             },
    //                                             {
    //                                                 "value": "06",
    //                                                 "measures": "自定義 Wx 單位"
    //                                             }
    //                                         ]
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "elementName": "MinT",
    //                                 "description": "最低溫度",
    //                                 "time": [
    //                                     {
    //                                         "startTime": "2023-12-14 00:00:00",
    //                                         "endTime": "2023-12-14 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "20",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-14 06:00:00",
    //                                         "endTime": "2023-12-14 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "20",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-14 18:00:00",
    //                                         "endTime": "2023-12-15 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "20",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-15 06:00:00",
    //                                         "endTime": "2023-12-15 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "20",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-15 18:00:00",
    //                                         "endTime": "2023-12-16 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "18",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-16 06:00:00",
    //                                         "endTime": "2023-12-16 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "14",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-16 18:00:00",
    //                                         "endTime": "2023-12-17 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "13",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-17 06:00:00",
    //                                         "endTime": "2023-12-17 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "13",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-17 18:00:00",
    //                                         "endTime": "2023-12-18 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "14",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-18 06:00:00",
    //                                         "endTime": "2023-12-18 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "14",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-18 18:00:00",
    //                                         "endTime": "2023-12-19 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "18",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-19 06:00:00",
    //                                         "endTime": "2023-12-19 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "17",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-19 18:00:00",
    //                                         "endTime": "2023-12-20 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "15",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-20 06:00:00",
    //                                         "endTime": "2023-12-20 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "11",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-20 18:00:00",
    //                                         "endTime": "2023-12-21 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "11",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "elementName": "MaxT",
    //                                 "description": "最高溫度",
    //                                 "time": [
    //                                     {
    //                                         "startTime": "2023-12-14 00:00:00",
    //                                         "endTime": "2023-12-14 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "21",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-14 06:00:00",
    //                                         "endTime": "2023-12-14 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "29",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-14 18:00:00",
    //                                         "endTime": "2023-12-15 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "23",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-15 06:00:00",
    //                                         "endTime": "2023-12-15 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "28",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-15 18:00:00",
    //                                         "endTime": "2023-12-16 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "22",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-16 06:00:00",
    //                                         "endTime": "2023-12-16 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "18",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-16 18:00:00",
    //                                         "endTime": "2023-12-17 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "14",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-17 06:00:00",
    //                                         "endTime": "2023-12-17 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "14",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-17 18:00:00",
    //                                         "endTime": "2023-12-18 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "14",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-18 06:00:00",
    //                                         "endTime": "2023-12-18 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "21",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-18 18:00:00",
    //                                         "endTime": "2023-12-19 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "19",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-19 06:00:00",
    //                                         "endTime": "2023-12-19 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "19",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-19 18:00:00",
    //                                         "endTime": "2023-12-20 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "17",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-20 06:00:00",
    //                                         "endTime": "2023-12-20 18:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "15",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     },
    //                                     {
    //                                         "startTime": "2023-12-20 18:00:00",
    //                                         "endTime": "2023-12-21 06:00:00",
    //                                         "elementValue": [
    //                                             {
    //                                                 "value": "11",
    //                                                 "measures": "攝氏度"
    //                                             }
    //                                         ]
    //                                     }
    //                                 ]
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // }

    // 取得今天日期的資料 xxxx-xx-xx
    const today = new Date()
        .toLocaleString("zh-TW", {
            timeZone: "Asia/Taipei",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        .replace(/\//g, "-")

    console.log(today)

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
                time,
            }
        }
    })

    console.log(todayData)

    return NextResponse.json(todayData)
}
