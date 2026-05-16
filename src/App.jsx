import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import LoginUser from "./pages/LoginUser";
import "./App.css";
import Register from "./pages/Register";
import SignUp from "./pages/SignUp";
import BloodBank from "./pages/BloodBank";
import VolunteerReg from "./pages/VolunteerReg";
import ContactUs from "./components/Services/ContactUs";
import Featured from "./components/Featured";
import { requestFcmToken, onMessageListener } from "./firebase";
import EligibilityQuiz from "./pages/EligibilityQuiz";
import DonorDashboard from "./pages/DonorDashboard";
import DonateNow from "./pages/DonateNow";

function App() {
  useEffect(() => {
    const initPushNotifications = async () => {
      const token = await requestFcmToken();
      if (token) {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const user = JSON.parse(userData);
            const userToken = localStorage.getItem("userToken");
            if (user && user.email) {
              const safeEmail = user.email.replace(/[@.]/g, '_');
              // await axios.post("http://localhost:5000/api/fcm/subscribe", 
              await axios.post("https://blood-hive-backend-1.onrender.com/api/fcm/subscribe", 
                { token, topic: `user_${safeEmail}` },
                { headers: { Authorization: `Bearer ${userToken}` } }
              );
            }
          } catch (e) { console.error("FCM Subscribe error", e); }
        }
      }
    };
    initPushNotifications();

    // Listen to continuous foreground notifications
    const unsubscribe = onMessageListener((payload) => {
      if (!payload) return;
      const title = payload.notification?.title || "Notification";
      const options = {
        body: payload.notification?.body,
        icon: "/vite.svg",
        requireInteraction: true,
        vibrate: [200, 100, 200]
      };
      
      // Try to show browser popup
      if (Notification.permission === "granted") {
        new Notification(title, options);
      } else {
        alert(title + "\n" + options.body); // Fallback if browser blocks popups
      }
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/bloodbank",
      element: <BloodBank />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/loginuser",
      element: <LoginUser />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/contactus",
      element: <ContactUs />,
    },
    {
      path: "/featured",
      element: <Featured />,
    },
    {
      path: "/volunteer",
      element: <VolunteerReg />,
    },
    {
      path: "/quiz",
      element: <EligibilityQuiz />,
    },
    {
      path: "/dashboard",
      element: <DonorDashboard />,
    },
    {
      path: "/donate",
      element: <DonateNow />,
    },
  ]);

  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;