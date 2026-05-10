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
  if (!messaging) return;
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Explicitly register the service worker to prevent Vite timeout issues
      let swRegistration = null;
      if ('serviceWorker' in navigator) {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      }
      
      // NOTE: Retrieve your VAPID key from Firebase Console -> Cloud Messaging -> Web configuration
      const token = await getToken(messaging, { 
        vapidKey: 'BMwEU3uaFVrC0VnitSkXRKKgYl3oA4LjRyEIrc0sSt-7Q1UkW05eqHkEkP2wo8n36Ey1YavQ3f54xLpLFwD5gh0',
        serviceWorkerRegistration: swRegistration
      });
      console.log('FCM Token:', token);
      return token;
    } else {
      console.error('Notification permission denied.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
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
