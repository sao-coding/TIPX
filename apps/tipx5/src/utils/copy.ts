import toast from 'react-hot-toast'

const toCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  // 複製到剪貼簿
  try {
    navigator.clipboard.writeText(e.currentTarget.parentElement?.textContent as string)
    toast.success('已複製')
  } catch (err) {
    toast.error('複製失敗')
  }
}

export default toCopy
