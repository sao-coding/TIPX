import { JSDOM } from "jsdom"
import { User } from "@/types"

const getUser = async (userid: string) => {
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
        desc: "",
    }

    const resUrl = async (url: string) => {
        const res = await fetch(url, {
            headers: {
                cookie: `cookie_rgno=${userid}; cookie_userid=${userid};`,
                Referer: "https://netinfo.takming.edu.tw/tip/list_fun.php",
            },
        })
        const buffer = await res.arrayBuffer()
        let html = new TextDecoder("big5").decode(buffer)
        const dom = new JSDOM(html)
        const document = dom.window.document
        return document
    }

    let document

    document = await resUrl("https://netinfo.takming.edu.tw/tip/stu_data_new.php")

    infolist.userid =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(1)"
        )?.textContent ?? ""
    infolist.img =
        document
            .querySelector("form > table tr td table:first-child tr td img")
            ?.getAttribute("src") ?? ""
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
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(9)"
        )?.textContent ?? ""
    infolist.enName =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(12)"
        )?.textContent ?? ""
    infolist.IDnumber =
        document
            .querySelector(
                "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(14)"
            )
            ?.textContent?.replace("　", "") ?? ""
    infolist.gender =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(15)"
        )?.textContent ?? ""
    infolist.birthday =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(16)"
        )?.textContent ?? ""
    infolist.birthplace =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(18)"
        )?.textContent ?? ""
    infolist.address =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(20)"
        )?.textContent ?? ""
    const phone = document
        .querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(22)"
        )
        ?.textContent?.split("  ") ?? ["", ""]
    infolist.phone = phone[0]
    infolist.homePhone = phone[1]
    infolist.previousEducation =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(24)"
        )?.textContent ?? ""
    infolist.date =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(26)"
        )?.textContent ?? ""
    infolist.parentName =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(30)"
        )?.textContent ?? ""
    infolist.parentAddress =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(32)"
        )?.textContent ?? ""
    infolist.parentPhone =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(34)"
        )?.textContent ?? ""
    infolist.parentJob =
        document.querySelector(
            "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(36)"
        )?.textContent ?? ""

    // https://netinfo.takming.edu.tw/tip/stu_data_selfrpt.php

    document = await resUrl("https://netinfo.takming.edu.tw/tip/stu_data_selfrpt.php")

    infolist.desc = document.querySelector("body > table > tbody > tr > td")?.textContent ?? ""

    return infolist
}

export default getUser
