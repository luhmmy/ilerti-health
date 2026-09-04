// Paystack Integration Helper
// Requires PAYSTACK_SECRET_KEY in environment

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock';
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_mock';

export const paystackConfig = {
  publicKey: PAYSTACK_PUBLIC_KEY,
};

/**
 * Generates a unique transaction reference
 */
export function generateTransactionReference(): string {
  return `ILRTI_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Calculates a split payout between a Doctor and ILERTI Health
 * @param amountInNaira The total consultation fee in Naira
 * @returns Split details in Kobo
 */
export function calculateSplitPayload(amountInNaira: number) {
  const amountInKobo = amountInNaira * 100;
  
  // 85% to doctor, 15% to ILERTI
  const doctorShare = Math.floor(amountInKobo * 0.85);
  const platformShare = amountInKobo - doctorShare;

  return {
    totalAmountKobo: amountInKobo,
    doctorShareKobo: doctorShare,
    platformShareKobo: platformShare,
  };
}

/**
 * Verifies a transaction on Paystack (Server-side only)
 * @param reference The transaction reference
 */
export async function verifyTransaction(reference: string) {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('PAYSTACK_SECRET_KEY is not configured');
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw error;
  }
}
