import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  Zap,
  Briefcase,
  Layers,
  ChevronDown,
} from "lucide-react";

import { useAppContext } from "../context/AppContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user"); // Emulated default role selection
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showSkipDropdown, setShowSkipDropdown] = useState(false);

  const { accounts, setAccounts, setCurrentUser } = useAppContext();
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".animate-card", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const newAccount = {
      id: `u-${Date.now()}`,
      name: fullName,
      email: email,
      role: selectedRole,
      org: selectedRole === "organizer" ? `${fullName}'s Organization` : null,
      initials: fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
      avatar: null,
      joinedDate: 'Just now',
    };
    setAccounts((prev) => [...prev, newAccount]);
    setCurrentUser(newAccount);
    if (selectedRole === "organizer") {
      navigate("/dashboard");
    } else {
      navigate("/discover");
    }
  };

  const handleSkipAccount = (acc) => {
    setCurrentUser(acc);
    if (acc.role === "admin") navigate("/admin/dashboard");
    else if (acc.role === "user") navigate("/discover");
    else navigate("/dashboard");
  };

  return (
    <div ref={containerRef} className="min-h-screen relative flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-surface overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-indigo-200/35 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100/40 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="animate-card max-w-xl w-full space-y-8 z-10">
        {/* Brand Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950 flex items-center justify-center gap-2">
            <Zap size={24} className="text-brand fill-brand" />
            EventLogix
          </h1>
          <p className="text-sm font-semibold text-gray-400 mt-1.5 uppercase tracking-wider">
            Enterprise-grade event operations
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500">
              Enter your details to get started with our platform.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
              <ShieldAlert size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="full-name"
                className="text-xs font-semibold text-gray-700"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-brand transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-gray-700"
              >
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-brand transition-all duration-200 placeholder:text-gray-400"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-brand transition-all duration-200 placeholder:text-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role Selection Cards per Figma */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-gray-700">
                Select your role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* User Role Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("user")}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border text-center transition-all duration-200 ${
                    selectedRole === "user"
                      ? "bg-indigo-50/50 border-brand shadow-md ring-2 ring-brand/10"
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                      selectedRole === "user"
                        ? "bg-brand text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <User size={18} />
                  </div>
                  <span className="font-bold text-xs text-gray-900">User</span>
                  <span className="text-[10px] text-gray-500 mt-1 max-w-[150px]">
                    Browse and attend events
                  </span>
                </button>

                {/* Organizer Role Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("organizer")}
                  className={`flex flex-col items-center justify-center p-5 rounded-xl border text-center transition-all duration-200 ${
                    selectedRole === "organizer"
                      ? "bg-indigo-50/50 border-brand shadow-md ring-2 ring-brand/10"
                      : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                      selectedRole === "organizer"
                        ? "bg-brand text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Briefcase size={18} />
                  </div>
                  <span className="font-bold text-xs text-gray-900">Organizer</span>
                  <span className="text-[10px] text-gray-500 mt-1 max-w-[150px]">
                    Create and manage events
                  </span>
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-light shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 border border-brand-dark/10 mt-6"
            >
              <span>Create Account</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Dev Skip Action */}
          <div className="relative mt-2">
            <button
              type="button"
              onClick={() => setShowSkipDropdown(!showSkipDropdown)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-amber-600" />
                <span>Skip Registration (Dev Mode)</span>
              </div>
              <ChevronDown
                size={14}
                className={`text-amber-600 transition-transform duration-200 ${
                  showSkipDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSkipDropdown && (
              <div className="absolute bottom-full mb-1.5 w-full bg-white border border-gray-100 shadow-xl rounded-xl p-2 z-20 space-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150 max-h-48 overflow-y-auto">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => handleSkipAccount(acc)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-900">{acc.name}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{acc.email} ({acc.role})</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-brand bg-indigo-50 px-2 py-0.5 rounded-full">
                      {acc.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-bold text-brand hover:text-brand-light transition-colors hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* Legal Links */}
        <div className="flex justify-center gap-6 text-xs text-gray-400 opacity-60">
          <Link to="#" className="hover:text-gray-600 transition-colors">
            Terms of Service
          </Link>
          <Link to="#" className="hover:text-gray-600 transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:text-gray-600 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
