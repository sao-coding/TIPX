import { create } from "zustand"

type ReplyMessageStore = {
  replyMessage: {
    id: string
    author: {
      avatar: string
      username: string
      email: string
      anonymous: boolean
    }
    content: string
    timestamp: string
    edited_timestamp: string
    deleted_timestamp: string
    status: boolean
  }
  setReplyMessage: (message: {
    id: string
    author: {
      avatar: string
      username: string
      email: string
      anonymous: boolean
    }
    content: string
    timestamp: string
    edited_timestamp: string
    deleted_timestamp: string
    status: boolean
  }) => void
  resetReplyMessage: () => void
}

const initialState = {
  id: "",
  author: {
    avatar: "",
    username: "",
    email: "",
    anonymous: false
  },
  content: "",
  timestamp: "",
  edited_timestamp: "",
  deleted_timestamp: "",
  status: false
}

export const useReplyMessageStore = create<ReplyMessageStore>((set) => ({
  replyMessage: initialState,
  setReplyMessage: (message) => set({ replyMessage: message }),
  resetReplyMessage: () => set({ replyMessage: initialState })
}))
