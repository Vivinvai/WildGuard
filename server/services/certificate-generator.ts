import type { Certificate } from "@shared/schema";

interface CertificateData {
  sightingId: string;
  recipientName: string;
  recipientEmail: string;
  contribution: string;
  speciesHelped: string;
  location: string;
}

// Generate a unique certificate number
export function generateCertificateNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `WG-${year}${month}${day}-${random}`;
}

// Generate certificate HTML for download
export function generateCertificateHTML(certificate: Certificate & { issueDate: Date }): string {
  const issueDate = new Date(certificate.issueDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WildGuard Conservation Certificate</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .certificate-container {
      background: white;
      width: 100%;
      max-width: 900px;
      padding: 60px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      position: relative;
      overflow: hidden;
    }
    
    .certificate-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 10px;
      background: linear-gradient(90deg, #10b981, #059669, #047857);
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px double #10b981;
      padding-bottom: 30px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 15px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 36px;
      font-weight: bold;
    }
    
    .organization {
      font-size: 32px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    
    .tagline {
      font-size: 14px;
      color: #6b7280;
      font-style: italic;
      letter-spacing: 2px;
    }
    
    .certificate-title {
      font-size: 42px;
      font-weight: bold;
      text-align: center;
      color: #10b981;
      margin: 40px 0 30px;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    
    .certificate-body {
      text-align: center;
      font-size: 18px;
      line-height: 2;
      color: #374151;
      margin-bottom: 40px;
    }
    
    .recipient-name {
      font-size: 36px;
      font-weight: bold;
      color: #1f2937;
      margin: 20px 0;
      border-bottom: 2px solid #10b981;
      display: inline-block;
      padding: 5px 40px;
    }
    
    .contribution-box {
      background: linear-gradient(135deg, #ecfdf5, #d1fae5);
      padding: 30px;
      border-radius: 15px;
      margin: 30px 0;
      border-left: 5px solid #10b981;
    }
    
    .contribution-title {
      font-size: 16px;
      font-weight: bold;
      color: #059669;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .contribution-text {
      font-size: 18px;
      color: #1f2937;
      line-height: 1.6;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 40px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 10px;
    }
    
    .detail-item {
      text-align: left;
    }
    
    .detail-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    
    .detail-value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 600;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
    }
    
    .certificate-number {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 20px;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
    }
    
    .signature-line {
      width: 250px;
      margin: 0 auto;
      border-top: 2px solid #1f2937;
      padding-top: 10px;
    }
    
    .signature-title {
      font-size: 14px;
      color: #6b7280;
      font-style: italic;
    }
    
    .verification-note {
      margin-top: 30px;
      padding: 15px;
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      font-size: 12px;
      color: #92400e;
      text-align: left;
    }
    
    @media print {
      body {
        background: white;
      }
      
      .certificate-container {
        box-shadow: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="certificate-container">
    <div class="header">
      <div class="logo">🛡️</div>
      <div class="organization">WildGuard</div>
      <div class="tagline">AI-Powered Wildlife & Flora Conservation Platform</div>
    </div>
    
    <div class="certificate-title">Certificate of Conservation</div>
    
    <div class="certificate-body">
      <p>This certifies that</p>
      <div class="recipient-name">${certificate.recipientName}</div>
      <p>has made a valuable contribution to wildlife conservation</p>
    </div>
    
    <div class="contribution-box">
      <div class="contribution-title">Conservation Contribution</div>
      <div class="contribution-text">${certificate.contribution}</div>
    </div>
    
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">Species Helped</div>
        <div class="detail-value">${certificate.speciesHelped}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Location</div>
        <div class="detail-value">${certificate.location}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Issue Date</div>
        <div class="detail-value">${issueDate}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Certificate Number</div>
        <div class="detail-value">${certificate.certificateNumber}</div>
      </div>
    </div>
    
    <div class="footer">
      <div class="certificate-number">Certificate ID: ${certificate.certificateNumber}</div>
      <div class="signature-line">
        <div class="signature-title">WildGuard Conservation Platform</div>
      </div>
      
      <div class="verification-note">
        <strong>📋 Verification:</strong> This certificate can be verified at wildguard.replit.app using the certificate number above. 
        Your contribution helps protect endangered species and preserve natural habitats for future generations.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
