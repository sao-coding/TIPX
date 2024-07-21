import * as cheerio from 'cheerio'

import redis from '@/lib/redis'
import { User } from '@/types'

import getUserDesc from './description'

const getUser = async (userid: string, type?: string) => {
  let infolist: User = {
    userid: '',
    img: '',
    name: '',
    status: '',
    // dept: "",
    // es: "",
    major: '',
    enName: '',
    IDnumber: '',
    gender: '',
    birthday: '',
    birthplace: '',
    address: '',
    phone: '',
    homePhone: '',
    date: '',
    previousEducation: '',
    parentName: '',
    parentAddress: '',
    parentPhone: '',
    parentJob: '',
    desc: ''
  }

  const getData = async () => {
    const res = await fetch('https://netinfo.takming.edu.tw/tip/stu_data_new.php', {
      headers: {
        cookie: `cookie_rgno=${userid}; cookie_userid=${userid};`,
        Referer: 'https://netinfo.takming.edu.tw/tip/list_fun.php'
      }
    })
    const buffer = await res.arrayBuffer()
    let html = new TextDecoder('big5').decode(buffer)
    const $ = cheerio.load(html)
    let noImg = 0

    infolist.userid = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(1)'
    ).text()
    infolist.img =
      $(
        'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > img'
      ).attr('src') ?? ''
    if (infolist.img === '') {
      noImg = 1
    }
    infolist.name = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(2)'
    ).text()
    infolist.status = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(3)'
    ).text()
    // infolist.dept = $(
    //   "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(6)"
    // ).text()
    // infolist.es = $(
    //   "body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(7)"
    // ).text()
    infolist.major = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(9)'
    ).text()
    infolist.enName = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(12)'
    ).text()
    infolist.IDnumber = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(14)'
    )
      .text()
      .replace('　', '')
    infolist.gender = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(15)'
    ).text()
    infolist.birthday = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(16)'
    ).text()
    infolist.birthplace = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(18)'
    )
      .text()
      .replace('　', '')
    infolist.address = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(20)'
    ).text()
    const phone = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(22)'
    )
      .text()
      .split('  ')
    infolist.phone = phone[0]
    infolist.homePhone = phone[1]
    infolist.previousEducation = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(24)'
    ).text()
    infolist.date = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(26)'
    ).text()
    infolist.parentName = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(30)'
    ).text()
    infolist.parentAddress = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(32)'
    ).text()
    infolist.parentPhone = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(34)'
    ).text()
    infolist.parentJob = $(
      'body > form > table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > font > font:nth-child(36)'
    ).text()
    if (type === 'about') {
      infolist.desc = await getUserDesc(userid)
    }
  }

  // 查詢用戶快取
  const cache = (await redis.call('JSON.GET', `user_${userid}`)) as string | null
  if (!cache) {
    console.log('no cache')
    await getData()
    await redis.call('JSON.SET', `user_${userid}`, '$', JSON.stringify(infolist))
    // 設定快取時間為 4 個月
    await redis.call('EXPIRE', `user_${userid}`, 10368000)
  } else {
    console.log('use cache')
    infolist = JSON.parse(cache)
    if (type === 'about') {
      infolist.desc = await getUserDesc(userid)
    }
  }

  return infolist
}

export default getUser
