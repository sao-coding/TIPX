import { collection, getDocs, query, setDoc, where } from 'firebase/firestore'

import { db } from '@/lib/firebase'

const updateMessage = async (messageId: string, content?: string, deleted_timestamp?: string) => {
  const replyRef = query(collection(db, 'forum'), where('message_reference.id', '==', messageId))
  const replySnap = await getDocs(replyRef)
  replySnap.forEach(async (doc) => {
    // 修改 reply 的 message_reference content
    if (content) {
      await setDoc(doc.ref, {
        ...doc.data(),
        message_reference: {
          ...doc.data().message_reference,
          content
        }
      })
    }
    if (deleted_timestamp) {
      await setDoc(doc.ref, {
        ...doc.data(),
        message_reference: {
          ...doc.data().message_reference,
          deleted_timestamp
        }
      })
    }

    console.log(doc.id, ' => ', doc.data())
  })
}

export default updateMessage
