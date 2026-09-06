// Unified SMS (Termii) and Email (Resend) OTP dispatcher

export interface DispatchResult {
  smsSent: boolean;
  emailSent: boolean;
  smsError?: string;
  emailError?: string;
  code: string;
}

export async function dispatchOtp(
  email: string | undefined, 
  phone: string | undefined, 
  otp: string
): Promise<DispatchResult> {
  const result: DispatchResult = {
    smsSent: false,
    emailSent: false,
    code: otp,
  };

  // 1. Send SMS via Termii (if TERMII_API_KEY is configured or fallback)
  if (phone) {
    try {
      let cleanPhone = phone.trim().replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '234' + cleanPhone.slice(1);
      } else if (!cleanPhone.startsWith('234')) {
        cleanPhone = '234' + cleanPhone;
      }

      if (process.env.TERMII_API_KEY) {
        const termiiPayload = {
          to: cleanPhone,
          from: process.env.TERMII_SENDER_ID || 'Termii',
          sms: `Your ILERTI Health verification code is ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
          type: 'plain',
          channel: 'generic',
          api_key: process.env.TERMII_API_KEY,
        };

        const res = await fetch('https://api.ng.termii.com/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(termiiPayload),
        });
        const data = await res.json();
        console.log(`📱 Termii SMS Response for ${cleanPhone}:`, data);
        if (data.code === 'ok' || data.message === 'Successfully Sent' || res.ok) {
          result.smsSent = true;
        } else {
          result.smsError = data.message || 'Termii delivery issue';
        }
      } else {
        console.log(`📱 [DEV SMS DISPATCH] To: +${cleanPhone} | Message: Your ILERTI Health OTP is ${otp}`);
        result.smsSent = true; // Simulated success in development
      }
    } catch (smsErr: any) {
      console.warn('SMS dispatch warning:', smsErr);
      result.smsError = smsErr?.message;
    }
  }

  // 2. Send Email via Resend (if RESEND_API_KEY is configured or fallback)
  if (email && email.includes('@')) {
    try {
      if (process.env.RESEND_API_KEY) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'ILERTI Health <security@ilertihealth.site>',
            to: [email.trim().toLowerCase()],
            subject: `${otp} is your ILERTI Health verification code`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h1 style="color: #0D9488; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">ILERTI Health</h1>
                  <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Nigeria's Digital Health Ecosystem</p>
                </div>
                
                <p style="color: #334155; font-size: 15px; line-height: 1.5; margin-bottom: 16px;">
                  Hello, thank you for verifying your ILERTI Health account. Use the 6-digit one-time passcode below to proceed:
                </p>

                <div style="background: #f0fdfa; border: 1.5px solid #99f6e4; padding: 20px; text-align: center; border-radius: 16px; margin: 24px 0;">
                  <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #0f766e; font-family: monospace;">${otp}</span>
                </div>

                <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
                  ⏱️ This code is valid for <strong>10 minutes</strong>. If you did not request this verification, please disregard this email.
                </p>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
                  <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                    © 2026 ILERTI Health. All rights reserved. • Made with care for Nigeria 🇳🇬
                  </p>
                </div>
              </div>
            `,
          }),
        });
        const data = await res.json();
        console.log(`📧 Resend Email Response for ${email}:`, data);
        if (data.id || res.ok) {
          result.emailSent = true;
        } else {
          result.emailError = data.message || 'Resend delivery issue';
        }
      } else {
        console.log(`📧 [DEV EMAIL DISPATCH] To: ${email} | OTP: ${otp}`);
        result.emailSent = true; // Simulated success in development
      }
    } catch (emailErr: any) {
      console.warn('Email dispatch warning:', emailErr);
      result.emailError = emailErr?.message;
    }
  }

  return result;
}

