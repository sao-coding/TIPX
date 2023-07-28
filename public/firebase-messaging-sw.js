importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js")

firebase.initializeApp({
    apiKey: "AIzaSyAbdwy8Hex6nJV9sZ-hpicCJILceIdWQSU",
    authDomain: "tipx-info.firebaseapp.com",
    projectId: "tipx-info",
    storageBucket: "tipx-info.appspot.com",
    messagingSenderId: "802544439134",
    appId: "1:802544439134:web:027cdfeb8b6e1d015a09cf",
    measurementId: "G-1HL9K2W9GR",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload)

    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.image,
    })
})
