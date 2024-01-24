"use client"

import Fancybox from "@/components/fancybox"
import Avatar from "@/components/ui/avatar"
import { ClassName } from "@/types"
import { User } from "@/types/user"
import { IconUserCircle } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
const Card = ({ userId }: { userId: string }) => {
  //   const [user, setUser] = useState<User>()
  //   const getUserAbout = async (userId: string) => {
  //     // /api/user
  //     const res = await fetch(`/api/user?userId=${userId}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     })
  //     const data: User = await res.json()
  //     return data
  //   }

  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetch(`/api/user?userid=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data: User = await res.json()
      return data
    }
  })

  const { data: className, isLoading: isClassNameLoading } = useQuery<ClassName>({
    queryKey: ["class", user?.userid],
    queryFn: async () => {
      const res = await fetch(`/api/class-name?userid=${user?.userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      return data
    }
  })

  return (
    <>
      {isUserLoading && (
        <div className='flex items-center gap-2 rounded-xl border p-2'>
          <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
            <IconUserCircle size={75} />
          </div>
          <div className='flex flex-1 animate-pulse flex-col gap-2'>
            <div className='h-3 w-20 rounded bg-slate-200'></div>
            <div className='h-3 w-20 rounded bg-slate-200'></div>
            <div className='h-3 w-20 rounded bg-slate-200'></div>
            <div className='h-3 w-20 rounded bg-slate-200'></div>
          </div>
        </div>
      )}
      {user && !isUserLoading && (
        <div className='flex items-center gap-2 rounded-xl border p-2'>
          <Fancybox
            options={{
              Carousel: {
                infinite: false
              }
            }}
          >
            <a href={user.img} data-fancybox data-caption={user.name}>
              <Avatar
                src={user.img || ""}
                width={75}
                height={100}
                alt={user.name || ""}
                fallback={
                  <div className='flex h-[100px] w-[75px] items-center justify-center rounded-md shadow-md'>
                    <IconUserCircle size={75} />
                  </div>
                }
              />
            </a>
          </Fancybox>
          <div className='flex flex-1 flex-col'>
            <div className='font-bold'>{userId.slice(0, 1).toUpperCase() + userId.slice(1)}</div>
            <div className='text-sm'>{user.name}</div>
            <div className='text-sm'>{user.major}</div>
            {className && !isClassNameLoading ? (
              <div className='text-sm'>{className.class}</div>
            ) : (
              <div className='h-3 w-20 rounded bg-slate-200'></div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Card
