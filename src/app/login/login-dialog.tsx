import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import LoginForm from './login-form'

const LoginDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='w-full rounded-full bg-primary px-2 py-1'>登入</button>
      </DialogTrigger>
      <DialogContent className='w-11/12 max-w-[425px] rounded-lg md:w-full'>
        <DialogHeader>
          <DialogTitle>TIPX</DialogTitle>
          <DialogDescription>登入以繼續使用TIPX</DialogDescription>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
