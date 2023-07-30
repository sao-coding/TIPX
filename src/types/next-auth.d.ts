import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            studentID: string
        } & DefaultSession["user"]
    }
}
