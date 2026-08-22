import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otp-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and 6-digit OTP code are required' }, { status: 400 });
    }

    const verificationResult = otpStore.verifyOtp(email, otp);

    if (!verificationResult.success) {
      return NextResponse.json({ error: verificationResult.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      email: email,
      message: 'OTP verified successfully. You may now complete account registration.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'OTP verification failed' }, { status: 500 });
  }
}
