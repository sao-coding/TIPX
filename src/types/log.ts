import { Logs as LogType, User } from '@prisma/client'

export type Logs = LogType & {
  user: User
}
