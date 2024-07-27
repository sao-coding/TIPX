import { cookies } from 'next/headers'
import { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { site } from '@/config/site'
import { db } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import getCurrentYearSem from '@/utils/current-year-sem'
import getTeacher from '@/utils/teacher'
import { FirestoreAdapter } from '@auth/firebase-adapter'

import { signJwtAccessToken } from './jwt'

const setCookies = async (userid: string) => {
  cookies().set('cookie_userid', userid, {
    // 一年
    expires: new Date(Date.now() + site.cookie.expires * 24 * 60 * 60 * 1000)
  })

  const { currentYear: year, currentSem: sem } = getCurrentYearSem()

  const teacher = await getTeacher(userid, year, sem)
  cookies().set('cookie_teacher', teacher.id, {
    // 一年
    expires: new Date(Date.now() + site.cookie.expires * 24 * 60 * 60 * 1000)
  })
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        studentId: { label: '學號', type: 'text' },
        password: { label: '密碼', type: 'password' }
      },
      async authorize(credentials, req) {
        // 驗證授權碼
        const admin = {
          id: '1',
          password: process.env.AUTHORIZATION
        }

        if (!credentials?.studentId) return null
        if (credentials?.password !== admin.password) {
          // const password = await getPassword(credentials.studentID)
          // if (credentials?.password !== password) return null
          return null
        }

        await setCookies(credentials.studentId)

        // 查詢使用者是否存在
        const existUser = await prisma.user.findUnique({
          where: {
            studentId: credentials.studentId
          }
        })

        return {
          id: '1',
          name: '管理員',
          email: credentials?.studentId + '@gs.takming.edu.tw'
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log('account', account, 'profile', profile)
      if (account?.provider === 'google') {
        if (profile?.email?.endsWith('@gs.takming.edu.tw')) {
          await setCookies(profile?.email?.split('@')[0].toUpperCase())
          return true
        }
        return false
      }
      return true
    },
    async jwt({ token, profile }) {
      console.log('jwt', { token, profile })
      let userInfo

      if (!profile) {
        const studentId = token.email?.split('@')[0].toUpperCase() as string
        // const studentId = 'D11019139'
        const existUser = await prisma.user.findUnique({
          where: {
            studentId
          }
        })

        const accessToken = signJwtAccessToken(
          {
            studentId,
            role: existUser?.role || 'USER',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            // 設定到期時間 半年
            expiresIn: '7d'
          }
        )

        return {
          ...token,
          studentId,
          givenName: '管理員',
          familyName: '管理員',
          role: existUser?.role || 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
          expiresIn: 7,
          accessToken
        }
      }

      // 查詢使用者是否存在
      const existUser = await prisma.user.findUnique({
        where: {
          email: profile.email
        }
      })

      console.log('使用者是否存在', existUser?.name)

      if (!existUser) {
        const newUser = await prisma.user.create({
          data: {
            studentId: profile.email?.split('@')[0].toUpperCase() as string,
            name: profile.name as string,
            givenName: profile.given_name as string,
            familyName: profile.family_name as string,
            picture: profile.picture as string,
            email: profile.email as string
          }
        })
        console.log('使用者新增成功', newUser)
        userInfo = newUser
        // 新增使用者設定
        await prisma.userSettings.create({
          data: {
            user: {
              connect: {
                id: newUser.id
              }
            }
          }
        })
      } else {
        console.log('使用者已存在', existUser)
        // 更新使用者登入時間
        userInfo = await prisma.user.update({
          where: {
            id: existUser.id
          },
          data: {
            updatedAt: new Date()
          }
        })
      }

      // 從 cookies 取得 no_logout true
      const keepLogin = cookies().get('cookie_keep_login')?.value === 'true'

      const accessToken = signJwtAccessToken(
        {
          studentId: userInfo.studentId,
          role: userInfo.role,
          createdAt: userInfo.createdAt,
          updatedAt: userInfo.updatedAt
        },
        {
          // 設定到期時間 半年
          expiresIn: keepLogin ? '180d' : '7d'
        }
      )
      return {
        ...token,
        id: userInfo.id,
        studentId: userInfo.studentId,
        givenName: userInfo.givenName,
        familyName: userInfo.familyName,
        role: userInfo.role,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
        expiresIn: keepLogin ? 180 : 7,
        accessToken
      }
    },
    async session({ session, token, user }) {
      if (token) {
        return { ...session, user: { ...session.user, ...token } }
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    // 到期時間一年
    maxAge: site.cookie.expires * 24 * 60 * 60
  },
  adapter: FirestoreAdapter(db) as Adapter
}

export default authOptions
