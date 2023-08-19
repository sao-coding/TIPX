import { cookies } from "next/headers"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

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

                if (credentials?.password !== admin.password) return null

                if (!credentials?.studentID) return null
                cookies().set("cookie_userid", credentials?.studentID, {
                    // 7天
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                })

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
                if (profile?.email && profile?.email?.endsWith("@gs.takming.edu.tw")) {
                    cookies().set("cookie_userid", profile.email.split("@")[0].toUpperCase(), {
                        // 7天
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    })
                    return true
                }
                return false
            }
            return true
        },
        async session({ session }) {
            session.user.studentID = session.user.email?.split("@")[0].toUpperCase() as string
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
}

export default authOptions
