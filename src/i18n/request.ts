import { getRequestConfig } from 'next-intl/server'
import deepmerge from 'deepmerge'

import { getUserLocale } from '@/app/actions'

export default getRequestConfig(async () => {
  const locale = await getUserLocale()

  const userMessages = (await import(`../../messages/${locale}.json`)).default
  const defaultMessages = (await import(`../../messages/zh-TW.json`)).default
  const messages = deepmerge(defaultMessages, userMessages)
  console.log('messages', messages)
  return {
    locale,
    messages
  }
})
