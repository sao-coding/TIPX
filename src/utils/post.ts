// 學校公告
import { JSDOM } from "jsdom"

import { Announcement } from "@/types"
import { Post } from "@/types"

const getPost = async (
  type: string,
  id?: number,
  page?: number,
  limit?: number,
  exclude?: string
) => {
  // 獲取公告 全部貼文
  if (type === "all") {
    let announcement: Announcement = {
      id: "",
      title: "",
      sticky: false,
      category: "",
      unit: "",
      date: "",
      deadline: ""
    }

    const announcementListAll: Announcement[] = []
    const announcementList: Announcement[] = []

    const res = await fetch("https://netinfo.takming.edu.tw/tip/post/post_index_all.php")

    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    const rows = Array.from(
      document.querySelectorAll("table[bordercolor='#FFFFFF' ] tr:not(:first-child)")
    )

    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll("td"))
      const sticky = cells[1].querySelector("img") ? true : false
      announcement.sticky = sticky
      const link = cells[1].querySelector("a")?.getAttribute("href")
      // post_OneShow.php?SerialItem=103304
      // 取得網址的ID
      const id = link?.split("=")[1]
      announcement.id = id ?? ""

      if (exclude === "outside" && cells[0].textContent?.includes("校外事項")) {
        return
      }

      cells.forEach((cell, index) => {
        const list = cell.textContent?.replace(/\n/g, "")
        if (index === 0) {
          announcement.category = list ?? ""
        } else if (index === 1) {
          announcement.title = list ?? ""
        } else if (index === 2) {
          announcement.unit = list ?? ""
        } else if (index === 3) {
          announcement.date = list ?? ""
        } else if (index === 4) {
          announcement.deadline = list ?? ""
        }
      })

      announcementListAll.push(announcement)
      announcement = {
        id: "",
        title: "",
        sticky: false,
        category: "",
        unit: "",
        date: "",
        deadline: ""
      }
    })

    if (page != undefined && limit != undefined) {
      const start = (page - 1) * limit
      const end = start + limit
      announcementList.push(...announcementListAll.slice(start, end))
    } else {
      console.log("limit and page are not defined")
      announcementList.push(...announcementListAll)
    }

    return announcementList
  }
  // if (req.nextUrl.searchParams.get("type") === "one" && req.nextUrl.searchParams.get("id")) {
  if (type === "one" && id !== undefined) {
    const post: Post = {
      id: id.toString(),
      title: "",
      date: "",
      deadline: "",
      unit: "",
      publisher: {
        name: "",
        email: ""
      },
      category: "",
      content: "",
      file: [],
      link: ""
    }

    const postdata: string[] = []

    const res = await fetch(
      `https://netinfo.takming.edu.tw/tip/post/post_OneShow.php?SerialItem=${id}`
    )
    const buffer = await res.arrayBuffer()
    let html = new TextDecoder("big5").decode(buffer)
    const dom = new JSDOM(html)
    const document = dom.window.document
    const rows = Array.from(document.querySelectorAll(".newstd"))
    rows.forEach((row, index) => {
      if (index === 3) {
        postdata.push(row.textContent?.split("　")[0] ?? "")
        const cell = row.querySelector("a")
        const name = cell?.textContent
        const email = cell?.getAttribute("href")?.replace("mailto:", "")
        post.publisher.name = name ?? ""
        post.publisher.email = email ?? ""
      } else if (index === 7) {
        const cells = Array.from(row.querySelectorAll("a"))
        cells.forEach((cell) => {
          const title = cell.textContent
          const link = cell.getAttribute("href")
          post.file.push({ title: title ?? "", link: link ?? "" })
        })
      } else if (index === 8) {
        const cells = Array.from(row.querySelectorAll("a"))
        cells.forEach((cell) => {
          const link = cell.getAttribute("href")
          post.link = link ?? ""
        })
      } else {
        postdata.push(row.textContent ?? "")
      }
    })

    post.title = postdata[0]
    post.date = postdata[1]
    post.deadline = postdata[2]
    post.unit = postdata[3].replace(/\n/g, "")
    post.category = postdata[4]
    post.content = postdata[6]

    return post
  }
}

export default getPost
