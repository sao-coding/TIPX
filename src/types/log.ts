import { Log as LogType, User } from '@prisma/client'

export type Log = LogType & {
  user: User
}
