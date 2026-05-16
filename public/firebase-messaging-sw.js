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

// Handle background messages (when browser tab is not active)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Extract notification details from either notification or data payload
  const notificationTitle = payload.notification?.title || payload.data?.title || 'BloodHive Notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'You have a new message.',
    icon: payload.notification?.icon || '/images/blood-icon.png',
    badge: '/vite.svg',
    vibrate: [200, 100, 200, 100, 200, 100, 400],
    requireInteraction: true,
    tag: 'bloodhive-notification-' + Date.now(), // Unique tag prevents dedup/suppression
    data: { 
      url: payload.data?.url || payload.fcmOptions?.link || '/' 
    }
  };

  // ALWAYS show the notification ourselves
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open the app URL
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('blood-hive') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
