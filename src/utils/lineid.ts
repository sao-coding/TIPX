import { JSDOM } from "jsdom"

const getLineID = async (userid: string) => {
  const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_setmail.php", {
    headers: {
      cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; `,
      Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
    }
  })

  const buffer = await res.arrayBuffer()
  let html = new TextDecoder("big5").decode(buffer)
  const dom = new JSDOM(html)
  const document = dom.window.document

  return {
    // 移除前後空白:
    lineid:
      document
        .querySelector(
          "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=text]"
        )
        ?.getAttribute("value")
        ?.trim() ?? ""
  }
}

export default getLineID
