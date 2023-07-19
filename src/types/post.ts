// 公告主旨
// 發佈日期
// 發佈單位
// 發布人員
// 發佈期限
// 公告類別
// 公告內容
// 相關附件
// 相關網址

type Publisher = {
    name: string
    email: string
}

type File = {
    title: string
    link: string
}

export type Post = {
    title: string
    date: string
    unit: string
    publisher: Publisher
    deadline: string
    category: string
    content: string
    file: File[]
    link: string
}
