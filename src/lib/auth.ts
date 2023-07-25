import { cookies } from "next/headers"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const authOptions: NextAuthOptions = {
    providers: [
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
                        expires: 7,
                    })
                    return true
                }
                return false
            }
            return true
        },
        async session({ session }) {
            session.user.studentId = session.user.email?.split("@")[0].toUpperCase() as string
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
