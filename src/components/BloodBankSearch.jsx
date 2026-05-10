import { useState, useEffect, useRef } from "react";
import { FiBell, FiMapPin } from "react-icons/fi";
import { requestFcmToken } from "../firebase";
import axios from "axios";

const BloodBankSearch = () => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [results, setResults] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
  ];
  
  const cities = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
    "Assam": ["Guwahati", "Dibrugarh", "Silchar"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
    "Haryana": ["Chandigarh", "Faridabad", "Gurgaon"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangalore"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur"],
    "Meghalaya": ["Shillong", "Tura", "Jowai"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
    "Punjab": ["Amritsar", "Ludhiana", "Jalandhar"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
    "Delhi": ["New Delhi", "South Delhi", "East Delhi"]
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // Initialize map
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapRef.current && !map) {
      // Clear any existing map content
      if (mapRef.current._leaflet_id) {
        mapRef.current.innerHTML = '';
      }
      
      const leafletMap = window.L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Center of India
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMap);
      
      setMap(leafletMap);
      
      // Cleanup function
      return () => {
        if (leafletMap) {
          leafletMap.remove();
        }
      };
    }
  }, []);

  // Update markers when results change
  useEffect(() => {
    if (map && results.length > 0) {
      // Clear existing markers safely
      markers.forEach(marker => {
        if (marker && map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      });
      
      const newMarkers = results.map((bloodBank, index) => {
        if (bloodBank.lat && bloodBank.lng) {
          const isAvailable = bloodBank.availability.toLowerCase() === 'available';
          const markerColor = isAvailable ? '#22c55e' : '#ef4444'; // green or red
          
          const marker = window.L.circleMarker([bloodBank.lat, bloodBank.lng], {
            radius: 8,
            fillColor: markerColor,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);
          
          marker.bindPopup(`
            <div class="text-center">
              <strong>${bloodBank.name}</strong><br/>
              ${bloodBank.city}, ${bloodBank.state}<br/>
              <span class="font-bold" style="color: ${markerColor}">
                ${bloodBank.availability}
              </span>
            </div>
          `);
          
          marker.on('click', () => {
            setHighlightedRow(index);
            // Scroll to the table row
            const tableRows = document.querySelectorAll('tbody tr');
            if (tableRows[index]) {
              tableRows[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
          
          return marker;
        }
        return null;
      }).filter(Boolean);
      
      setMarkers(newMarkers);
      
      // Fit map to show all markers
      if (newMarkers.length > 0) {
        const group = new window.L.featureGroup(newMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    } else if (map && results.length === 0) {
      // Clear all markers if no results
      markers.forEach(marker => {
        if (marker && map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      });
      setMarkers([]);
    }
  }, [results, map]);

  // Handle user location
  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          if (map) {
            // Add user location marker
            const userMarker = window.L.marker([latitude, longitude], {
              icon: window.L.divIcon({
                html: '📍',
                iconSize: [20, 20],
                className: 'user-location-marker'
              })
            }).addTo(map);
            
            userMarker.bindPopup('Your Location').openPopup();
            
            // Center map on user location
            map.setView([latitude, longitude], 10);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSearch = async () => {
    try {
      if (!state || !city || !bloodGroup) {
        alert("Please select all fields!");
        return;
      }
  
      const encodedBloodGroup = encodeURIComponent(bloodGroup);
      const response = await fetch(
        `http://localhost:5000/api/bloodbanks?state=${state}&city=${city}&bloodGroup=${encodedBloodGroup}`
      );
  
      const data = await response.json();
      setResults(data);
      setHighlightedRow(null); // Reset highlighted row when searching

      if (data.length === 0) {
        // No auto-alert! The user must click "Notify Me" instead.
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-pink-100 min-h-screen">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mb-4 sm:mb-6 text-center">
        🔎 Search Blood Bank Availability
      </h2>

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 max-w-4xl mx-auto">
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          aria-label="Select State"
          className="w-full sm:w-auto sm:min-w-[180px] p-3 border-2 border-red-400 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="Select City"
          className="w-full sm:w-auto sm:min-w-[180px] p-3 border-2 border-red-400 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
          disabled={!state}
        >
          <option value="">Select City</option>
          {state &&
            cities[state].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>

        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          aria-label="Select Blood Group"
          className="w-full sm:w-auto sm:min-w-[180px] p-3 border-2 border-red-400 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 active:scale-[0.97]"
        >
          Search
        </button>

        <button
          onClick={handleUseMyLocation}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 active:scale-[0.97]"
          title="Use my current location"
        >
          <FiMapPin className="text-lg" />
          <span>Use My Location</span>
        </button>

        <button
          onClick={async () => {
            if (!state || !city || !bloodGroup) {
              alert("Please select State, City, and Blood Group to receive notifications!");
              return;
            }
            try {
              const token = await requestFcmToken();
              if (token) {
                // Subscribe user to their city's restock topic
                const topicName = `city-${city.replace(/[^a-zA-Z0-9]/g, '')}`;
                await axios.post("http://localhost:5000/api/fcm/subscribe", { 
                  token, 
                  topic: topicName 
                });
                
                // Create the pending alert in the database so the backend knows they are waiting
                await fetch("http://localhost:5000/api/blood-alerts", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ state, city, bloodGroup })
                });

                alert(`🔔 Success! You will receive a high-priority notification as soon as ${bloodGroup} blood is added in ${city}.`);
              } else {
                alert("Please enable notifications so we can alert you!");
              }
            } catch (err) {
              console.error("Failed to setup notification", err);
              alert("Something went wrong. Please try again.");
            }
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-white hover:bg-red-50 text-red-600 font-bold border-2 border-red-500 rounded-lg shadow-md transition-all duration-300 active:scale-[0.97]"
          title="Get notified about this blood group"
        >
          <FiBell className="text-lg" />
          <span>Notify Me</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="max-w-5xl mx-auto mb-6">
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg shadow-lg border-2 border-red-300"
          style={{ height: '400px' }}
        />
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full max-w-5xl mx-auto border-collapse border border-red-400 shadow-lg min-w-[500px]">
          <thead>
            <tr className="bg-red-500 text-white">
              <th className="border border-red-400 p-2 sm:p-3 text-xs sm:text-sm md:text-base">S.No</th>
              <th className="border border-red-400 p-2 sm:p-3 text-xs sm:text-sm md:text-base">Blood Bank</th>
              <th className="border border-red-400 p-2 sm:p-3 text-xs sm:text-sm md:text-base">Availability</th>
              <th className="border border-red-400 p-2 sm:p-3 text-xs sm:text-sm md:text-base">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((item, index) => (
                <tr 
                  key={index} 
                  className={`text-center bg-white hover:bg-pink-200 transition ${
                    highlightedRow === index ? 'bg-yellow-200 ring-2 ring-yellow-400' : ''
                  }`}
                >
                  <td className="border border-red-300 p-2 sm:p-3 text-xs sm:text-sm md:text-base">{index + 1}</td>
                  <td className="border border-red-300 p-2 sm:p-3 font-semibold text-red-700 text-xs sm:text-sm md:text-base">
                    {item.name}
                  </td>
                  <td className="border border-red-300 p-2 sm:p-3 font-bold text-red-600 text-xs sm:text-sm md:text-base">
                    {item.availability}
                  </td>
                  <td className="border border-red-300 p-2 sm:p-3 text-xs sm:text-sm md:text-base">{item.lastUpdated}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 sm:p-6 font-semibold text-red-600 text-sm sm:text-base">
                  No results found 😔
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BloodBankSearch;
