import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MdBloodtype } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
        setError("All fields are required");
        return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      // const response = await fetch("http://localhost:5000/api/auth/login", {
      const response = await fetch("https://blood-hive-backend-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful!");
      navigate("/"); // Redirect to home
    } catch (err) {
      setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
      // Mock Google login
      alert("Sign in with Google functionality would be implemented here.");
  };

  const handleGuestLogin = async () => {
      setError("");
      setIsSubmitting(true);
      try {
          // const response = await fetch("http://localhost:5000/api/auth/guest", {
          const response = await fetch("https://blood-hive-backend-1.onrender.com/api/auth/guest", {
              method: "POST",
              headers: { "Content-Type": "application/json" }
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Guest Login failed");

          localStorage.setItem("userToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          navigate("/");
      } catch (err) {
          setError(err.message);
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen flex w-full font-[Inter]">
      {/* Left section - Image/Hero */}
      <div className="hidden lg:flex flex-col w-1/2 relative justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1615461066841-6116e6e02428?auto=format&fit=crop&q=80"
          alt="Medical professionals"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col items-center text-center px-8 text-white">
          <MdBloodtype className="text-8xl text-red-500 mb-6 drop-shadow-lg" />
          <h1 className="text-5xl font-bold mb-4 tracking-tight drop-shadow-md">Join the Hive.<br />Save Lives.</h1>
          <p className="text-xl max-w-md text-gray-200 drop-shadow">
            Your single donation can bring hope and healing. Be the reason someone smiles today.
          </p>
        </div>
      </div>

      {/* Right section - Form */}
      <div className="flex flex-col w-full lg:w-1/2 bg-white justify-center px-8 sm:px-16 md:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded shadow-sm">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-colors shadow-sm`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'} focus:outline-none focus:ring-2 focus:border-transparent transition-colors shadow-sm pr-10`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye className="text-xl" /> : <FiEyeOff className="text-xl" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
               <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
               </label>
               <a href="#" className="text-sm text-red-600 hover:text-red-500 font-medium">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-semibold transition-all hover:shadow-lg active:scale-[0.98]"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-4">
              <span className="h-px w-full bg-gray-200"></span>
              <span className="text-gray-500 text-sm">or</span>
              <span className="h-px w-full bg-gray-200"></span>
          </div>

          <button
              onClick={handleGoogleLogin}
              type="button"
              className="mt-6 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 font-medium transition-all hover:shadow-md active:scale-[0.98]"
          >
              <FcGoogle className="text-2xl mr-3" />
              Sign in with Google
          </button>

          <button
              onClick={handleGuestLogin}
              type="button"
              disabled={isSubmitting}
              className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 font-medium transition-all hover:shadow-md active:scale-[0.98]"
          >
              Continue as Guest
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-red-600 hover:text-red-500 font-semibold hover:underline">
              Sign up today
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
