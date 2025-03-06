export type Locale = (typeof locales)[number]

export const locales = ['zh-TW', 'en', 'ja'] as const
export const defaultLocale: Locale = 'zh-TW'
