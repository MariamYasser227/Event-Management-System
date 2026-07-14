import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  Zap,
  HelpCircle,
  ChevronDown,
  Layers,
} from "lucide-react";

import { useAppContext } from "../context/AppContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showSkipDropdown, setShowSkipDropdown] = useState(false);

  const { accounts, setCurrentUser } = useAppContext();
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
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const matchedAccount = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (matchedAccount) {
      setCurrentUser(matchedAccount);
      if (matchedAccount.role === "admin") navigate("/admin/dashboard");
      else if (matchedAccount.role === "user") navigate("/discover");
      else navigate("/dashboard");
    } else {
      setError("Account not found. Please use a valid mock email or the Dev Mode skip selector below.");
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
      {/* Decorative Radial Gradients matching Figma */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-blue-100/50 to-transparent blur-3xl pointer-events-none" />

      {/* Decorative SVG grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="animate-card max-w-md w-full space-y-8 z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand text-white rounded-2xl shadow-lg mb-4 border border-brand-dark/20">
            <Zap size={28} className="fill-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950">
            EventLogix
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-1.5 uppercase tracking-wider">
            Enterprise Event Operations
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 sm:p-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
            <p className="text-sm text-gray-500">
              Welcome back. Please enter your credentials.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
              <ShieldAlert size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs font-semibold text-brand hover:text-brand-light transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs font-medium text-gray-600"
              >
                Remember this device
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-light shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 border border-brand-dark/10 mt-6"
            >
              <span>Sign In</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
              <span className="bg-white px-3 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* SSO button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-2.5 border border-gray-200 text-gray-700 bg-gray-50 text-xs font-semibold rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all duration-150"
          >
            <ShieldAlert size={14} className="text-brand-light" />
            <span>Enterprise SSO</span>
          </button>

          {/* Skip Dev Button */}
          <div className="relative mt-4">
            <button
              type="button"
              onClick={() => setShowSkipDropdown(!showSkipDropdown)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-amber-600" />
                <span>Skip Authentication (Dev Mode)</span>
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
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-brand hover:text-brand-light transition-colors hover:underline"
          >
            Sign up for an account
          </Link>
        </p>

        {/* Legal Links */}
        <div className="flex justify-center gap-6 text-xs text-gray-400">
          <Link to="#" className="hover:text-gray-600 transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:text-gray-600 transition-colors">
            Terms of Service
          </Link>
          <Link to="#" className="hover:text-gray-600 transition-colors">
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
