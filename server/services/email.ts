import nodemailer from 'nodemailer';
import type { Donation } from '@shared/schema';

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Generate donation receipt HTML
 */
function generateReceiptHTML(donation: Donation): string {
  const date = new Date(donation.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Receipt</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #10b981;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #10b981;
      margin-bottom: 10px;
    }
    .title {
      font-size: 24px;
      color: #374151;
      margin: 0;
    }
    .receipt-number {
      background: #f0fdf4;
      padding: 15px;
      border-left: 4px solid #10b981;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-label {
      font-weight: 600;
      color: #6b7280;
    }
    .detail-value {
      color: #111827;
    }
    .amount {
      font-size: 32px;
      font-weight: bold;
      color: #10b981;
      text-align: center;
      margin: 30px 0;
    }
    .thank-you {
      background: #f0fdf4;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
      text-align: center;
    }
    .impact {
      background: #eff6ff;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .impact-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 10px;
    }
    .tax-info {
      background: #fef3c7;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🐾 WildGuard</div>
      <h1 class="title">Donation Receipt</h1>
    </div>

    <div class="receipt-number">
      <strong>Receipt Number:</strong> ${donation.receiptNumber}
    </div>

    <div class="amount">
      ₹${donation.amount.toLocaleString('en-IN')}
    </div>

    <div class="detail-row">
      <span class="detail-label">Donor Name:</span>
      <span class="detail-value">${donation.name}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">Email:</span>
      <span class="detail-value">${donation.email}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">Date:</span>
      <span class="detail-value">${date}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">Payment Method:</span>
      <span class="detail-value">${donation.paymentMethod.toUpperCase()}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">Transaction ID:</span>
      <span class="detail-value">${donation.transactionId}</span>
    </div>

    ${donation.message ? `
    <div class="detail-row">
      <span class="detail-label">Message:</span>
      <span class="detail-value">${donation.message}</span>
    </div>
    ` : ''}

    <div class="thank-you">
      <h2 style="margin: 0 0 10px 0; color: #10b981;">Thank You! 🙏</h2>
      <p style="margin: 0;">Your generous contribution helps us protect and conserve wildlife for future generations.</p>
    </div>

    <div class="impact">
      <div class="impact-title">Your Impact:</div>
      <ul style="margin: 10px 0; padding-left: 20px;">
        ${donation.amount >= 5000 ? '<li>Support wildlife rescue operations for 2 months</li>' : ''}
        ${donation.amount >= 2000 ? '<li>Fund veterinary care for injured animals</li>' : ''}
        ${donation.amount >= 1000 ? '<li>Contribute to habitat restoration projects</li>' : ''}
        <li>Help raise awareness about endangered species</li>
        <li>Support conservation education programs</li>
      </ul>
    </div>

    <div class="tax-info">
      <strong>💼 Tax Benefits:</strong> This donation may be eligible for tax deduction under Section 80G of the Income Tax Act. 
      ${donation.taxCertificateIssued ? 'Your tax exemption certificate has been attached.' : 'Tax certificate will be issued shortly.'}
    </div>

    <div class="footer">
      <p><strong>WildGuard - Wildlife Conservation Initiative</strong></p>
      <p>Email: contact@wildguard.org | Website: www.wildguard.org</p>
      <p style="font-size: 12px; color: #9ca3af;">This is an automated receipt. Please save this for your records.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send donation receipt email
 */
export async function sendDonationReceipt(donation: Donation): Promise<void> {
  try {
    // Check if email service is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('⚠️  Email service not configured. Skipping receipt email.');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'WildGuard <noreply@wildguard.org>',
      to: donation.email,
      subject: `Thank You for Your Donation - Receipt ${donation.receiptNumber}`,
      html: generateReceiptHTML(donation),
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Receipt email sent to ${donation.email}: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Error sending donation receipt:', error);
    throw new Error('Failed to send donation receipt');
  }
}

/**
 * Send donation confirmation email (before payment)
 */
export async function sendDonationConfirmation(
  email: string,
  name: string,
  amount: number,
  orderId: string
): Promise<void> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('⚠️  Email service not configured. Skipping confirmation email.');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'WildGuard <noreply@wildguard.org>',
      to: email,
      subject: 'Complete Your Donation - WildGuard',
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px; }
    .amount { font-size: 28px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 WildGuard</h1>
      <p>Wildlife Conservation Initiative</p>
    </div>
    <div class="content">
      <h2>Dear ${name},</h2>
      <p>Thank you for choosing to support wildlife conservation!</p>
      <div class="amount">₹${amount.toLocaleString('en-IN')}</div>
      <p>Your payment is being processed. You will receive a receipt once the transaction is completed.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p>If you have any questions, please contact us at contact@wildguard.org</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
  }
}

/**
 * Check if email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}
