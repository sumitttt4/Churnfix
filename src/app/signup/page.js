"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      <div className="w-full max-w-[480px] bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm">
        
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-2 mb-8">
            <svg
              className="w-7 h-7 text-[#10B981] flex-shrink-0"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <g>
                <path d="M 50,125 C 80,110 100,75 100,75 C 100,75 120,110 150,125 C 110,100 100,95 100,95 C 100,95 90,100 50,125 Z" fill="currentColor"/>
                <path d="M 60,135 C 85,123 100,92 100,92 C 100,92 115,123 140,135 C 110,113 100,108 100,108 C 100,108 90,113 60,135 Z" fill="#036348" opacity="0.5"/>
              </g>
            </svg>
            <span className="font-display text-lg font-bold tracking-[-0.03em] text-[#0F172A]">
              Churnfix
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold text-[#0F172A] tracking-[-0.02em]">
            Create your account
          </h1>
          <p className="text-sm text-[#64748B] mt-1 mb-6">
            Start recovering failed payments in minutes
          </p>

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
                placeholder="Sumit Kumar"
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

          <p className="text-xs text-[#94A3B8] mt-4 text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className="mt-6 text-center text-sm text-[#64748B]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#10B981] font-bold hover:text-[#059669] no-underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
