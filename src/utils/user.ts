import { JSDOM } from "jsdom"

import { User } from "@/types"

import getUserDesc from "./description"

const getUser = async (userid: string, type?: string) => {
  const infolist: User = {
    userid: "",
    img: "",
    name: "",
    status: "",
    // dept: "",
    // es: "",
    major: "",
    enName: "",
    IDnumber: "",
    gender: "",
    birthday: "",
    birthplace: "",
    address: "",
    phone: "",
    homePhone: "",
    date: "",
    previousEducation: "",
    parentName: "",
    parentAddress: "",
    parentPhone: "",
    parentJob: "",
    desc: ""
  }

  const res = await fetch("https://netinfo.takming.edu.tw/tip/stu_data_new.php", {
    headers: {
      cookie: `cookie_rgno=${userid}; cookie_userid=${userid};`,
      Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php"
    }
  })
  const buffer = await res.arrayBuffer()
  let html = new TextDecoder("big5").decode(buffer)
  const dom = new JSDOM(html)
  const document = dom.window.document

  let noImg = 0

  infolist.userid =
    document.querySelector(
      "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(1)"
    )?.textContent ?? ""
  infolist.img =
    document
      .querySelector(
        "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > img"
      )
      ?.getAttribute("src") ?? ""
  if (infolist.img === "") {
    noImg = 1
  }
  infolist.name =
    document.querySelector(
      "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(2)"
    )?.textContent ?? ""
  infolist.status =
    document.querySelector(
      "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(3)"
    )?.textContent ?? ""
  // infolist.dept =
  //     document.querySelector(
  //         "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(6)"
  //     )?.textContent ?? ""
  // infolist.es =
  //     document.querySelector(
  //         "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(7)"
  //     )?.textContent ?? ""
  infolist.major =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        9 - noImg
      })`
    )?.textContent ?? ""
  infolist.enName =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        12 - noImg
      })`
    )?.textContent ?? ""
  infolist.IDnumber =
    document
      .querySelector(
        `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
          14 - noImg
        })`
      )
      ?.textContent?.replace("　", "") ?? ""
  infolist.gender =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        15 - noImg
      })`
    )?.textContent ?? ""
  infolist.birthday =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        16 - noImg
      })`
    )?.textContent ?? ""
  infolist.birthplace =
    document
      .querySelector(
        `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
          18 - noImg
        })`
      )
      ?.textContent?.replace("　", "") ?? ""
  infolist.address =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        20 - noImg
      })`
    )?.textContent ?? ""
  const phone = document
    .querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        22 - noImg
      })`
    )
    ?.textContent?.split("  ") ?? ["", ""]
  infolist.phone = phone[0]
  infolist.homePhone = phone[1]
  infolist.previousEducation =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        24 - noImg
      })`
    )?.textContent ?? ""
  infolist.date =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        26 - noImg
      })`
    )?.textContent ?? ""
  infolist.parentName =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        30 - noImg
      })`
    )?.textContent ?? ""
  infolist.parentAddress =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        32 - noImg
      })`
    )?.textContent ?? ""
  infolist.parentPhone =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        34 - noImg
      })`
    )?.textContent ?? ""
  infolist.parentJob =
    document.querySelector(
      `body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(${
        36 - noImg
      })`
    )?.textContent ?? ""
  if (type === "about") {
    infolist.desc = await getUserDesc(userid)
  }

  return infolist
}

export default getUser
