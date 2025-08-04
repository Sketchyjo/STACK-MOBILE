import { prisma } from '@stack/shared-types';
import crypto from 'crypto';

export interface OTPData {
  email: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
}

/**
 * Generate a 6-digit OTP code
 */
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create or update OTP for email
 */
export async function createOTP(email: string): Promise<{ code: string; expiresAt: Date }> {
  const code = generateOTPCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    // First, delete any existing OTP for this email
    await prisma.oTP.deleteMany({
      where: { email: email.toLowerCase() }
    });

    // Create new OTP
    await prisma.oTP.create({
      data: {
        email: email.toLowerCase(),
        code,
        expiresAt,
        verified: false,
        attempts: 0,
      }
    });

    return { code, expiresAt };
  } catch (error) {
    console.error('Error creating OTP:', error);
    throw new Error('Failed to create OTP');
  }
}

/**
 * Verify OTP code
 */
export async function verifyOTP(email: string, code: string): Promise<boolean> {
  try {
    const otp = await prisma.oTP.findFirst({
      where: {
        email: email.toLowerCase(),
        code,
        expiresAt: { gt: new Date() },
        verified: false,
        attempts: { lt: 5 } // Max 5 attempts
      }
    });

    if (!otp) {
      // Increment attempts if OTP exists but is invalid
      await prisma.oTP.updateMany({
        where: {
          email: email.toLowerCase(),
          verified: false
        },
        data: {
          attempts: { increment: 1 }
        }
      });
      return false;
    }

    // Mark OTP as verified
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { verified: true }
    });

    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}

/**
 * Check if email has a valid verified OTP
 */
export async function hasValidOTP(email: string): Promise<boolean> {
  try {
    const otp = await prisma.oTP.findFirst({
      where: {
        email: email.toLowerCase(),
        verified: true,
        expiresAt: { gt: new Date() }
      }
    });

    return !!otp;
  } catch (error) {
    console.error('Error checking OTP validity:', error);
    return false;
  }
}

/**
 * Clean up expired OTPs
 */
export async function cleanupExpiredOTPs(): Promise<number> {
  try {
    const result = await prisma.oTP.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    });

    return result.count;
  } catch (error) {
    console.error('Error cleaning up OTPs:', error);
    return 0;
  }
}
