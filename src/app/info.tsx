"use client"

import { useEffect } from "react"

const InfoLog = () => {
  useEffect(() => {
    console.log(
      "%c Power By 唯一 v" + "1.0" + " %c https://sao-coding.github.io ",
      "color: white; background: #ff9f40; padding:5px 0;",
      "padding:4px;border:1px solid #ff9f40;"
    )
    console.log("%c 唯一強力爆肝驅動~ ", "color: white; background: #ff9f40; padding:5px 0;")
    console.log(
      "%c 感謝 Hong 協助" + " %c http://honghong.me ",
      "color: white; background: #000000; padding:5px 0;",
      "padding:4px;border:1px solid #000000;"
    )
  }, [])
  return null
}

export default InfoLog
