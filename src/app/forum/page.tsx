import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import Container from "@/app/forum/container"

const ForumPage = async () => {
    const session = await getServerSession(authOptions)

    return (
        <div className='flex w-full flex-col h-screen -my-5 pb-14 md:-my-20 md:pt-14 md:pb-0'>
            {session && <Container user={session.user} />}
        </div>
    )
}

export default ForumPage
