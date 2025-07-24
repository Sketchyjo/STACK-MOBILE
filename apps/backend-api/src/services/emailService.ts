import nodemailer from 'nodemailer';
import { z } from 'zod';

// Validation schemas
const SendEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().min(1, 'HTML content is required'),
  text: z.string().optional(),
});

export interface SendEmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create transporter based on environment
const createTransporter = () => {
  const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
  
  if (emailProvider === 'sendgrid') {
    // SendGrid configuration
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    // SMTP configuration (default)
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Additional options for better compatibility
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
      },
    };

    // Validate required SMTP configuration
    if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
      console.warn('SMTP configuration incomplete. Email functionality will be disabled.');
      console.warn('Required: SMTP_HOST, SMTP_USER, SMTP_PASS');
      console.warn('Current values:', {
        SMTP_HOST: process.env.SMTP_HOST || 'undefined',
        SMTP_USER: process.env.SMTP_USER || 'undefined',
        SMTP_PASS: process.env.SMTP_PASS ? '[REDACTED]' : 'undefined',
      });
      return null;
    }

    return nodemailer.createTransport(smtpConfig);
  }
};

// Lazy-load transporter
let transporter: any = null;
const getTransporter = () => {
  if (transporter === null) {
    transporter = createTransporter();
  }
  return transporter;
};

/**
 * Send email using configured provider
 */
export async function sendEmail(data: SendEmailData): Promise<void> {
  try {
    console.log('📧 Attempting to send email to:', data.to);
    console.log('📧 Email subject:', data.subject);
    
    const emailTransporter = getTransporter();
    
    // Check if transporter is available
    if (!emailTransporter) {
      console.error('❌ Email transporter not configured');
      console.warn('Email transporter not configured. Skipping email send.');
      return;
    }

    const validatedData = SendEmailSchema.parse(data);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@stack.app',
      to: validatedData.to,
      subject: validatedData.subject,
      html: validatedData.html,
      text: validatedData.text,
    };

    console.log('📧 Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    console.log('📧 Sending email...');
    const result = await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${validatedData.to}`);
    console.log('✅ Message ID:', result.messageId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    
    console.error('❌ Email sending failed:', error);
    
    // In development, don't throw errors for email failures
    if (process.env.NODE_ENV === 'development') {
      console.warn('Email sending failed in development mode. Continuing...');
      return;
    }
    
    throw new Error('Failed to send email');
  }
}

/**
 * Send email verification email with 6-digit code
 */
export async function sendEmailVerification(
  email: string,
  verificationCode: string,
  displayName: string
): Promise<void> {
  console.log('📧 Sending email verification to:', email);
  console.log('📧 Verification code:', verificationCode);
  console.log('📧 Display name:', displayName);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - STACK</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 20px; }
        .content h2 { color: #333; margin-bottom: 20px; font-size: 24px; }
        .content p { color: #666; line-height: 1.6; margin-bottom: 20px; }
        .verification-code { 
          background: #f8f9fa; 
          border: 2px solid #667eea; 
          border-radius: 12px; 
          padding: 20px; 
          text-align: center; 
          margin: 30px 0; 
        }
        .verification-code h3 { 
          color: #333; 
          margin: 0 0 10px 0; 
          font-size: 18px; 
        }
        .code { 
          font-size: 32px; 
          font-weight: bold; 
          color: #667eea; 
          letter-spacing: 8px; 
          font-family: 'Courier New', monospace; 
        }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .security-note { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to STACK</h1>
        </div>
        <div class="content">
          <h2>Hi ${displayName}!</h2>
          <p>Thank you for signing up for STACK. To complete your registration and start your investment journey, please verify your email address using the code below.</p>
          
          <div class="verification-code">
            <h3>Your Verification Code</h3>
            <div class="code">${verificationCode}</div>
          </div>
          
          <p>Enter this 6-digit code in the STACK app to verify your email address.</p>
          
          <div class="security-note">
            <p><strong>Security Note:</strong> This verification code will expire in 24 hours. If you didn't create an account with STACK, please ignore this email.</p>
          </div>
          
          <p>Once verified, you'll be able to:</p>
          <ul>
            <li>Access your personalized investment dashboard</li>
            <li>Create and manage your investment portfolio</li>
            <li>Explore curated investment baskets</li>
            <li>Start your journey towards financial growth</li>
          </ul>
        </div>
        <div class="footer">
          <p>© 2024 STACK. All rights reserved.</p>
          <p>If you have any questions, contact us at support@stack.app</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Welcome to STACK!
    
    Hi ${displayName},
    
    Thank you for signing up for STACK. To complete your registration, please verify your email address using the following 6-digit code:
    
    ${verificationCode}
    
    Enter this code in the STACK app to verify your email address.
    
    This verification code will expire in 24 hours.
    
    If you didn't create an account with STACK, please ignore this email.
    
    Best regards,
    The STACK Team
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email - Welcome to STACK',
    html,
    text,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  displayName: string
): Promise<void> {
  const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:8081';
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - STACK</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 20px; }
        .content h2 { color: #333; margin-bottom: 20px; font-size: 24px; }
        .content p { color: #666; line-height: 1.6; margin-bottom: 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .security-note { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <h2>Hi ${displayName}!</h2>
          <p>We received a request to reset your password for your STACK account. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <div class="security-note">
            <p><strong>Security Note:</strong> This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
        </div>
        <div class="footer">
          <p>© 2024 STACK. All rights reserved.</p>
          <p>If you have any questions, contact us at support@stack.app</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Password Reset - STACK
    
    Hi ${displayName},
    
    We received a request to reset your password for your STACK account. Click the link below to create a new password:
    
    ${resetUrl}
    
    This password reset link will expire in 1 hour.
    
    If you didn't request a password reset, please ignore this email and your password will remain unchanged.
    
    Best regards,
    The STACK Team
  `;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password - STACK',
    html,
    text,
  });
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    const emailTransporter = getTransporter();
    
    if (!emailTransporter) {
      console.log('❌ Email transporter not configured');
      return false;
    }

    // Verify the connection configuration
    await emailTransporter.verify();
    console.log('✅ Email configuration is valid and ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return false;
  }
}