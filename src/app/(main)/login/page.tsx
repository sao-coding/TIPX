import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import authOptions from "@/lib/auth"

import Form from "./form"

const LoginPage = async ({ searchParams }: { searchParams: { callbackUrl?: string } }) => {
  const session = await getServerSession(authOptions)

  // console.log({ session })

  if (session) {
    redirect(searchParams.callbackUrl ?? "/")
  }

  return (
    <>
      <Form />
    </>
  )
}

export default LoginPage
