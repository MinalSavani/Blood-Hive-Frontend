// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPFmmN4uyfglfR2b21ElMlu3hN4QVd9yg",
  authDomain: "blood-hive-f9296.firebaseapp.com",
  projectId: "blood-hive-f9296",
  storageBucket: "blood-hive-f9296.firebasestorage.app",
  messagingSenderId: "956167412998",
  appId: "1:956167412998:web:2c178b2947edaac67d9287",
  measurementId: "G-MHNZ3XJGLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestFcmToken = async () => {
  if (!messaging) {
    console.warn('[FCM] Messaging not available (not in browser context)');
    return null;
  }
  try {
    console.log('[FCM] Requesting notification permission...');
    const permission = await Notification.requestPermission();
    console.log('[FCM] Permission result:', permission);
    
    if (permission === 'granted') {
      // Register the service worker explicitly
      let swRegistration = null;
      if ('serviceWorker' in navigator) {
        try {
          swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/'
          });
          // Wait for the service worker to be ready
          await navigator.serviceWorker.ready;
          console.log('[FCM] Service worker registered and ready:', swRegistration.scope);
        } catch (swError) {
          console.error('[FCM] Service worker registration failed:', swError);
        }
      } else {
        console.warn('[FCM] Service workers not supported in this browser');
      }
      
      // Get the FCM token
      const token = await getToken(messaging, { 
        vapidKey: 'BMwEU3uaFVrC0VnitSkXRKKgYl3oA4LjRyEIrc0sSt-7Q1UkW05eqHkEkP2wo8n36Ey1YavQ3f54xLpLFwD5gh0',
        serviceWorkerRegistration: swRegistration
      });
      
      if (token) {
        console.log('[FCM] ✅ Token generated successfully:', token.substring(0, 30) + '...');
      } else {
        console.warn('[FCM] ⚠️ No token returned — check VAPID key and Firebase config');
      }
      return token;
    } else {
      console.error('[FCM] ❌ Notification permission denied by user');
      return null;
    }
  } catch (error) {
    console.error('[FCM] ❌ Error during token retrieval:', error);
    return null;
  }
};

// Listener for foreground messages
export const onMessageListener = (callback) => {
  if (!messaging) return null;
  return onMessage(messaging, (payload) => {
    console.log("FCM Payload received:", payload);
    callback(payload);
  });
};
