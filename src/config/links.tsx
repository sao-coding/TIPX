import { IconHome, IconBook2, IconCalendarEvent, IconUser, Icon } from "@tabler/icons-react"

type NavLinks = {
    icon: Icon
    href: string
    text: string
}[]

export const NAV_LINKS: NavLinks = [
    {
        icon: IconHome,
        href: "/",
        text: "首頁",
    },
    {
        icon: IconCalendarEvent,
        href: "/timetable",
        text: "課表",
    },
    {
        icon: IconBook2,
        href: "/course",
        text: "課程",
    },
    {
        icon: IconUser,
        href: "/user",
        text: "個人",
    },
]
