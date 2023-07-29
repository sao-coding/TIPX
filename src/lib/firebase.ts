import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
    apiKey: "AIzaSyAbdwy8Hex6nJV9sZ-hpicCJILceIdWQSU",
    authDomain: "tipx-info.firebaseapp.com",
    projectId: "tipx-info",
    storageBucket: "tipx-info.appspot.com",
    messagingSenderId: "802544439134",
    appId: "1:802544439134:web:027cdfeb8b6e1d015a09cf",
    measurementId: "G-1HL9K2W9GR",
}

export const init = async () => {
    if ("serviceWorker" in navigator) {
        const app = initializeApp(firebaseConfig)

        // Auto request notification permission
        const messaging = getMessaging(app)
        console.log("messaging,", Notification.permission)
        if (Notification.permission === "default") {
            await Notification.requestPermission()
        }
        if (Notification.permission === "denied") {
            return
        }
        if (Notification.permission === "granted") {
            new Notification("已開啟通知")
            const token = await getToken(messaging, {
                vapidKey:
                    "BHy1C9V2qhATnxLAuU9iUFmYbhe0WwXndtPhbscRFPVA8io1-dH_Tmbcrmq9AvFsqNk3oUAf2kFLaGeEN37CG5Y",
            })

            // The token to send test message
            console.log(token)
        }
        onMessage(messaging, (payload) => {
            console.log(payload)

            new Notification(payload.notification?.title ?? "", {
                body: payload.notification?.body,
                icon: payload.notification?.image,
            })
        })
    }
}
