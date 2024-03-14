import { JSDOM } from "jsdom"

const getUserDesc = async (userid: string) => {
  const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_data_selfrpt.php", {
    headers: {
      cookie: `cookie_rgno=${userid}; cookie_userid=${userid};`,
      Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
    }
  })
  const buffer = await res.arrayBuffer()
  let html = new TextDecoder("big5").decode(buffer)
  const dom = new JSDOM(html)
  const document = dom.window.document

  const desc =
    document.querySelector("body")?.textContent?.split("姓名:  ")[1].replace("\n\n", "") ?? ""

  return desc
}

export default getUserDesc
