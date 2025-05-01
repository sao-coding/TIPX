import * as cheerio from 'cheerio'

const getClassName = async (userid: string) => {
  const res = await fetch('https://netinfo.takming.edu.tw/tip/newstu_sys/stu_main.php', {
    headers: {
      cookie: `cookie_userid=${userid}; cookie_rgno=${userid};`,
      Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
    }
  })

  const buffer = await res.arrayBuffer()
  const html = new TextDecoder('big5').decode(buffer)

  return {
    class: cheerio.load(html)('#form1 > table > tbody > tr:nth-child(6) > td:nth-child(4)').text()
  }
}

export default getClassName
