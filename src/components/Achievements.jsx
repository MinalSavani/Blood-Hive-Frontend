import React, { useEffect, useState } from "react";
import axios from "axios";

const Achievements = ({ userId }) => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get(`http://localhost:5000/api/badges/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEarnedBadges(res.data.earned || []);
        setAllBadges(res.data.allBadges || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch badges", error);
        setLoading(false);
      }
    };
    if (userId) fetchBadges();
  }, [userId]);

  if (loading) return <div className="p-4">Loading achievements...</div>;

  const earnedBadgeIds = earnedBadges.map(eb => eb.badgeId._id.toString());

  const getTierColor = (tier, isEarned) => {
    if (!isEarned) return "bg-gray-100 text-gray-400";
    switch (tier) {
      case "light-red": return "bg-red-100 text-red-800 border-red-200";
      case "red": return "bg-red-500 text-white border-red-600";
      case "dark-red": return "bg-red-700 text-white border-red-800";
      case "gold": return "bg-yellow-400 text-yellow-900 border-yellow-500";
      case "maroon": return "bg-rose-900 text-white border-rose-950";
      default: return "bg-red-500 text-white";
    }
  };

  const getIcon = (name) => {
    if (name === "First Drop") return "🩸";
    if (name === "Life Saver") return "❤️";
    if (name === "Frequent Donor") return "🔁";
    if (name === "Champion") return "👑";
    if (name === "Consistent Hero") return "🌟";
    return "🏅";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🏆</span>
        <h2 className="text-2xl font-bold text-gray-800">My Achievements</h2>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center border border-gray-200">
        <span className="font-semibold text-gray-700">You have earned {earnedBadges.length} out of {allBadges.length} badges</span>
        <div className="w-1/2 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all" 
            style={{ width: `${(earnedBadges.length / (allBadges.length || 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allBadges.map(badge => {
          const isEarned = earnedBadgeIds.includes(badge._id.toString());
          const earnedInfo = earnedBadges.find(eb => eb.badgeId._id.toString() === badge._id.toString());

          return (
            <div 
              key={badge._id} 
              className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all ${getTierColor(badge.tier, isEarned)} ${isEarned ? 'shadow-md transform hover:-translate-y-1' : 'grayscale opacity-70 border-gray-200'}`}
            >
              {!isEarned && (
                <div className="absolute top-2 right-2 text-gray-400">🔒</div>
              )}
              {isEarned && (
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
              )}
              <div className="text-5xl mb-3 relative z-10">{getIcon(badge.name)}</div>
              <h3 className={`font-bold text-lg mb-1 relative z-10 ${isEarned ? '' : 'text-gray-500'}`}>{badge.name}</h3>
              {isEarned ? (
                <p className="text-xs opacity-90 relative z-10">
                  Earned {new Date(earnedInfo.earnedAt).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-xs text-gray-400 relative z-10">Keep donating to unlock</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
