import { DefaultSession } from 'next-auth'

import { UserRole } from '@prisma/client'

type UserId = string
declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId
    studentId: string
    givenName: string
    familyName: string
    picture: string
    email: string
    role: UserRole
    createdAt: Date
    updateAt: Date
  }
}

declare module 'next-auth' {
  interface Profile {
    given_name: string
    family_name: string
    picture: string
  }

  interface Session {
    user: {
      id: UserId
      studentId: string
      givenName: string
      familyName: string
      picture: string
      email: string
      role: UserRole
      createdAt: Date
      updateAt: Date
      accessToken: string
    } & DefaultSession['user']
  }
  // type User = DatabaseUser
}
