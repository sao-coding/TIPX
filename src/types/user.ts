// 學號
// 姓名
// 狀態
// 部別
// 學制
// 主修科系
// 身分證字號
// 性別
// 生日
// 出生地
// 通訊地址
// 手機
// 家裡電話
// 大學入學年月
// 之前學歷

// 家長姓名
// 通訊地址
// 手機
// 職業

// 已修學分數
// 實得學分數
// {
//     total[]
//     get[]
// }

type Credit = {
    title: string[]
    total: number[]
    get: number[]
}

export type User = {
    userid: string
    img: string
    name: string
    status: string
    dept: string
    es: string
    major: string
    enName: string
    IDnumber: string
    gender: string
    birthday: string
    birthplace: string
    address: string
    phone: string
    homePhone: string
    date: string
    previousEducation: string
    parentName: string
    parentAddress: string
    parentPhone: string
    parentJob: string
    desc: string
    credit: Credit
}
