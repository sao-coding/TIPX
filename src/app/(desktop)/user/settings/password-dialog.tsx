import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMediaQuery } from '@/hooks/use-media-query'
import { IconKey, IconLoader2, IconPlus } from '@tabler/icons-react'

interface PasswordDialogProps {
  hasPassword: boolean
  onCreatePassword: (password: string) => Promise<boolean>
  onUpdatePassword: (oldPassword: string, newPassword: string) => Promise<boolean>
}

export const PasswordDialog: React.FC<PasswordDialogProps> = ({
  hasPassword,
  onCreatePassword,
  onUpdatePassword
}) => {
  const [password, setPassword] = React.useState('')
  const [oldPassword, setOldPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // 密碼驗證函數
  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 6
    const hasLetter = /[a-zA-Z]/.test(pwd)
    const hasNumber = /\d/.test(pwd)

    return {
      minLength,
      hasLetter,
      hasNumber,
      isValid: minLength && hasLetter && hasNumber
    }
  }

  const passwordValidation = !hasPassword
    ? validatePassword(password)
    : validatePassword(newPassword)

  const confirmPasswordMatch = hasPassword
    ? newPassword === confirmPassword && confirmPassword.length > 0
    : true

  const handleSubmit = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      if (!hasPassword) {
        // 創建密碼
        if (!passwordValidation.isValid) {
          return
        }
        const success = await onCreatePassword(password)
        if (success) {
          setPassword('')
          setOpen(false)
        }
      } else {
        // 更新密碼
        if (!passwordValidation.isValid || !confirmPasswordMatch) {
          return
        }
        const success = await onUpdatePassword(oldPassword, newPassword)
        if (success) {
          setOldPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setOpen(false)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = hasPassword
    ? oldPassword && passwordValidation.isValid && confirmPasswordMatch
    : passwordValidation.isValid

  const renderPasswordRequirements = (pwd: string) => {
    const validation = validatePassword(pwd)

    if (!pwd) return null

    return (
      <div className='space-y-1 text-xs'>
        <div
          className={`flex items-center gap-1 ${validation.minLength ? 'text-green-600' : 'text-red-500'}`}
        >
          <span>{validation.minLength ? '✓' : '✗'}</span>
          至少6個字元
        </div>
        <div
          className={`flex items-center gap-1 ${validation.hasLetter ? 'text-green-600' : 'text-red-500'}`}
        >
          <span>{validation.hasLetter ? '✓' : '✗'}</span>
          包含至少一個字母
        </div>
        <div
          className={`flex items-center gap-1 ${validation.hasNumber ? 'text-green-600' : 'text-red-500'}`}
        >
          <span>{validation.hasNumber ? '✓' : '✗'}</span>
          包含至少一個數字
        </div>
      </div>
    )
  }

  const renderInputs = () => {
    if (!hasPassword) {
      return (
        <div className='space-y-2'>
          <Label htmlFor='password'>密碼</Label>
          <Input
            id='password'
            type='password'
            placeholder='請輸入密碼'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {renderPasswordRequirements(password)}
        </div>
      )
    }

    return (
      <>
        <div className='space-y-2'>
          <Label htmlFor='oldPassword'>舊密碼</Label>
          <Input
            id='oldPassword'
            type='password'
            placeholder='請輸入舊密碼'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='newPassword'>新密碼</Label>
          <Input
            id='newPassword'
            type='password'
            placeholder='請輸入新密碼'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {renderPasswordRequirements(newPassword)}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>確認新密碼</Label>
          <Input
            id='confirmPassword'
            type='password'
            placeholder='請再次輸入新密碼'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && (
            <div
              className={`flex items-center gap-1 text-xs ${
                confirmPasswordMatch ? 'text-green-600' : 'text-red-500'
              }`}
            >
              <span>{confirmPasswordMatch ? '✓' : '✗'}</span>
              {confirmPasswordMatch ? '密碼一致' : '密碼不一致'}
            </div>
          )}
        </div>
      </>
    )
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='secondary'>{hasPassword ? <IconKey /> : <IconPlus />}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{hasPassword ? '更新密碼' : '設定密碼'}</DialogTitle>
            <DialogDescription>
              {hasPassword
                ? '請輸入舊密碼和新密碼'
                : '密碼必須包含至少一個字母和一個數字，且長度至少為6個字元'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>{renderInputs()}</div>
          <Button onClick={handleSubmit} disabled={!isValid || isLoading}>
            {isLoading ? (
              <>
                <IconLoader2 className='size-4 animate-spin' />
                處理中...
              </>
            ) : hasPassword ? (
              '更新'
            ) : (
              '設定'
            )}
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='secondary'>{hasPassword ? <IconKey /> : <IconPlus />}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{hasPassword ? '更新密碼' : '設定密碼'}</DrawerTitle>
          <DrawerDescription>
            {hasPassword
              ? '請輸入舊密碼和新密碼'
              : '密碼必須包含至少一個字母和一個數字，且長度至少為6個字元'}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <div className='space-y-4'>{renderInputs()}</div>
          <Button onClick={handleSubmit} disabled={!isValid || isLoading}>
            {isLoading ? (
              <>
                <IconLoader2 className='size-4 animate-spin' />
                處理中...
              </>
            ) : hasPassword ? (
              '更新'
            ) : (
              '設定'
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant='outline' disabled={isLoading}>
              取消
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
