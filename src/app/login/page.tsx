import { getServerSession } from "next-auth"
import Form from "@/app/login/form"
import authOptions from "@/lib/auth"
import { redirect } from "next/navigation"

const LoginPage = async ({ searchParams }: { searchParams: { callbackUrl?: string } }) => {
    const session = await getServerSession(authOptions)

    console.log({ session })

    if (session) {
        redirect(searchParams.callbackUrl ?? "/")
    }

    return <Form />
}

export default LoginPage
