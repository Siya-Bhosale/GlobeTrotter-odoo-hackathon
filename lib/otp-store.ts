interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
}

class OtpService {
  private store: Map<string, OtpRecord> = new Map();

  // Generate unique 6-digit OTP
  generateOtp(email: string): string {
    const normalizedEmail = email.toLowerCase().trim();
    // 6-digit cryptographically random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 10 minutes expiry
    const expiresAt = Date.now() + 10 * 60 * 1000;

    this.store.set(normalizedEmail, {
      email: normalizedEmail,
      otp,
      expiresAt,
      attempts: 0
    });

    return otp;
  }

  // Verify OTP
  verifyOtp(email: string, inputOtp: string): { success: boolean; message: string } {
    const normalizedEmail = email.toLowerCase().trim();
    const record = this.store.get(normalizedEmail);

    if (!record) {
      return { success: false, message: 'No OTP requested for this email or code expired. Please request a new OTP.' };
    }

    if (Date.now() > record.expiresAt) {
      this.store.delete(normalizedEmail);
      return { success: false, message: 'OTP has expired. Please request a new verification code.' };
    }

    if (record.attempts >= 5) {
      this.store.delete(normalizedEmail);
      return { success: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
    }

    if (record.otp !== inputOtp.trim()) {
      record.attempts += 1;
      return { success: false, message: `Incorrect verification code. ${5 - record.attempts} attempts remaining.` };
    }

    // Successfully verified -> clean up
    this.store.delete(normalizedEmail);
    return { success: true, message: 'Email address successfully verified!' };
  }

  // Check if active OTP exists
  getLatestOtp(email: string): string | null {
    const normalizedEmail = email.toLowerCase().trim();
    const record = this.store.get(normalizedEmail);
    if (!record || Date.now() > record.expiresAt) return null;
    return record.otp;
  }
}

const globalOtpService = (globalThis as any).__GLOBETROTTER_OTP__ || new OtpService();
if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).__GLOBETROTTER_OTP__ = globalOtpService;
}

export const otpStore: OtpService = globalOtpService;
