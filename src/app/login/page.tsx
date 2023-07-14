"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Cookies from "js-cookie"

const LoginPage = () => {
    const [captcha, setCaptcha] = useState(
        "iVBORw0KGgoAAAANSUhEUgAAAIIAAAAeCAYAAADgp8bFAAAAAXNSR0IArs4c6QAABRdJREFUaIHtmu1xnDoUht9ktgBUAioBlQAlLCWYFmyX4C0Bl4BLgBJECaIEbQe5PxxhAUdw0LK5zmSfmYzHDnCE9Op8iR8vLy+/wCTLMvR9z738ryFJEkgpIYQAAHRd9z+PiEeaphBCQEo5Gb/P6+sr61knjjGlFJRS49/+VjEkSTJOnP/Tx1r7LYWQpunquNfuG4Zh8zpSCM6oUmphUCn1x4WQJAkA4Hq9su/xd4sQYvy3hRACSZLsskWRZdliway10FqzFmZOWZbsxfcRQuwTQpIk485fMyilPGSi1siybBwHtWONMasTmmUZyrKMti+EiH6/PM9RFEXw/5VSsNaiaZpdgjDGTLxyCDc//k8OJzfpUkqWEa0168ExcBZQCAGlFIwxwYk0xtw0Du4umvP09MSaRyEEqqpCXddsO9SCzhc9ZsyOE2fnaK2jXRqX8/nMUjyHtd3sJs5NXlVVi2tiQt/5fGaJwKcsS1wuF9a1lLiNMfj4+NhlM0QwWXTu90/kA3mer4rA7YZ5vF3DX3C36HOBZFm2uC/G47mEmhqD1hrWWkgpFyFDCIE8z1nJKbUJY3KGEAshWGtR1/VdcwCfJEnImGqtRdu2EyG6Mm8tBjve3983rwkt3l5Cz/HHMAwDrLWL0CelZFcp1trJ4kspx8R+npgaY2CMYW/k0/zhlMpc2eW/1FFQizqfRMf1ekXf94d4KSeqOTHPpuasbVvy2ZQQuMk3lTBSoQ3AmPgrpdA0zebzT1rrxWIopaC1HpNIasK01ofEJ+rZTdMA+CobgX2lY6zdIxPhUMJpjFnY5lYp3ArAR0qJsiw3PSQphKIoNt2vK+84LjiEq/V9rLXBMtYYg7ZtD/FIlDuPFQK1QEVRLPISX9g+3ColthqSUm52hU/X63URe/YY4CY7FJRNIURQhFJKVFWFtm1v6v5RYcFaGy0wymULIfD8/DwRya3JHSU4PykGEPTgUsp1IQCfO4GTgFEopQ4VAoeiKGCtjc4VjkoSHVTsdxyZ2fubtm1baK0XIaXrOrKptVXa/gTCLtFl7k3ToGka8johBNI03fVC/r2UTVd2rS1OrHCBY8OCo65r1nUxcd6nbVu8vb2h67pgXhHzLifgU2l+EhOKxX3fj/17n9hOHMW8ZAToZlPsmUAoL7l1/MMwoK7r4JmAm9P5AZ6zz4XjBandv2Vj7CNorSGl3Iy/tyo6ho+PD/LELeZM4B7ewDEMAy6XyyQHcfHbjZMKIXtEuJX0pWkaLMnXGIXQ9z1rZ1Bqi42voSTrnty7bAS++h1zzufz4v322i6KAmVZjg0jv+saOjDknBFNOotrIkiShHR7vtr3QnkX18Pwn0m589D9a2RZduj454SOy1339Ahv5JLFUHVAwWoo+b/keT7pzwNf5UjoLMA1f2Jwbdd5Z7OqqrFHHyonqbODLe4ZFoCv5o3brVsfkcQc5FENqRB7jrsnQtijMgC7z9RDz5i3Sdd6CQ6qhbtGqKV8j2N1zjzGdmY5YZg6p9liIgSXMHIMHSEC4NMrtG27qxyM6S6GcpsjW9fcUHVLQ8zNFxXiQqesHCZCWGuMOGNa68O/6eu6DtZaFEWxmizGKN3hhwW/V3Eka0Jwc0c1gfZyj28qf8y/Yp7X7C7e3foFDBf/I00nCrdwt5w6Zll2SL+AY8cf97x8/K4shADg7t8kPvh+/KT++BDBvwcphAf/Hg8hPADwEMKD3zyE8ADAQwgPfvMfg3utjURtZ6gAAAAASUVORK5CYII="
    )
    const [cookie, setCookie] = useState([])
    const router = useRouter()

    useEffect(() => {
        const fetchDate = async () => {
            const res = await fetch("http://tip.sao-x.com:5815/cap")
            const data = await res.json()
            console.log(data)
            setCaptcha(data.cap)
        }
        // fetchDate()
    }, [])

    const fetchLogin = async () => {
        // const res = await fetch("http://tip.sao-x.com:5815/login", {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         username: (document.getElementById("username") as HTMLInputElement).value,
        //         password: (document.getElementById("password") as HTMLInputElement).value,
        //         cap: (document.getElementById("cap") as HTMLInputElement).value,
        //     }),
        // })
        // const data = await res.json()
        // console.log(data)
        // setCookie(data.cookie)
        if ((document.getElementById("username") as HTMLInputElement)?.value === "") {
            alert("請輸入學號")
            return
        }
        Cookies.set(
            "cookie_userid",
            (document.getElementById("username") as HTMLInputElement)?.value
        )
        Cookies.set("cookie_year", "111")
        Cookies.set("cookie_sem", "2")
        router.push("/")
    }

    return (
        <>
            <div className='absolute left-0 top-0 h-full w-full p-4'>
                <div className='flex h-full items-center justify-center'>
                    <div className='rounded-md bg-white p-4 shadow-md'>
                        <div className='pb-4 text-center text-lg font-bold'>TIP-X</div>
                        <div className='p-2'>
                            <div className='p-2'>學號</div>
                            <input
                                type='text'
                                id='username'
                                className='box-border w-full rounded-full border border-gray-400 bg-white p-1 px-4 text-xl hover:border-gray-600 focus-visible:outline-none'
                            />
                        </div>
                        <div className='hidden p-2'>
                            <div className='p-2'>密碼</div>
                            <input
                                type='text'
                                id='password'
                                className='box-border w-full rounded-full border border-gray-400 bg-white p-1 px-4 text-xl hover:border-gray-600 focus-visible:outline-none'
                            />
                        </div>
                        <div className='hidden p-2'>
                            <div className='p-2'>驗證碼</div>
                            <input
                                type='text'
                                id='cap'
                                className='box-border w-full rounded-full border border-gray-400 bg-white p-1 px-4 text-xl hover:border-gray-600 focus-visible:outline-none'
                            />
                            <img className='pt-2' src={"data:image/png;base64," + captcha} />
                        </div>
                        <div className='p-2'>
                            <button
                                className='w-full rounded-md bg-orange-300 py-2 hover:bg-orange-400'
                                onClick={fetchLogin}
                            >
                                登入
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
// cookies: "cookie_account=D11019139;cookie_sex=1;cookie_enyear=110;cookie_classname=%A4%E9%A5%7C%A7%DE%AC%EC%A4G%A5%D2;cookie_logintimes=2;cookie_classno=D1921;cookie_grade=3;cookie_dept=19;PHPSESSID=5i6hof7hpt28irg9rf4o2tkbcv;cookie_programname=%A4%E9%A5%7C%A7%DE;cookie_level=2;cookie_program=D;cookie_type=2;cookie_name=%25F7%25E1%25A4%25E5%25B5q;cookie_class=1;cookie_rgno=D11019139;cookie_sem=2;cookie_rand=r7p4tVQKwRGCkB;cookie_userid=D11019139;cookie_divcode=1;cookie_year=111"

export default LoginPage
