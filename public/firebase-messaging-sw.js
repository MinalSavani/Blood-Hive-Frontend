importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAPFmmN4uyfglfR2b21ElMlu3hN4QVd9yg",
  authDomain: "blood-hive-f9296.firebaseapp.com",
  projectId: "blood-hive-f9296",
  storageBucket: "blood-hive-f9296.firebasestorage.app",
  messagingSenderId: "956167412998",
  appId: "1:956167412998:web:2c178b2947edaac67d9287"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // If the payload already has a notification object, the browser will automatically show a notification.
  // We should NOT show our own notification here to avoid duplicates.
  if (payload.notification) {
      return; 
  }

  const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'You have a new message.',
    icon: '/vite.svg', // Replace with a solid color maskable icon if possible
    badge: '/vite.svg',
    vibrate: [200, 100, 200, 100, 200, 100, 400],
    requireInteraction: true, // Makes it behave like a persistent popup module
    data: { url: '/' }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
