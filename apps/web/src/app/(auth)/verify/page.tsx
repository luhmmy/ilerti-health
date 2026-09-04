'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    // Auto-submit if all filled
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
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      toast.success('Account verified successfully!');
      router.push('/dashboard');
    }, 1500);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(59);
    toast.success('Verification code resent');
  };

  return (
    <div className="w-full text-center sm:text-left">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Verify your account</h2>
        <p className="text-slate-500 mt-2">
          We sent a 6-digit code to <span className="font-medium text-slate-800">j***@example.com</span>
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex justify-center sm:justify-start gap-2 sm:gap-4">
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
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-slate-900 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-0 focus:outline-none transition-colors"
            />
          ))}
        </div>

        <button
          onClick={() => handleVerify()}
          disabled={isVerifying || otp.some(d => d === '')}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isVerifying ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Verifying...
            </div>
          ) : (
            'Verify'
          )}
        </button>

        <div className="flex flex-col items-center sm:items-start gap-4">
          <p className="text-sm text-slate-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className={`font-medium ${countdown > 0 ? 'text-slate-400' : 'text-teal-600 hover:text-teal-500'}`}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
            </button>
          </p>
          
          <Link href="/signup" className="text-sm font-medium text-slate-500 hover:text-slate-700">
            Change email/phone
          </Link>
        </div>
      </div>
    </div>
  );
}
