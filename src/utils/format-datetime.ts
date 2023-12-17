import dayjs from "dayjs"

const formatDatetime = (datetime: string | Date, type: string) => {
    // 全部 為 台北 時區
    const date = dayjs(datetime).locale("zh-tw")

    switch (type) {
        case "weather":
            return date.format("YYYY-MM-DDT00:00:00")
        default:
            return date.format("YYYY-MM-DD HH:mm:ss")
    }
}

export default formatDatetime
