import { Database } from "firebase-admin/lib/database/database"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            studentID: string
            provider: string
        } & DefaultSession["user"]
    }
    type User = DatabaseUser
}
