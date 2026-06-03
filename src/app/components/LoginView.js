"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import Logo from "./Logo";

export default function LoginView({ onLogin, onBackToHome }) {
  const [email, setEmail] = useState("sumit@churnfix.io");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4 md:p-6 font-sans">
      
      {/* Back Button */}
      <button 
        onClick={onBackToHome}
        className="absolute top-6 left-6 text-xs font-bold text-muted-text hover:text-navy flex items-center gap-1.5 bg-neutral-surface border border-border-clean px-3 py-1.5 rounded-sharp transition-colors cursor-pointer"
      >
        <ArrowLeft size={12} /> Back to home
      </button>

      {/* Main Container */}
      <div className="w-full max-w-[1000px] bg-neutral-surface border border-border-clean rounded-[8px] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] shadow-none">
        
        {/* Left Visual Banner (login img.jpg) */}
        <div 
          className="md:col-span-5 relative bg-cover bg-center p-8 flex flex-col justify-between text-neutral-surface overflow-hidden min-h-[280px] md:min-h-auto"
          style={{ backgroundImage: "url('/login img.jpg')" }}
        >
          {/* Subtle overlay tint to ensure text remains readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-navy/10 z-0" />
          
          {/* Top Brand Name */}
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
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Monitor Silently
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold font-display leading-[1.25] text-white tracking-tight">
              Intercept payment declines, trigger automated dunning, and protect recurring revenue.
            </h2>
          </div>
        </div>

        {/* Right Form Console */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <span className="text-primary text-xl font-bold font-display select-none">*</span>
            <h1 className="text-2xl font-black text-navy font-display tracking-tight mt-1">
              Initialize Console
            </h1>
            <p className="text-xs text-muted-text mt-2 leading-relaxed max-w-md">
              Sync billing providers, monitor real-time recovery logs, and configure access authorization webhooks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Admin Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-navy uppercase tracking-wider" htmlFor="login-email">
                Admin Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                className="w-full border border-border-clean rounded-sharp px-3.5 py-2.5 text-xs bg-neutral-bg focus:bg-white focus:border-primary focus:outline-none transition-colors"
                placeholder="natalia.brak@knmstudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Console Passkey */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[10px] font-bold text-navy uppercase tracking-wider" htmlFor="login-password">
                Console Passkey
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full border border-border-clean rounded-sharp pl-3.5 pr-10 py-2.5 text-xs bg-neutral-bg focus:bg-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-text hover:text-navy cursor-pointer bg-transparent border-none p-0 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-neutral-surface text-xs font-bold py-3.5 px-4 rounded-sharp transition-colors border-none mt-2 cursor-pointer uppercase tracking-wider font-display"
            >
              Connect Terminal
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] bg-border-clean flex-1" />
              <span className="text-[9px] font-bold text-muted-text uppercase tracking-widest">Or Continue With</span>
              <div className="h-[1px] bg-border-clean flex-1" />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={onLogin}
                className="btn border border-border-clean hover:border-navy bg-white py-2.5 rounded-sharp flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                aria-label="Continue with Google"
              >
                <svg className="w-3.5 h-3.5 text-muted-text" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.706 0 3.26.612 4.47 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.582 1 2 5.582 2 11.24s4.582 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.69-.08-1.355-.22-1.955H12.24z"/>
                </svg>
              </button>
              <button 
                onClick={onLogin}
                className="btn border border-border-clean hover:border-navy bg-white py-2.5 rounded-sharp flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                aria-label="Continue with Github"
              >
                <svg className="w-3.5 h-3.5 text-muted-text" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </button>
              <button 
                onClick={onLogin}
                className="btn border border-border-clean hover:border-navy bg-white py-2.5 rounded-sharp flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                aria-label="Continue with Apple"
              >
                <svg className="w-3.5 h-3.5 text-muted-text" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.74-1.2 1.88-1.05 3 .95.07 2.1-.53 3-1.44z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs">
            <span className="text-muted-text">Don't have an account? </span>
            <button 
              onClick={onLogin}
              className="text-primary hover:underline font-bold bg-transparent border-none cursor-pointer p-0"
            >
              Sign up
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
