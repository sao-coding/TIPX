"use client"

import React, { useEffect, useState } from "react"
import Cookie from "js-cookie"

const EmailPage = () => {
  const [userid, setUserid] = useState("")
  const [phone, setPhone] = useState("")
  const [verify, setVerify] = useState("")
  const [email, setEmail] = useState("")
  const [lineid, setLineid] = useState("")

  useEffect(() => {
    const user = Cookie.get("cookie_userid")
    if (user) {
      setUserid(user)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/phone")
      const data = await res.json()
      setPhone(data.phone)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/email")
      const data = await res.json()
      setEmail(data.email)
      setLineid(data.lineid)
    }
    fetchData()
  }, [])
  // Mail: only@sao-x.com
  // LineID: fuckjeter

  const submit1 = async (
    event: React.FormEvent<HTMLFormElement>,
    email: string,
    lineid: string
  ) => {
    event.preventDefault()
    const bodyContent = new FormData()
    bodyContent.append("Mail", email)
    bodyContent.append("LineID", lineid)

    const res = await fetch("/api/email", {
      method: "POST",
      body: bodyContent
    })
    const data = await res.json()
    console.log(data)
  }

  const submit2 = async (event: React.FormEvent<HTMLFormElement>, phone: string) => {
    event.preventDefault()
    const bodyContent = new FormData()
    bodyContent.append("phone", phone)

    const res = await fetch("/api/phone", {
      method: "POST",
      body: bodyContent
    })
    const data = await res.json()
    console.log(data)
  }

  const submit3 = async (event: React.FormEvent<HTMLFormElement>, verify: string) => {
    event.preventDefault()
    const bodyContent = new FormData()
    bodyContent.append("verify", verify)

    const res = await fetch("/api/verify", {
      method: "POST",
      body: bodyContent
    })
    const data = await res.json()
    console.log(data)
  }

  return (
    <div className='flex flex-col items-center md:flex-row'>
      <form
        encType='multipart/form-data'
        className='flex h-full flex-col items-center space-y-2 p-4'
        onSubmit={(event) => submit1(event, email, lineid)}
      >
        <label htmlFor=''>email</label>
        <div className='m-1 border'>
          <input
            type='text'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>
        <label htmlFor=''>LineID</label>
        <div className='m-1 border'>
          <input
            type='text'
            value={lineid}
            onChange={(e) => {
              setLineid(e.target.value)
            }}
          />
        </div>
        <div className='border p-1'>
          <input type='submit' value='存檔' />
        </div>
      </form>
      <form
        encType='multipart/form-data'
        className='flex h-full flex-col items-center space-y-2 p-4'
        onSubmit={(event) => submit2(event, phone)}
      >
        <label htmlFor=''>phone</label>
        <div className='m-1 border'>
          <input
            type='text'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
            }}
          />
        </div>
        <div className='border p-1'>
          <input type='submit' value='發送簡訊' />
        </div>
      </form>
      <div className='border p-1'>
        <a href={`https://netinfo.takming.edu.tw/tip/verify_stu_tel.php?rno=${userid}`}>
          點我驗證手機
        </a>
      </div>
      {/* <form
                encType='multipart/form-data'
                className='h-full p-4 flex flex-col space-y-2 items-center'
                onSubmit={(event) => submit3(event, verify)}
            >
                <label htmlFor=''>輸入簡訊驗證碼</label>
                <div className='m-1 border'>
                    <input
                        type='text'
                        value={verify}
                        onChange={(e) => {
                            setVerify(e.target.value)
                        }}
                    />
                </div>
                <div className='border p-1'>
                    <input type='submit' value='驗證' />
                </div>
            </form> */}
    </div>
  )
}

export default EmailPage
