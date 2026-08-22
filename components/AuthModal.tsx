'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Globe, Mail, Lock, User, Eye, EyeOff, X, ShieldCheck,
  Loader2, ArrowRight, KeyRound, RefreshCw, CheckCircle2, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AuthStep = 'choose' | 'login' | 'signup' | 'otp' | 'success';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  otp?: string;
}

const DEMO_ACCOUNTS = [
  { name: 'Aarav Shah',   email: 'aarav@globetrotter.io',  avatar: '🧭', currency: 'INR' },
  { name: 'Elena Vasquez', email: 'elena@globetrotter.io', avatar: '🗺️', currency: 'EUR' },
  { name: 'Kai Nakamura',  email: 'kai@globetrotter.io',   avatar: '✈️', currency: 'JPY' },
];

export default function AuthModal() {
  const {
    isAuthOpen,
    setIsAuthOpen,
    login,
    sendSignupOtp,
    verifySignupOtp,
    firebaseSignUp,
    firebaseLogin,
    googleSignIn,
    showToast,
  } = useApp();

  const [step, setStep] = useState<AuthStep>('choose');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthOpen) {
      setTimeout(resetForm, 300);
    }
  }, [isAuthOpen]);

  useEffect(() => {
    if (otpTimer > 0) {
      timerRef.current = setTimeout(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [otpTimer]);

  const resetForm = () => {
    setStep('choose');
    setName('');
    setEmail('');
    setPassword('');
    setOtp(['', '', '', '', '', '']);
    setErrors({});
    setSimulatedOtp(null);
    setOtpTimer(0);
    setLoading(false);
    setShowPassword(false);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (step === 'signup' && !name.trim()) e.name = 'Full name is required';
    if (!email.includes('@') || !email.includes('.')) e.email = 'Enter a valid email address';
    if (step !== 'otp' && password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  /* ── STEP HANDLERS ── */

  const handleSignupSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await sendSignupOtp(email, name);
    setLoading(false);
    if (res.success) {
      setSimulatedOtp(res.simulated_otp ?? null);
      setOtpTimer(600);
      setStep('otp');
    }
  };

  const handleOtpVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setErrors({ otp: 'Enter the full 6-digit code' });
      return;
    }
    setLoading(true);
    const verifyRes = await verifySignupOtp(email, code);
    if (!verifyRes.success) {
      setErrors({ otp: verifyRes.message });
      setLoading(false);
      return;
    }
    const signupRes = await firebaseSignUp(email, password, name);
    setLoading(false);
    if (signupRes.success) {
      setStep('success');
      setTimeout(() => setIsAuthOpen(false), 2000);
    } else {
      setErrors({ otp: signupRes.error || 'Registration failed. Please try again.' });
    }
  };

  const handleLoginSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const res = await firebaseLogin(email, password);
    setLoading(false);
    if (!res.success) {
      setErrors({ password: res.error || 'Invalid credentials. Check your email and password.' });
    }
  };

  const handleResendOtp = async () => {
    setOtpResendLoading(true);
    const res = await sendSignupOtp(email, name);
    setOtpResendLoading(false);
    if (res.success) {
      setSimulatedOtp(res.simulated_otp ?? null);
      setOtpTimer(600);
      setOtp(['', '', '', '', '', '']);
      setErrors({});
      showToast('A fresh verification code has been sent!', 'info');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    await login(demoEmail);
    setLoading(false);
    setIsAuthOpen(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await googleSignIn();
    setLoading(false);
  };

  if (!isAuthOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={() => setIsAuthOpen(false)}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 24 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_32px_80px_0_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Ambient top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent rounded-full" />

          {/* Close */}
          <button
            onClick={() => setIsAuthOpen(false)}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>

          <div className="p-8 pt-10">
            {/* ── CHOOSE STEP ── */}
            <AnimatePresence mode="wait">
              {step === 'choose' && (
                <motion.div key="choose" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <div className="flex flex-col items-center mb-7">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center mb-3 shadow-lg">
                      <Globe className="text-white" size={28} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Welcome to GlobeTrotter</h2>
                    <p className="text-slate-400 text-sm mt-1 text-center">Plan your dream multi-city journey</p>
                  </div>

                  <div className="space-y-3">
                    {/* Google Sign-In */}
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl text-white font-medium transition-all hover:shadow-lg"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )}
                      Continue with Google
                    </button>

                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-slate-500 text-xs uppercase tracking-wider">or</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <button
                      onClick={() => setStep('login')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 rounded-2xl text-teal-300 font-medium transition-all"
                    >
                      <LogIn size={18} /> Sign In with Email
                    </button>

                    <button
                      onClick={() => setStep('signup')}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-2xl text-indigo-300 font-medium transition-all"
                    >
                      <User size={18} /> Create Account
                    </button>
                  </div>

                  {/* Demo accounts */}
                  <div className="mt-6">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 text-center">Quick Demo Access</p>
                    <div className="grid grid-cols-3 gap-2">
                      {DEMO_ACCOUNTS.map(d => (
                        <button
                          key={d.email}
                          onClick={() => handleDemoLogin(d.email)}
                          disabled={loading}
                          className="flex flex-col items-center gap-1 py-2.5 px-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-center group"
                        >
                          <span className="text-xl">{d.avatar}</span>
                          <span className="text-[11px] text-slate-300 group-hover:text-white font-medium leading-tight">{d.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-slate-500">{d.currency}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── LOGIN STEP ── */}
              {step === 'login' && (
                <motion.div key="login" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <button onClick={() => setStep('choose')} className="text-slate-400 hover:text-teal-400 text-sm mb-5 flex items-center gap-1.5 transition-colors">
                    <ArrowRight size={14} className="rotate-180" /> Back
                  </button>
                  <h2 className="text-xl font-bold text-white mb-1">Sign In</h2>
                  <p className="text-slate-400 text-sm mb-6">Welcome back, explorer!</p>

                  <div className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5 block">Email Address</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 rounded-xl text-white placeholder-slate-500 outline-none transition-all text-sm"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5 block">Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 rounded-xl text-white placeholder-slate-500 outline-none transition-all text-sm"
                        />
                        <button onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <button
                      onClick={handleLoginSubmit}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <><LogIn size={18} /> Sign In Securely</>}
                    </button>

                    <button onClick={handleGoogleSignIn} disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all">
                      <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Continue with Google
                    </button>
                  </div>

                  <p className="text-center text-slate-500 text-xs mt-5">
                    New to GlobeTrotter?{' '}
                    <button onClick={() => setStep('signup')} className="text-teal-400 hover:text-teal-300 font-medium">Create account</button>
                  </p>
                </motion.div>
              )}

              {/* ── SIGNUP STEP ── */}
              {step === 'signup' && (
                <motion.div key="signup" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <button onClick={() => setStep('choose')} className="text-slate-400 hover:text-teal-400 text-sm mb-5 flex items-center gap-1.5 transition-colors">
                    <ArrowRight size={14} className="rotate-180" /> Back
                  </button>
                  <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
                  <p className="text-slate-400 text-sm mb-2">A unique OTP will be sent to your email</p>
                  <div className="flex items-center gap-1.5 mb-5 p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                    <ShieldCheck size={14} className="text-teal-400 shrink-0" />
                    <p className="text-teal-300 text-xs">Secured by Firebase Authentication + Email OTP verification</p>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5 block">Full Name</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={name}
                          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 rounded-xl text-white placeholder-slate-500 outline-none transition-all text-sm"
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5 block">Email Address</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 rounded-xl text-white placeholder-slate-500 outline-none transition-all text-sm"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-xs text-slate-400 font-medium mb-1.5 block">Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                          placeholder="At least 6 characters"
                          className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 rounded-xl text-white placeholder-slate-500 outline-none transition-all text-sm"
                        />
                        <button onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <button
                      onClick={handleSignupSubmit}
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                    >
                      {loading
                        ? <Loader2 size={18} className="animate-spin" />
                        : <><Mail size={18} /> Send OTP to Email</>}
                    </button>

                    <button onClick={handleGoogleSignIn} disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all">
                      <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Sign up with Google (skip OTP)
                    </button>
                  </div>

                  <p className="text-center text-slate-500 text-xs mt-5">
                    Already have an account?{' '}
                    <button onClick={() => setStep('login')} className="text-teal-400 hover:text-teal-300 font-medium">Sign in</button>
                  </p>
                </motion.div>
              )}

              {/* ── OTP STEP ── */}
              {step === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <button onClick={() => setStep('signup')} className="text-slate-400 hover:text-teal-400 text-sm mb-5 flex items-center gap-1.5 transition-colors">
                    <ArrowRight size={14} className="rotate-180" /> Back
                  </button>

                  <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400/20 to-indigo-500/20 border border-teal-400/30 flex items-center justify-center mb-3">
                      <KeyRound className="text-teal-400" size={26} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Check Your Email</h2>
                    <p className="text-slate-400 text-sm mt-1 text-center">
                      We sent a unique 6-digit code to<br />
                      <span className="text-teal-400 font-medium">{email}</span>
                    </p>
                  </div>

                  {/* Simulated OTP display for dev */}
                  {simulatedOtp && (
                    <div className="mb-5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2">
                      <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                      <div>
                        <p className="text-amber-300 text-xs font-medium">Dev Mode — Your OTP code:</p>
                        <p className="text-amber-200 text-xl font-mono font-bold tracking-widest">{simulatedOtp}</p>
                        <p className="text-amber-400/60 text-[10px]">(In production, this appears only in your email inbox)</p>
                      </div>
                    </div>
                  )}

                  {/* OTP digit inputs */}
                  <div className="flex gap-2.5 justify-center mb-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all outline-none
                          bg-white/5 text-white placeholder-slate-600
                          ${digit ? 'border-teal-500/60 bg-teal-500/10 shadow-[0_0_12px_rgba(20,184,166,0.2)]' : 'border-white/10'}
                          focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 focus:bg-teal-500/10`}
                      />
                    ))}
                  </div>
                  {errors.otp && <p className="text-red-400 text-xs text-center mb-3">{errors.otp}</p>}

                  {/* Timer */}
                  <div className="flex items-center justify-center gap-1.5 mb-5 text-slate-500 text-xs">
                    {otpTimer > 0
                      ? <span>Code expires in <span className="text-teal-400 font-mono">{Math.floor(otpTimer/60)}:{String(otpTimer%60).padStart(2,'0')}</span></span>
                      : <span className="text-red-400">Code expired</span>}
                  </div>

                  <button
                    onClick={handleOtpVerify}
                    disabled={loading || otp.join('').length < 6}
                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mb-3"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><ShieldCheck size={18} /> Verify & Create Account</>}
                  </button>

                  <button
                    onClick={handleResendOtp}
                    disabled={otpResendLoading || otpTimer > 540}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {otpResendLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    Resend Verification Code
                  </button>
                </motion.div>
              )}

              {/* ── SUCCESS STEP ── */}
              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center py-8">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(20,184,166,0.4)]"
                  >
                    <CheckCircle2 className="text-white" size={40} />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                  <p className="text-slate-400 text-sm text-center">
                    Welcome to GlobeTrotter, <span className="text-teal-400 font-medium">{name}</span>!<br />
                    Your account has been verified and secured via Firebase. ✈️
                  </p>
                  <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                    <ShieldCheck size={14} className="text-teal-400" />
                    <span className="text-teal-300 text-xs font-medium">OTP Verified · Firebase Protected</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
