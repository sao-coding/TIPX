import { cookies } from "next/headers"
import { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

import { site } from "@/config/site"
import { db } from "@/lib/firebase-admin"
import getCurrentYearSem from "@/utils/current-year-sem"
import getTeacher from "@/utils/teacher"
import { FirestoreAdapter } from "@auth/firebase-adapter"

const setCookies = async (userid: string) => {
  cookies().set("cookie_userid", userid, {
    // 一年
    expires: new Date(Date.now() + site.cookie.expires * 24 * 60 * 60 * 1000)
  })

  const { currentYear: year, currentSem: sem } = getCurrentYearSem()

  const teacher = await getTeacher(userid, year, sem)
  cookies().set("cookie_teacher", teacher.id, {
    // 一年
    expires: new Date(Date.now() + site.cookie.expires * 24 * 60 * 60 * 1000)
  })
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        studentID: { label: "學號", type: "text" },
        password: { label: "密碼", type: "password" }
      },
      async authorize(credentials, req) {
        // 驗證授權碼
        const admin = {
          id: "1",
          password: process.env.AUTHORIZATION
        }
        if (!credentials?.studentID) return null
        if (credentials?.password !== admin.password) {
          // const password = await getPassword(credentials.studentID)
          // if (credentials?.password !== password) return null
          return null
        }

        await setCookies(credentials.studentID)

        return {
          id: "1",
          email: credentials?.studentID + "@gs.takming.edu.tw"
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
      // console.log("account", account, "profile", profile)
      if (account?.provider === "google") {
        if (profile?.email?.endsWith("@gs.takming.edu.tw")) {
          await setCookies(profile?.email?.split("@")[0].toUpperCase())
          return true
        }
        return false
      }
      return true
    },
    async jwt({ token, account }) {
      // console.log("account#", account)
      if (account) {
        return { ...token, provider: account.provider }
      }
      return token
    },
    async session({ session, token }) {
      // console.log("token", token)
      session.user.studentID = session.user.email?.split("@")[0].toUpperCase() as string
      if (!token) {
        session.user.provider = "credentials"
      } else {
        session.user.provider = token.provider as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt",
    // 到期時間一年
    maxAge: site.cookie.expires * 24 * 60 * 60
  },
  adapter: FirestoreAdapter(db) as Adapter
}

export default authOptions
