import { JSDOM } from "jsdom"

import { Conduct } from "@/types"

const getConduct = async (userid: string, year: string, sem: string, type: string) => {
  const conductList: Conduct[] = []

  const conduct: Conduct = {
    year: "",
    sem: "",
    score: 0
  }

  const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_stg04.php", {
    headers: {
      cookie: `cookie_userid=${userid}; cookie_rgno=${userid}; cookie_year=${year}; cookie_sem=${sem}; `,
      Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
    }
  })

  const buffer = await res.arrayBuffer()
  let html = new TextDecoder("big5").decode(buffer)
  const dom = new JSDOM(html)
  const document = dom.window.document
  const rows = Array.from(
    document.querySelectorAll("table[bgcolor='#CCCCCC' ] tr:not(:first-child)")
  )

  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll("td:not(:last-child)"))
    conduct.year = ""
    conduct.sem = ""
    conduct.score = 0
    cells.forEach((cell, index) => {
      const list = cell.textContent
      if (index === 0) {
        conduct.year = list ?? ""
      }
      if (index === 1) {
        conduct.sem = list ?? ""
      }
      if (index === 2) {
        conduct.score = Number(list)
      }
    })
    conductList.push({ ...conduct })
  })

  if (type === "one") {
    let find = false
    for (let i = 0; i < conductList.length; i++) {
      if (conductList[i].year === year && conductList[i].sem === sem) {
        find = true
        return conductList[i]
      }
    }
    if (!find) {
      return {
        year: "",
        sem: "",
        score: 0
      }
    }
  }

  return conductList
}

export default getConduct
