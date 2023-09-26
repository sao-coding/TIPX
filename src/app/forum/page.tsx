import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import Container from "@/app/forum/container"
import Title from "@/components/Title"

const ForumPage = async () => {
    const session = await getServerSession(authOptions)

    const title = {
        title: "聊天",
        position: "text-center",
        close: true,
    }
    return (
        <>
            <div className='flex w-full flex-col h-screen md:-my-20 md:pt-14'>
                <div className='md:hidden'>
                    <Title title={title} />
                </div>
                {session && <Container user={session.user} />}
            </div>
        </>
    )
}

export default ForumPage
