import { cookies } from 'next/headers'
import { NextAuthOptions } from 'next-auth'
// import type { Adapter } from 'next-auth/adapters'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

// import { db } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'

// import { FirestoreAdapter } from '@auth/firebase-adapter'
import { signJwtAccessToken } from './jwt'

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
        const refreshToken = await signJwtAccessToken(
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

        const accessToken = await signJwtAccessToken({
          type: 'access',
          userId,
          role: existUser?.role || 'USER'
        })

        cookies().set('accessToken', accessToken)
      }

      if (account?.provider === 'google') {
        if (profile) {
          let userInfo

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
            userInfo = newUser
            // 新增使用者設定
            await prisma.userSettings.create({
              data: {
                theme: 'system',
                location: false,
                avatar: '',
                banner: '',
                user: {
                  connect: {
                    id: newUser.id
                  }
                }
              }
            })
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
              }
            })
          }

          // 從 cookies 取得 no_logout true
          const keepLogin = cookies().get('cookie_keep_login')?.value === 'true'

          const refreshToken = await signJwtAccessToken(
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

          const accessToken = await signJwtAccessToken({
            type: 'access',
            userId: userInfo.id,
            role: userInfo.role
          })

          cookies().set('accessToken', accessToken, {
            maxAge: 7 * 24 * 60 * 60
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
