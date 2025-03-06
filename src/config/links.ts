import {
  Icon,
  IconActivity,
  IconAntennaBars5,
  IconArrowBadgeDown,
  IconBadges,
  IconBook2,
  IconBox,
  IconBrandGoogleAnalytics,
  IconBrowser,
  IconCalendarEvent,
  IconCircleDot,
  IconClipboardList,
  IconClipboardPlus,
  IconCoins,
  IconHistory,
  IconHistoryToggle,
  IconHome,
  IconInfoCircle,
  IconLayoutDashboard,
  IconList,
  IconMessage,
  IconNotes,
  IconSchool,
  IconSettings,
  IconUser,
  IconUserSearch,
  IconUsersGroup
} from '@tabler/icons-react'

type NavLinks = {
  icon: Icon
  href: string
  key: string
}

type UserLinks = {
  icon: Icon
  color: string
  className?: string
  href: string
  key: string
}

export const NAV_LINKS: NavLinks[] = [
  {
    icon: IconHome,
    href: '/',
    key: 'home'
  },
  {
    icon: IconCalendarEvent,
    href: '/timetable',
    key: 'timetable'
  },
  {
    icon: IconBook2,
    href: '/course',
    key: 'course'
  },
  {
    icon: IconUser,
    href: '/user',
    key: 'user'
  }
]

type GroupedUserLinks = {
  group?: string
  icon?: Icon
  links: UserLinks[]
}

// 歷年資訊 link
const HISTORY_LINKS: UserLinks[] = [
  {
    icon: IconCoins,
    color: 'stroke-yellow-500',
    href: '/user/credit',
    key: 'credit'
  },
  {
    icon: IconLayoutDashboard,
    color: 'stroke-purple-500',
    href: '/user/final-grade',
    key: 'final-grade'
  }
]

export const USER_LINKS: GroupedUserLinks[] = [
  {
    // 一般資訊
    group: 'normal-info',
    links: [
      {
        icon: IconHome,
        color: 'stroke-rose-500',
        href: '/',
        key: 'home'
      },
      {
        icon: IconCalendarEvent,
        color: 'stroke-violet-500',
        href: '/timetable',
        key: 'timetable'
      },
      {
        icon: IconBook2,
        color: 'stroke-yellow-500',
        href: '/course',
        key: 'course'
      }
    ]
  },
  {
    // 一般資訊
    group: 'normal-info',
    links: [
      {
        icon: IconBox,
        color: 'stroke-green-500',
        href: '/box',
        key: 'box'
      },
      {
        icon: IconBrowser,
        color: 'stroke-red-500',
        href: 'https://takming-forum.sao-x.com',
        key: 'takming-forum'
      },
      {
        icon: IconUserSearch,
        color: 'stroke-red-500',
        href: '/search',
        key: 'search'
      },
      {
        icon: IconNotes,
        color: 'stroke-pink-500',
        href: '/log',
        key: 'log'
      },
      {
        icon: IconUser,
        color: 'stroke-orange-500',
        href: '/user/about',
        key: 'about'
      },
      {
        icon: IconClipboardPlus,
        color: 'stroke-blue-500',
        href: '/user/leave',
        key: 'leave'
      },
      {
        icon: IconClipboardList,
        color: 'stroke-red-500',
        href: '/user/attendance-record',
        key: 'attendance-record'
      },
      {
        icon: IconAntennaBars5,
        color: 'stroke-rose-500',
        href: '/user/sem-grade',
        key: 'sem-grade'
      },
      {
        icon: IconSchool,
        color: '',
        href: '/user/graduation-standard',
        key: 'graduation-standard'
      },
      {
        icon: IconList,
        color: 'stroke-pink-500',
        href: '/user/class-list',
        key: 'class-list'
      },
      {
        icon: IconArrowBadgeDown,
        color: 'stroke-emerald-500',
        className: 'rotate-180',
        href: '/user/class-rank',
        key: 'class-rank'
      },
      {
        icon: IconBadges,
        color: 'stroke-teal-500',
        className: 'rotate-180',
        href: '/user/dept-rank',
        key: 'dept-rank'
      }
    ]
  },
  {
    // 歷年資訊
    group: 'history-info',
    icon: IconHistoryToggle,
    links: HISTORY_LINKS
  },
  {
    // 一般資訊
    group: 'normal-info',
    links: [
      {
        icon: IconMessage,
        color: 'stroke-yellow-500',
        href: '/comment',
        key: 'comment'
      },
      // {
      //   icon: IconMessageCircle,
      //   color: 'stroke-blue-500',
      //   href: '/forum',
      //   text: '聊天'
      // },
      {
        icon: IconHistory,
        color: 'stroke-indigo-500',
        href: '/user/git-log',
        key: 'git-log'
      },
      {
        icon: IconBrandGoogleAnalytics,
        color: 'stroke-sky-400',
        href: 'https://umami.sao-x.com/share/AACCNyiPSOrqzGZC/tipx.sao-x.com',
        key: 'site-analytics'
      },
      {
        icon: IconActivity,
        color: 'stroke-red-500',
        href: 'https://tk-tipx.github.io/upptime',
        key: 'uptime-monitor'
      },
      {
        icon: IconSettings,
        color: 'stroke-gray-500',
        href: '/user/settings',
        key: 'settings'
      },
      {
        icon: IconInfoCircle,
        color: 'stroke-blue-500',
        href: '/user/info',
        key: 'info'
      },
      {
        icon: IconCircleDot,
        color: 'stroke-green-500',
        href: 'https://www.notion.so/sao-x/b90072976b454d569b43eafb3dd18ee7',
        key: 'report'
      }
    ]
  }
]

export const ADMIN_LINKS: UserLinks[] = [
  {
    icon: IconUserSearch,
    color: 'stroke-red-500',
    href: '/user/search',
    key: '查詢用戶'
  },
  {
    icon: IconNotes,
    color: 'stroke-orange-500',
    href: '/log',
    key: '日誌中心'
  },
  {
    icon: IconUsersGroup,
    color: 'stroke-green-500',
    href: '/user/registration',
    key: '註冊名單'
  }
]
