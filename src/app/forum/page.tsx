import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
<<<<<<< HEAD
=======
import WorkPage from "@/app/forum/work"
>>>>>>> 3699c4812fb69f7c759c956fc95003fbb7aa8445
import Container from "@/app/forum/container"

const ForumPage = async () => {
    const user = await getServerSession(authOptions)

    return (
        <div className='flex w-full flex-col h-screen -my-5 pb-14 md:-my-20 md:pt-14 md:pb-0'>
            {user && <Container user={user.user} />}
        </div>
    )
}

export default ForumPage
