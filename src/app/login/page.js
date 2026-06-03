"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import Logo from "@/app/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password");
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
              Recover failed
              <br />
              <span className="text-[#10B981]">payments</span> before
              <br />
              they become churn.
            </h2>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold text-[#0F172A] tracking-[-0.02em]">
                Welcome back
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Log in to your Churnfix dashboard
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full border border-[#E2E8F0] rounded-md py-2.5 px-3.5 text-sm bg-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] focus:outline-none text-[#0F172A] placeholder:text-[#94A3B8]"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-[#64748B]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#10B981] font-bold hover:text-[#059669] no-underline">
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
