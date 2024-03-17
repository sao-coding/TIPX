import {
  Icon,
  IconActivity,
  IconAntennaBars5,
  IconArrowBadgeDown,
  IconBadges,
  IconBook2,
  IconBrandGoogleAnalytics,
  IconBrowser,
  IconCalendarEvent,
  IconCircleDot,
  IconClipboardList,
  IconClipboardPlus,
  IconCoins,
  IconHistory,
  IconHome,
  IconInfoCircle,
  IconLayoutDashboard,
  IconList,
  IconMessageCircle,
  IconNotes,
  IconSettings,
  IconUser,
  IconUserSearch,
  IconUsersGroup
} from "@tabler/icons-react"

type NavLinks = {
  icon: Icon
  href: string
  text: string
}[]

type UserLinks = {
  icon: Icon
  color: string
  className?: string
  href: string
  text: string
}[]

export const NAV_LINKS: NavLinks = [
  {
    icon: IconHome,
    href: "/",
    text: "首頁"
  },
  {
    icon: IconCalendarEvent,
    href: "/timetable",
    text: "課表"
  },
  {
    icon: IconBook2,
    href: "/course",
    text: "課程"
  },
  {
    icon: IconUser,
    href: "/user",
    text: "個人"
  }
]

export const USER_LINKS: UserLinks = [
  {
    icon: IconUserSearch,
    color: "stroke-red-500",
    href: "/user/search",
    text: "查詢用戶"
  },
  {
    icon: IconBrowser,
    color: "stroke-red-500",
    href: "https://takming-forum.sao-x.com",
    text: "德明課程評價(beta) 開放試用 !!!"
  },
  {
    icon: IconUser,
    color: "stroke-orange-500",
    href: "/user/about",
    text: "個人資料"
  },
  {
    icon: IconClipboardPlus,
    color: "stroke-blue-500",
    href: "/user/leave",
    text: "線上請假"
  },
  {
    icon: IconClipboardList,
    color: "stroke-red-500",
    href: "/user/attendance-record",
    text: "請假缺曠記錄"
  },
  {
    icon: IconCoins,
    color: "stroke-yellow-500",
    href: "/user/credit",
    text: "學分資訊"
  },
  {
    icon: IconAntennaBars5,
    color: "stroke-rose-500",
    href: "/user/sem-grade",
    text: "科目成績"
  },
  {
    icon: IconLayoutDashboard,
    color: "stroke-purple-500",
    href: "/user/final-grade",
    text: "學期-操行 成績"
  },
  {
    icon: IconList,
    color: "stroke-pink-500",
    href: "/user/class-list",
    text: "班級名單"
  },
  {
    icon: IconArrowBadgeDown,
    color: "stroke-emerald-500",
    className: "transform rotate-180",
    href: "/user/class-rank",
    text: "班級排名"
  },
  {
    icon: IconBadges,
    color: "stroke-teal-500",
    className: "transform rotate-180",
    href: "/user/dept-rank",
    text: "系排名"
  },
  {
    icon: IconMessageCircle,
    color: "stroke-blue-500",
    href: "/forum",
    text: "聊天"
  },
  {
    icon: IconHistory,
    color: "stroke-indigo-500",
    href: "/user/git-log",
    text: "更新日誌"
  },
  {
    icon: IconNotes,
    color: "stroke-orange-500",
    href: "/user/log",
    text: "日誌中心"
  },
  {
    icon: IconUsersGroup,
    color: "stroke-green-500",
    href: "/user/registration",
    text: "註冊名單"
  },
  {
    icon: IconBrandGoogleAnalytics,
    color: "stroke-sky-400",
    href: "https://umami.sao-x.com/share/yXMhXlD7ra7teJAM/TIP",
    text: "網站數據統計"
  },
  {
    icon: IconActivity,
    color: "stroke-red-500",
    href: "https://tk-tipx.github.io/upptime",
    text: "系統狀態"
  },
  {
    icon: IconSettings,
    color: "stroke-gray-500",
    href: "/user/settings",
    text: "設定"
  },
  {
    icon: IconInfoCircle,
    color: "stroke-blue-500",
    href: "/user/info",
    text: "關於"
  },
  {
    icon: IconCircleDot,
    color: "stroke-green-500",
    href: "https://www.notion.so/sao-x/b90072976b454d569b43eafb3dd18ee7",
    text: "問題報告"
  }
]
