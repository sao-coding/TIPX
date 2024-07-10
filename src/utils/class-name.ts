import { JSDOM } from "jsdom"

const getClassName = async (userid: string) => {
  const res = await fetch("https://netinfo.takming.edu.tw/tip/newstu_sys/stu_main.php", {
    headers: {
      cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; `,
      Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
    }
  })

  const buffer = await res.arrayBuffer()
  let html = new TextDecoder("big5").decode(buffer)
  const dom = new JSDOM(html)
  const document = dom.window.document

  let className =
    document.querySelector("#form1 > table > tbody > tr:nth-child(6) > td:nth-child(4)")
      ?.textContent ?? ""

  // 四甲 -> 三甲
  // 三乙 -> 二乙
  // 二丙 -> 一丙
  // 尋找字串 倒數第二個字元 是否為 "四"

  const grade = className.slice(-2, -1)

  // 變更倒數第二個字元
  switch (grade) {
    case "四":
      className = className.slice(0, -2) + "三" + className.slice(-1)
      break
    case "三":
      className = className.slice(0, -2) + "二" + className.slice(-1)
      break
    case "二":
      className = className.slice(0, -2) + "一" + className.slice(-1)
      break
  }

  return {
    class: className
  }
}

export default getClassName
