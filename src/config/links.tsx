import { IconHome, IconBook2, IconCalendarEvent, IconUser, Icon } from "@tabler/icons-react"

type FooterLinks = {
    icon: Icon
    href: string
}[]

export const FOOTER_LINKS: FooterLinks = [
    {
        icon: IconHome,
        href: "/",
    },
    {
        icon: IconCalendarEvent,
        href: "/timetable",
    },
    {
        icon: IconBook2,
        href: "/course",
    },
    {
        icon: IconUser,
        href: "/user",
    },
]
