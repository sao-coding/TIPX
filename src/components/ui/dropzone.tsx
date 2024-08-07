import React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DropzoneProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  classNameWrapper?: string
  className?: string
  dropMessage: string
  handleOnDrop: (acceptedFiles: FileList | null) => void
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ className, classNameWrapper, dropMessage, handleOnDrop, ...props }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const { files } = e.dataTransfer
      if (inputRef.current) {
        inputRef.current.files = files
        handleOnDrop(files)
      }
    }

    const handleButtonClick = () => {
      if (inputRef.current) {
        inputRef.current.click()
      }
    }

    React.useEffect(() => {
      console.log(`isDragging: ${isDragging}`)
    }, [isDragging])

    return (
      <Card
        ref={ref}
        className={cn(
          `h-full overflow-hidden border-2 border-dashed border-muted-foreground/50 bg-muted hover:cursor-pointer`,
          isDragging && 'border-primary',
          classNameWrapper
        )}
      >
        <CardContent
          className={cn(
            'flex h-full flex-col items-center justify-center space-y-2 px-2 py-4 text-xs transition-colors duration-200',
            isDragging && 'bg-primary/10'
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          {/* <div className='flex items-center justify-center text-muted-foreground'> */}
          <span className='pointer-events-none font-medium'>
            {isDragging ? '放開以上傳文件' : dropMessage}
          </span>
          <Input
            {...props}
            value={undefined}
            ref={inputRef}
            type='file'
            className={cn('hidden', className)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOnDrop(e.target.files)}
          />
          {/* </div> */}
        </CardContent>
      </Card>
    )
  }
)

Dropzone.displayName = 'Dropzone'

export default Dropzone
