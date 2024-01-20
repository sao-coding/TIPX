import { getServerSession } from "next-auth"

import Container from "@/app/forum/container"
import Title from "@/components/Title"
import authOptions from "@/lib/auth"

const ForumPage = async () => {
  const session = await getServerSession(authOptions)

  const title = {
    title: "聊天",
    position: "text-center",
    close: true
  }
  return (
    <>
      <div className='flex h-screen w-full flex-col md:-my-20 md:pt-14'>
        <div className='md:hidden'>
          <Title title={title} />
        </div>
        {session && <Container user={session.user} />}
      </div>
    </>
  )
}

export default ForumPage
