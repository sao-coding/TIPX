import Login from "@/components/login"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

const LoginButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='w-full rounded-full bg-primary px-2 py-1'>登入</button>
      </DialogTrigger>
      <DialogContent className='w-4/5 max-w-[425px] rounded-lg'>
        <DialogHeader>
          <DialogTitle>TIPX</DialogTitle>
          <DialogDescription>登入以繼續使用TIPX</DialogDescription>
        </DialogHeader>
        <Login />
      </DialogContent>
    </Dialog>
  )
}

export default LoginButton
