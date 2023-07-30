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
                // console.log("credentials", credentials?.studentID)
                // console.log("password", credentials?.password)
                // const res = await fetch("http://localhost:3000/api/authorize", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify({
                //         token: credentials?.password,
                //     }),
                // })

                // console.log("res", await res.json())

                // if (!res.ok) return null
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
        async jwt({ token, account }) {
            return {
                ...token,
                provider: account?.provider,
            }
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
