import { cookies } from 'next/headers'
import { NextAuthOptions } from 'next-auth'
// import type { Adapter } from 'next-auth/adapters'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

// import { db } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'

// import { FirestoreAdapter } from '@auth/firebase-adapter'
import { signJwtToken } from './jwt'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userId: { label: '學號', type: 'text' },
        password: { label: '密碼', type: 'password' }
      },
      async authorize(credentials, req) {
        // 驗證授權碼
        const admin = {
          id: '1',
          password: process.env.AUTHORIZATION
        }

        if (!credentials?.userId) return null
        if (credentials?.password !== admin.password) {
          // const password = await getPassword(credentials.studentID)
          // if (credentials?.password !== password) return null
          return null
        }

        // 查詢使用者是否存在
        const existUser = await prisma.user.findUnique({
          where: {
            id: credentials.userId
          }
        })

        return {
          id: '1',
          name: '管理員',
          email: credentials?.userId + '@gs.takming.edu.tw'
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      console.log('account', account, 'profile', profile, 'user', user)
      const userId = user.email?.split('@')[0].toUpperCase() as string

      // 檢查使用者是否存在
      const existUser = await prisma.user.findUnique({
        where: {
          email: user.email || ''
        }
      })

      console.log('使用者是否存在', existUser?.name)

      if (account?.provider === 'credentials') {
        const refreshToken = await signJwtToken(
          {
            type: 'refresh',
            userId
          },
          {
            // 設定到期時間 半年
            expiresIn: '7d'
          }
        )

        // set-cookie: refreshToken
        cookies().set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60
        })

        const accessToken = await signJwtToken({
          type: 'access',
          provider: 'credentials',
          userId,
          role: existUser?.role || 'USER'
        })

        cookies().set('accessToken', accessToken)
      }

      if (account?.provider === 'google') {
        if (profile) {
          let userInfo
          // 使用正則表達式來檢查
          // # 部別	代碼
          // # 日四技	D
          // # 日二技	C
          // # 進二技	M
          // # 進四技	N
          // # 日四技外籍專班 K
          // # 日四技春季專班 S
          // # 推廣教育系 Y
          // D9919139
          // D11019139

          // 英文字後面至少要有 7 碼數字
          const studentIdRegex = /^[A-Z]{1}[0-9]{7,}$/

          // 判斷 userId 是否符合學號格式
          const isStudentId = studentIdRegex.test(userId)
          // console.log('isStudentId', userId, isStudentId)

          if (!isStudentId) {
            // 如果不是學生，則不允許登入
            // console.log('不是學生，無法登入')
            return false
          }

          if (!existUser) {
            const newUser = await prisma.user.create({
              data: {
                id: profile.email?.split('@')[0].toUpperCase() as string,
                name: profile.name as string,
                givenName: profile.given_name as string,
                familyName: profile.family_name as string,
                picture: profile.picture as string,
                email: profile.email as string
              }
            })
            console.log('使用者新增成功', newUser)
            // 新增使用者設定
            const userSettings = await prisma.userSettings.create({
              data: {
                user: {
                  connect: {
                    id: newUser.id
                  }
                }
              }
            })
            userInfo = {
              ...newUser,
              UserSettings: {
                theme: userSettings.theme,
                language: userSettings.language
              }
            }
            console.log('使用者設定新增成功')
          } else {
            console.log('使用者已存在', existUser)
            // 更新使用者登入時間
            userInfo = await prisma.user.update({
              where: {
                id: existUser.id
              },
              data: {
                updatedAt: new Date()
              },
              include: {
                UserSettings: {
                  select: {
                    theme: true,
                    language: true
                  }
                }
              }
            })
          }

          // 從 cookies 取得 no_logout true
          const keepLogin = cookies().get('cookie_keep_login')?.value === 'true'

          const refreshToken = await signJwtToken(
            {
              type: 'refresh',
              userId: userInfo.id
            },
            {
              // 設定到期時間 半年
              expiresIn: keepLogin ? '180d' : '7d'
            }
          )

          cookies().set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: keepLogin ? 180 * 24 * 60 * 60 : 7 * 24 * 60 * 60
          })

          const accessToken = await signJwtToken({
            type: 'access',
            provider: 'google',
            userId: userInfo.id,
            role: userInfo.role
          })

          cookies().set('accessToken', accessToken, {
            maxAge: 7 * 24 * 60 * 60
          })

          cookies().set('language', userInfo.UserSettings?.language || 'zh-TW', {
            maxAge: 999 * 24 * 60 * 60
          })

          // header set-cookie: refreshToken
        }
      }

      return true
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
    // 到期時間一年
    // maxAge: site.cookie.expires * 24 * 60 * 60
  }
  // adapter: FirestoreAdapter(db) as Adapter
}

export default authOptions
