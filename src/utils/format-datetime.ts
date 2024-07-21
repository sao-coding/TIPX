import dayjs from 'dayjs'

const formatDatetime = (type: string, datetime: string | Date) => {
  // 全部 為 台北 時區
  const date = dayjs(datetime).locale('zh-tw')

  switch (type) {
    case 'weather':
      return date.format('YYYY-MM-DDT00:00:00')
    case 'birthday':
      if (typeof datetime === 'string') {
        let year = datetime.slice(0, 3)
        if (year[0] === '0') {
          year = year.slice(1)
        }
        const month = datetime.slice(3, 5)
        const day = datetime.slice(5, 7)

        return `${year}-${month}-${day}`
      } else {
        return 'YYYY-MM-DD'
      }
    case 'leave':
      if (typeof datetime === 'string') {
        let year = datetime.slice(0, 3)
        if (year[0] === '0') {
          year = year.slice(1)
        }
        const month = datetime.slice(3, 5)
        const day = datetime.slice(5, 7)
        const week = datetime.slice(8, 9)
        return `${year}-${month}-${day} (${week})`
      } else {
        return 'YYYY-MM-DD'
      }
    case 'hw':
      return date.format('YYYY-MM-DD HH:mm')
    case 'date':
      return date.format('YYYY-MM-DD')
    case 'time':
      return date.format('HH:mm:ss')
    case 'datetime':
      return date.format('YYYY-MM-DD HH:mm:ss')
    default:
      return date.format('YYYY-MM-DD HH:mm:ss')
  }
}

export default formatDatetime
