// Unified SMS (Termii) and Email (Resend) OTP dispatcher

export async function dispatchOtp(email: string, phone: string | undefined, otp: string) {
  // 1. Send SMS via Termii (if TERMII_API_KEY is configured)
  if (phone && process.env.TERMII_API_KEY) {
    try {
      let cleanPhone = phone.trim().replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '234' + cleanPhone.slice(1);
      } else if (!cleanPhone.startsWith('234')) {
        cleanPhone = '234' + cleanPhone;
      }

      const termiiPayload = {
        to: cleanPhone,
        from: process.env.TERMII_SENDER_ID || 'Termii',
        sms: `Your ILERTI Health verification code is ${otp}. Valid for 10 minutes.`,
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
    } catch (smsErr) {
      console.warn('SMS dispatch warning:', smsErr);
    }
  }

  // 2. Send Email via Resend (if RESEND_API_KEY is configured)
  if (email && process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'ILERTI Health <onboarding@resend.dev>',
          to: [email],
          subject: `${otp} is your ILERTI Health verification code`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
              <h2 style="color: #0D9488; margin-bottom: 8px;">ILERTI Health</h2>
              <p style="color: #475569; font-size: 14px;">Welcome to your digital health ecosystem.</p>
              <div style="background: #f0fdfa; border: 1px solid #ccfbf1; padding: 18px; text-align: center; border-radius: 12px; margin: 24px 0;">
                <span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #0f766e;">${otp}</span>
              </div>
              <p style="color: #64748b; font-size: 12px;">This 6-digit verification code expires in 10 minutes. If you did not request this, please ignore.</p>
            </div>
          `,
        }),
      });
      const data = await res.json();
      console.log(`📧 Resend Email Response for ${email}:`, data);
    } catch (emailErr) {
      console.warn('Email dispatch warning:', emailErr);
    }
  }
}
