import Form from "./form"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { redirect } from "next/navigation"
import Footer from "@/components/Footer"

const LoginPage = async ({ searchParams }: { searchParams: { callbackUrl?: string } }) => {
    const session = await getServerSession(authOptions)

    // console.log({ session })

    if (session) {
        redirect(searchParams.callbackUrl ?? "/")
    }

    return (
        <>
            <Form />
            <Footer />
        </>
    )
}

export default LoginPage
