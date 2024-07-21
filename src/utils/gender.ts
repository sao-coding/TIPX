import * as cheerio from 'cheerio'

const getGender = async (userid: string) => {
  const res = await fetch('https://netinfo.takming.edu.tw/tip/newstu_sys/stu_main.php', {
    headers: {
      cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; `,
      Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
    }
  })

  const buffer = await res.arrayBuffer()
  let html = new TextDecoder('big5').decode(buffer)
  const $ = cheerio.load(html)

  // return {
  //   gender:
  //     document.querySelector("#form1 > table > tbody > tr:nth-child(6) > td:nth-child(2)")
  //       ?.textContent ?? ""
  // }
  return {
    gender: $('#form1 > table > tbody > tr:nth-child(6) > td:nth-child(2)').text() ?? ''
  }
}

export default getGender
