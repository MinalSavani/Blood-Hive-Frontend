import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

// --- Animation Variants ---
const slideVariants = {
  initial: { opacity: 0, x: 80, scale: 0.98 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: -80, scale: 0.98 },
};
const transition = { type: "spring", stiffness: 260, damping: 28 };

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// ---- Error Display Component ----
const QuizError = ({ message }) => {
  if (!message) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="bg-red-50 border-l-4 border-red-500 p-4 mt-2 mb-4 rounded-r-lg flex items-center shadow-sm"
      role="alert" aria-live="polite">
      <span className="text-xl mr-3">⚠️</span>
      <p className="text-red-700 font-medium text-sm">{message}</p>
    </motion.div>
  );
};

// ---- Field Input ----
const Field = ({ label, placeholder, type = "text", field, value, error, icon, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(field, e.target.value)}
        className={`w-full ${icon ? "pl-11" : "pl-4"} pr-4 py-3.5 rounded-xl border-2 text-gray-800 font-medium transition-all outline-none bg-gray-50
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-red-400 focus:bg-white"}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1 font-medium">⚠ {error}</p>}
  </div>
);

// ---- Number Picker ----
const NumPicker = ({ field, value, min, max, unit, error, onChange }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex items-center gap-6 mt-4 mb-2">
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => onChange(field, Math.max(min, value - 1))}
        className="w-14 h-14 rounded-full bg-white border-2 border-red-200 text-red-600 text-2xl font-bold shadow hover:bg-red-50 transition">−</motion.button>
      <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-red-50 to-rose-100 border-4 ${error ? 'border-red-600' : 'border-red-400'} shadow-inner`}>
        <span className="text-5xl font-black text-red-600 leading-none">{value}</span>
        <span className="text-xs font-bold text-red-400 mt-1 uppercase tracking-wider">{unit}</span>
      </div>
      <motion.button whileTap={{ scale: 0.85 }} onClick={() => onChange(field, Math.min(max, value + 1))}
        className="w-14 h-14 rounded-full bg-white border-2 border-red-200 text-red-600 text-2xl font-bold shadow hover:bg-red-50 transition">+</motion.button>
    </div>
    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
  </div>
);

// ---- Yes/No Cards ----
const YesNo = ({ field, value, error, onChange }) => (
  <div className="flex flex-col">
    <QuizError message={error} />
    <div className="grid grid-cols-2 gap-4 mt-2 mb-6">
      {["Yes", "No"].map(opt => {
        const sel = value === opt;
        const isYes = opt === "Yes";
        let bgClass = "bg-white text-gray-500 border-gray-200 hover:border-gray-300";
        
        if (sel) {
          bgClass = isYes 
            ? "border-green-500 bg-green-50 text-green-600 shadow-lg shadow-green-100" 
            : "border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-100";
        } else if (error) {
          bgClass = "border-red-300 bg-red-50 text-red-500";
        }

        return (
          <motion.button key={opt} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => onChange(field, opt)}
            aria-pressed={sel}
            className={`relative py-8 rounded-2xl border-2 font-bold text-xl transition-all duration-200 ${bgClass} ${error && !sel ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
            {sel && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${isYes ? "bg-green-500" : "bg-red-500"}`}>
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  {isYes ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                </svg>
              </motion.div>
            )}
            <div className="text-4xl mb-2">{isYes ? "✅" : "❌"}</div>
            {opt}
          </motion.button>
        );
      })}
    </div>
  </div>
);

// ---- Main Quiz Component ----
const EligibilityQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "", email: "", phone: "",
    bloodType: "", location: "",
    age: 25, weight: 60,
    illness: null, tattoo: null,
  });
  const [errors, setErrors] = useState({});
  const [isEligible, setIsEligible] = useState(null);
  const [reason, setReason] = useState("");
  const [winSize, setWinSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const errorRef = useRef(null);

  useEffect(() => {
    const onResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Load persistence
  useEffect(() => {
    let updatedData = {};
    
    const saved = sessionStorage.getItem("quiz_progress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) updatedData = { ...parsed.data };
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.name) updatedData.name = parsedUser.name;
        if (parsedUser.email) updatedData.email = parsedUser.email;
      } catch (e) {}
    }

    if (Object.keys(updatedData).length > 0) {
      setData(prev => ({ ...prev, ...updatedData }));
    }
  }, []);

  // Save persistence
  useEffect(() => {
    if (isEligible === null) {
      sessionStorage.setItem("quiz_progress", JSON.stringify({ data, step }));
    }
  }, [data, step, isEligible]);

  const handleFieldChange = (field, val) => {
    setData(d => ({ ...d, [field]: val }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = (checkAll = false) => {
    const e = {};
    if (checkAll || step === 1) {
      if (!data.name.trim()) e.name = "Name is required";
      if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
      if (!data.phone.match(/^\d{10}$/)) e.phone = "10-digit phone required";
    }
    if (checkAll || step === 2) {
      if (!data.bloodType) e.bloodType = "Select your blood type";
      if (!data.location.trim()) e.location = "Location is required";
    }
    if (checkAll || step === 3) {
      if (typeof data.age !== "number" || data.age < 18 || data.age > 65) e.age = "Age must be 18–65";
    }
    if (checkAll || step === 4) {
      if (typeof data.weight !== "number" || data.weight < 50) e.weight = "Weight must be at least 50kg";
    }
    if (checkAll || step === 5) {
      if (data.illness === null || data.illness === undefined) {
        e.illness = "Please answer this question to continue";
      }
    }
    if (checkAll || step === 6) {
      if (data.tattoo === null || data.tattoo === undefined) {
        e.tattoo = "Please answer this question to continue";
      }
    }
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { 
      setErrors(e); 
      setTimeout(() => {
         if (errorRef.current) errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return; 
    }
    
    // Ineligibility Checks
    if (step === 3 && (data.age < 18 || data.age > 65)) {
      setIsEligible(false);
      setReason(`You must be between 18 and 65 years old to donate. You are currently ${data.age}.`);
      return;
    }
    if (step === 4 && data.weight < 50) {
      setIsEligible(false);
      setReason(`You must weigh at least 50 kg to donate safely. You are currently ${data.weight} kg.`);
      return;
    }
    if (step === 5) {
      if (data.illness === "Yes") {
        setIsEligible(false);
        setReason("You cannot donate if you had a recent illness in the last 3 months. Please wait until you fully recover.");
        return;
      }
    }
    if (step === 6) {
      if (data.tattoo === "Yes") {
        setIsEligible(false);
        setReason("You must wait 6 months after getting a tattoo or piercing to donate blood for safety reasons.");
        return;
      }
      
      const allErrors = validate(true);
      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        setStep(1); // Or find the first step with error
        return;
      }

      sessionStorage.removeItem("quiz_progress");
      setIsEligible(true);
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => Math.max(1, s - 1));
  const progress = Math.round((step / 6) * 100);

  // ---- Disqualified Screen ----
  if (isEligible === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring" }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center">
          <div className="text-7xl mb-6">😢</div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">Not Eligible Today</h2>
          <p className="text-gray-500 text-base leading-relaxed mb-8">{reason}</p>
          <p className="text-sm text-gray-400 mb-6">Don't worry! You can try again once your situation changes.</p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setStep(1); setIsEligible(null); setData({ name:"", email:"", phone:"", bloodType:"", location:"", age:25, weight:60, illness:null, tattoo:null }); sessionStorage.removeItem("quiz_progress"); }}
            className="w-full py-4 bg-gray-800 text-white font-bold rounded-2xl hover:bg-gray-700 transition">
            Start Over
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ---- Eligible Screen ----
  if (isEligible === true) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4 overflow-hidden">
        <Confetti width={winSize.w} height={winSize.h} recycle={false} numberOfPieces={500} colors={["#C0392B","#E74C3C","#27AE60","#F1C40F","#8E44AD"]} />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
            className="text-8xl mb-6">🎉</motion.div>
          <h2 className="text-4xl font-black text-gray-800 mb-2">You're Eligible!</h2>
          <p className="text-gray-500 mb-2">Hey <span className="font-bold text-red-600">{data.name.split(" ")[0]}</span>! You're all set to save lives.</p>
          <p className="text-gray-400 text-sm mb-8">Your form has been pre-filled. Just complete your registration!</p>
          <motion.button whileHover={{ scale: 1.04, boxShadow: "0 12px 30px rgba(192,57,43,0.35)" }} whileTap={{ scale: 0.97 }}
            onClick={() => {
              const isLogged = !!localStorage.getItem("userToken");
              navigate(isLogged ? "/donate" : "/register", { 
                state: { name: data.name, email: data.email, phone: data.phone, bloodType: data.bloodType, location: data.location, age: data.age, weight: data.weight } 
              });
            }}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-lg rounded-2xl shadow-lg transition flex items-center justify-center gap-2">
            Proceed to Donate →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ---- Main Quiz ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 flex flex-col items-center pt-12 pb-8 px-4"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap'); .animate-\\[shake_0\\.5s_ease-in-out\\] { animation: shake 0.5s ease-in-out; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } }"}</style>

      {/* Animated blood drop */}
      <motion.div animate={{ y: [0, -12, 0], scale: [1, 1.07, 1] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className="text-red-500 mb-8 drop-shadow-lg">
        <svg width="52" height="68" viewBox="0 0 52 68" fill="currentColor">
          <path d="M26 0C26 0 2 28.5 2 42C2 55.3 12.7 66 26 66C39.3 66 50 55.3 50 42C50 28.5 26 0 26 0Z"/>
          <ellipse cx="18" cy="36" rx="5" ry="8" fill="rgba(255,255,255,0.25)" transform="rotate(-20 18 36)"/>
        </svg>
      </motion.div>

      <div className="w-full max-w-lg" ref={errorRef}>
        {/* Header */}
        <div className="mb-6 px-1">
          <div className="flex items-center gap-3 mb-5">
            {step > 1 && (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-100 text-gray-500 hover:text-red-500 transition">
                ←
              </motion.button>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-900">Eligibility Check</h1>
              <p className="text-gray-400 text-sm">Let's make sure you're ready to save lives ❤️</p>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex gap-2 mb-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} animate={{ width: step === i + 1 ? 28 : 8 }}
                onClick={() => { if(i + 1 < step) setStep(i + 1); }}
                className={`h-2 rounded-full transition-all ${i + 1 < step ? "bg-green-400 cursor-pointer" : i + 1 === step ? "bg-red-500" : "bg-gray-200"}`}/>
            ))}
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-400">
            <span>STEP {step} OF 6</span>
            <span className="text-red-500">{progress}%</span>
          </div>
          <div className="mt-2 w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-red-400 to-rose-600"/>
          </div>
        </div>

        {/* Step Card */}
        <div className="relative bg-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial="initial" animate="in" exit="out" variants={slideVariants} transition={transition}
              className="p-8 md:p-10">

              {/* STEP 1 — Personal Info */}
              {step === 1 && (
                <div>
                  <div className="text-5xl mb-4">👋</div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Tell us about yourself</h2>
                  <p className="text-gray-400 text-sm mb-6">Your details will be auto-filled in the form</p>
                  <Field label="Full Name" placeholder="e.g. Minal Savani" field="name" value={data.name} error={errors.name} icon="👤" onChange={handleFieldChange} />
                  <Field label="Email Address" placeholder="you@example.com" type="email" field="email" value={data.email} error={errors.email} icon="📧" onChange={handleFieldChange} />
                  <Field label="Phone Number" placeholder="10-digit mobile number" type="tel" field="phone" value={data.phone} error={errors.phone} icon="📱" onChange={handleFieldChange} />
                </div>
              )}

              {/* STEP 2 — Medical Info */}
              {step === 2 && (
                <div>
                  <div className="text-5xl mb-4">🩸</div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Medical & Location</h2>
                  <p className="text-gray-400 text-sm mb-6">Help us match your blood to the right need</p>
                  <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wider">Blood Type</label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {BLOOD_TYPES.map(bt => (
                      <motion.button key={bt} whileTap={{ scale: 0.93 }} onClick={() => handleFieldChange("bloodType", bt)}
                        className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                          data.bloodType === bt ? "bg-red-500 border-red-500 text-white shadow-md" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-red-300"
                        }`}>{bt}</motion.button>
                    ))}
                  </div>
                  {errors.bloodType && <p className="text-red-500 text-xs mb-3 font-medium">⚠ {errors.bloodType}</p>}
                  <Field label="Your Location / City" placeholder="e.g. Surat, Gujarat" field="location" value={data.location} error={errors.location} icon="📍" onChange={handleFieldChange} />
                </div>
              )}

              {/* STEP 3 — Age */}
              {step === 3 && (
                <div>
                  <div className="text-5xl mb-4">🎂</div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">How old are you?</h2>
                  <p className="text-gray-400 text-sm mb-4">You must be between <span className="font-bold text-red-500">18 and 65</span> to donate</p>
                  <NumPicker field="age" value={data.age} min={10} max={90} unit="Years" error={errors.age} onChange={handleFieldChange} />
                </div>
              )}

              {/* STEP 4 — Weight */}
              {step === 4 && (
                <div>
                  <div className="text-5xl mb-4">⚖️</div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">What's your weight?</h2>
                  <p className="text-gray-400 text-sm mb-4">You must weigh at least <span className="font-bold text-red-500">50 kg</span> to safely donate</p>
                  <NumPicker field="weight" value={data.weight} min={30} max={150} unit="kg" error={errors.weight} onChange={handleFieldChange} />
                </div>
              )}

              {/* STEP 5 — Illness */}
              {step === 5 && (
                <div>
                  <div className="text-5xl mb-4">🤒</div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Recent illness?</h2>
                  <p className="text-gray-400 text-sm mb-2">Have you had any <span className="font-bold text-gray-600">fever, cold, or illness</span> in the last 3 months?</p>
                  <YesNo field="illness" value={data.illness} error={errors.illness} onChange={handleFieldChange} />
                </div>
              )}

              {/* STEP 6 — Tattoo */}
              {step === 6 && (
                <div>
                  <div className="text-5xl mb-4">🎨</div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">Tattoos or piercings?</h2>
                  <p className="text-gray-400 text-sm mb-2">Did you get a <span className="font-bold text-gray-600">tattoo or body piercing</span> in the last 6 months?</p>
                  <YesNo field="tattoo" value={data.tattoo} error={errors.tattoo} onChange={handleFieldChange} />
                </div>
              )}

              {/* Next Button */}
              <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(192,57,43,0.28)" }} whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="w-full mt-2 py-4 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-lg rounded-2xl shadow-lg transition flex items-center justify-center gap-2">
                {step === 6 ? "🩸 Check Eligibility" : "Continue →"}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">🔒 Your info is only used to pre-fill the donation form</p>
      </div>
    </div>
  );
};

export default EligibilityQuiz;
