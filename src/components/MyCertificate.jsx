// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const MyCertificate = ({ userId }) => {
//   const [donation, setDonation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCertificate = async () => {
//       try {
//         const token = localStorage.getItem("userToken");
//         const res = await axios.get(`http://localhost:5000/api/certificates/user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (res.data && res.data.length > 0) {
//           setDonation(res.data[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching certificates", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (userId) fetchCertificate();
//   }, [userId]);

//   if (loading) return <div className="p-4 text-gray-500">Loading certificate...</div>;

//   if (!donation) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 flex flex-col items-center justify-center text-center">
//         <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
//           📄
//         </div>
//         <h3 className="text-xl font-bold text-gray-800 mb-2">No Certificates Yet</h3>
//         <p className="text-gray-500 max-w-md mb-6">
//           You haven't completed any blood donations yet. Complete your first donation to unlock your appreciation certificate!
//         </p>
//         <button 
//           onClick={() => navigate("/quiz")}
//           className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition transform hover:-translate-y-1"
//         >
//           Donate Now
//         </button>
//       </div>
//     );
//   }

//   const handleDownload = () => {
//     window.open(`http://localhost:5000/api/certificates/${donation._id}`, "_blank");
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between">
//       <div className="flex items-center gap-4 mb-4 md:mb-0">
//         <div className="w-16 h-16 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-3xl">
//           📄
//         </div>
//         <div>
//           <h3 className="text-xl font-bold text-gray-800">My Latest Certificate</h3>
//           <p className="text-sm text-gray-500">Donation Date: {new Date(donation.date).toLocaleDateString()}</p>
//           <p className="text-xs text-gray-400 mt-1">ID: {donation.certificateNumber}</p>
//         </div>
//       </div>
      
//       <button 
//         onClick={handleDownload}
//         className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2"
//       >
//         <span>📥</span> Download PDF
//       </button>
//     </div>
//   );
// };

// export default MyCertificate;
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyCertificate = ({ userId }) => {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Wrap fetchCertificate in useCallback so we can call it anytime
  const fetchCertificate = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      const res = await axios.get(`http://localhost:5000/api/certificates/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.length > 0) {
        setDonation(res.data[0]);
      }
    } catch (error) {
      console.error("Error fetching certificates", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchCertificate();
  }, [userId, fetchCertificate]);

  // ✅ Listen for push notification message from Firebase Service Worker
  useEffect(() => {
    const handleMessage = (event) => {
      // When Firebase push notification is received in foreground
      if (
        event.data &&
        (event.data.type === "DONATION_COMPLETED" || 
         event.data?.notification?.title?.includes("Hero"))
      ) {
        console.log("🔔 Notification received — re-fetching certificate...");
        fetchCertificate(); // 🔄 Auto re-fetch certificate
      }
    };

    // Listen for messages from service worker
    navigator.serviceWorker?.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, [fetchCertificate]);

  // ✅ Also poll every 10 seconds if no certificate yet (fallback)
  useEffect(() => {
    if (donation) return; // Already have certificate, no need to poll

    const interval = setInterval(() => {
      if (userId) {
        console.log("⏳ Polling for certificate...");
        fetchCertificate();
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval); // cleanup
  }, [donation, userId, fetchCertificate]);

  if (loading) return <div className="p-4 text-gray-500">Loading certificate...</div>;

  if (!donation) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
          📄
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Certificates Yet</h3>
        <p className="text-gray-500 max-w-md mb-6">
          You haven't completed any blood donations yet. Complete your first donation to unlock your appreciation certificate!
        </p>
        <button
          onClick={() => navigate("/quiz")}
          className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition transform hover:-translate-y-1"
        >
          Donate Now
        </button>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(`http://localhost:5000/api/certificates/${donation._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // Important for PDF download
      });
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate_${donation._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Failed to download certificate. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-3xl">
          📄
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">My Latest Certificate</h3>
          <p className="text-sm text-gray-500">Donation Date: {new Date(donation.date).toLocaleDateString()}</p>
          <p className="text-xs text-gray-400 mt-1">ID: {donation.certificateNumber}</p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2"
      >
        <span>📥</span> Download PDF
      </button>
    </div>
  );
};

export default MyCertificate;