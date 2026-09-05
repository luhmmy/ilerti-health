'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const destination = user?.email || 'your email and phone';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(value.length - 1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 filled
    if (newOtp.every(v => v !== '') && !isVerifying) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code = otp.join('')) => {
    if (code.length !== 6) return;
    
    setIsVerifying(true);
    try {
      await api.auth.verifyOtp({
        emailOrPhone: user?.email || '',
        otp: code,
      });
      toast.success('Account verified successfully! Welcome to ILERTI Health.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Invalid verification code. Please check and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await api.auth.resendOtp({
        emailOrPhone: user?.email || '',
      });
      setCountdown(59);
      toast.success('A new 6-digit verification code was sent via SMS and Email.');
    } catch (err: any) {
      toast.error(err?.message || 'Could not resend code. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-sm border border-slate-200 text-center sm:text-left">
      <div className="mb-6">
        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-4 mx-auto sm:mx-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Verify Your Account</h2>
        <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
          We dispatched a 6-digit verification code via SMS and Email to{' '}
          <span className="font-semibold text-slate-800">{destination}</span>.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold text-slate-900 border-2 border-slate-200 rounded-2xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors"
            />
          ))}
        </div>

        <button
          onClick={() => handleVerify()}
          disabled={isVerifying || otp.some(d => d === '')}
          className="w-full py-4 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isVerifying ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Verifying Code...
            </div>
          ) : (
            'Confirm & Continue'
          )}
        </button>

        <div className="flex flex-col items-center sm:items-start gap-3 pt-2">
          <p className="text-xs text-slate-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className={`font-bold ${countdown > 0 ? 'text-slate-400' : 'text-teal-600 hover:underline'}`}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Now'}
            </button>
          </p>
          
          <Link href="/signup" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
