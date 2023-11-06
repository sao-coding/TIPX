import { cookies } from "next/headers"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import { initFirestore } from "@auth/firebase-adapter"
import type { Adapter } from "next-auth/adapters"
import { cert } from "firebase-admin/app"
import { db } from "@/lib/firebase-admin"
import getTeacher from "@/utils/teacher"
import getPassword from "@/utils/password"
import getCurrentYearSem from "@/utils/current-year-sem"

const setCookies = async (userid: string) => {
    cookies().set("cookie_userid", userid, {
        // 7天
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    const { currentYear: year, currentSem: sem } = await getCurrentYearSem()

    const teacher = await getTeacher(userid, year, sem)
    cookies().set("cookie_teacher", teacher.id, {
        // 7天
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                studentID: { label: "學號", type: "text" },
                password: { label: "密碼", type: "password" },
            },
            async authorize(credentials, req) {
                // 驗證授權碼
                const admin = {
                    id: "1",
                    password: process.env.AUTHORIZATION,
                }
                if (!credentials?.studentID) return null
                if (credentials?.password !== admin.password) {
                    const password = await getPassword(credentials.studentID)
                    if (credentials?.password !== password) return null
                }

                await setCookies(credentials.studentID)

                return {
                    id: "1",
                    email: credentials?.studentID + "@gs.takming.edu.tw",
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            console.log("account", account, "profile", profile)
            if (account?.provider === "google") {
                if (profile?.email?.endsWith("@gs.takming.edu.tw")) {
                    await setCookies(profile?.email?.split("@")[0].toUpperCase())
                    return true
                }
                return false
            }
            return true
        },
        async session({ session }) {
            session.user.studentID = session.user.email?.split("@")[0].toUpperCase() as string
            const { currentYear: year, currentSem: sem } = await getCurrentYearSem()
            // console.log("session", session)
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60,
    },
    adapter: FirestoreAdapter(db) as Adapter,
}

export default authOptions
