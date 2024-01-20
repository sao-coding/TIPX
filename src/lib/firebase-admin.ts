// TODO: 這個檔案是用來初始化 firebase-admin 的，但是目前沒有用到，所以先註解掉，之後有需要再來使用
// import { cert, getApps, initializeApp } from "firebase-admin/app"
// import { getFirestore } from "firebase-admin/firestore"

// const app = !getApps().length
//     ? initializeApp({
//           credential: cert({
//               projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//               clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//               privateKey: process.env.FIREBASE_PRIVATE_KEY,
//           }),
//       })
//     : getApps()[0]

// export const db = getFirestore(app)
// 判斷是不是有 app 存在了，有就用，沒有就初始一個

import { cert } from "firebase-admin/app"

import { initFirestore } from "@auth/firebase-adapter"

export const db = initFirestore({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  })
})
