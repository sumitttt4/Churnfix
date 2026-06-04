"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      });
    } catch (err) {
      setError("Something went wrong with Google sign in.");
      setLoadingGoogle(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Could not create account");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 md:p-6 font-body antialiased">
      
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-xs font-bold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-md transition-colors no-underline"
      >
        <ArrowLeft size={12} /> Back to home
      </Link>

      {/* Main Container */}
      <div className="w-full max-w-[1000px] bg-white border border-[#E2E8F0] rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] shadow-sm">
        
        {/* Left Visual Banner */}
        <div 
          className="md:col-span-5 relative bg-cover bg-center p-8 flex flex-col justify-between text-white overflow-hidden min-h-[280px] md:min-h-auto"
          style={{ backgroundImage: "url('/login img.jpg')" }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/50 to-[#0F172A]/10 z-0" />
          
          {/* Top Brand */}
          <div className="z-10 flex items-center gap-2 text-white">
            <svg
              className="w-6 h-6 text-white flex-shrink-0"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <g>
                <path d="M 50,125 C 80,110 100,75 100,75 C 100,75 120,110 150,125 C 110,100 100,95 100,95 C 100,95 90,100 50,125 Z" fill="currentColor"/>
                <path d="M 60,135 C 85,123 100,92 100,92 C 100,92 115,123 140,135 C 110,113 100,108 100,108 C 100,108 90,113 60,135 Z" fill="#036348" opacity="0.5"/>
              </g>
            </svg>
            <span className="font-display text-[15px] font-bold tracking-[-0.03em] uppercase">
              churnfix
            </span>
          </div>

          {/* Bottom Headline */}
          <div className="z-10 mt-auto flex flex-col gap-3">
            <span className="text-[10px] font-bold tracking-widest text-[#E6F6F1] uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Revenue Protection Active
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.02em] leading-tight">
              Start recovering
              <br />
              failed <span className="text-[#10B981]">payments</span>
              <br />
              in minutes.
            </h2>
          </div>
        </div>

        {/* Right Signup Form */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold text-[#0F172A] tracking-[-0.02em]">
                Create your account
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Zero code or developer intervention required.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="signup-name" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-[#E2E8F0] rounded-md py-2.5 px-3.5 text-sm bg-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Work Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full border border-[#E2E8F0] rounded-md py-2.5 px-3.5 text-sm bg-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full border border-[#E2E8F0] rounded-md py-2.5 px-3.5 pr-10 text-sm bg-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] bg-transparent border-none cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-bold py-3 px-4 rounded-lg cursor-pointer transition-all duration-300 border-none flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-[#94A3B8] font-medium uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold py-3 px-4 rounded-lg cursor-pointer transition-all duration-300 border border-slate-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingGoogle ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Sign in with Google
            </button>

            <p className="text-[11px] text-[#94A3B8] mt-4 text-center">
              By signing up, you agree to our <Link href="/terms" className="text-[#64748B] hover:text-[#0F172A] underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="text-[#64748B] hover:text-[#0F172A] underline underline-offset-2">Privacy Policy</Link>.
            </p>

            <div className="mt-8 text-center text-sm text-[#64748B]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#10B981] font-bold hover:text-[#059669] no-underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
