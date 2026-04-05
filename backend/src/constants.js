// EmailTemplate.js

export const activationTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Activate Your Account</title>
<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f4f7;
    margin: 0;
    padding: 0;
    color: #333;
  }

  .container {
    max-width: 600px;
    margin: 40px auto;
    background-color: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
  .content {
    padding: 30px 25px;
    line-height: 1.6;
    font-size: 16px;
    color: #333333;
  }
    
  .button {
    display: inline-block;
    margin: 20px 0;
    padding: 15px 35px;
    font-size: 16px;
    font-weight: bold;
    text-decoration: none;
    color: white !important;
    background-color: #1a73e8;
    border-radius: 6px;
  }
  .footer {
    background-color: #f0f0f0;
    color: #777;
    text-align: center;
    font-size: 12px;
    padding: 20px;
  }
  @media screen and (max-width: 480px) {
    .content { padding: 20px; font-size: 14px; }
    .button { padding: 12px 20px; font-size: 14px; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="content">
      <p>Hi Respected User,</p>
      <p>Welcome to <strong>VIRQA</strong>! Please click the button below to activate your account and get started:</p>
      <p style="text-align:center;">
        <a href="{{activationLink}}" class="button">Activate Account</a>
      </p>
      <p>If you did not create an account, you can safely ignore this email.</p>
      <p>Thank you,<br>VIRQA Team</p>
    </div>
    </div>
    <div class="footer">
      &copy; {{year}} VIRQA. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

export const employeeInviteTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VIRQA Invitation</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9; padding: 30px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#1a73e8,#4f8df5); padding:25px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:24px;">Welcome to VIRQA</h1>
              <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">Your professional workspace is ready</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
              
              <p style="margin-top:0;">Hello,</p>

              <p>
                You have been invited to join <strong>VIRQA</strong>. An administrator has created your account successfully.
              </p>

              <p><strong>Your login credentials:</strong></p>

              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:8px; padding:15px; margin:15px 0;">
                <tr>
                  <td style="padding:10px 0;">
                    <strong>Email:</strong><br>
                    <span style="color:#1a73e8;">{{email}}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <strong>Temporary Password:</strong><br>
                    <span style="font-family:monospace; font-size:18px; font-weight:bold; color:#111;">{{password}}</span>
                  </td>
                </tr>
              </table>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:25px 0;">
                <tr>
                  <td align="center">
                    <a href="{{loginLink}}" 
                       style="background:#1a73e8; color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:6px; display:inline-block; font-weight:bold; font-size:15px;">
                       Login to Your Account
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Note -->
              <p style="font-size:13px; color:#d93025;">
                <strong>Important:</strong> For security reasons, you must change your password after your first login.
              </p>

              <p>
                If you did not expect this invitation, please ignore this email or contact support.
              </p>

              <p style="margin-bottom:0;">
                Best regards,<br>
                <strong>VIRQA HR Division</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; text-align:center; padding:20px; font-size:12px; color:#888;">
              &copy; {{year}} VIRQA. All rights reserved.<br>
              <span style="font-size:11px;">This is an automated message, please do not reply.</span>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

export const forgotPasswordTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset Request</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f9; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f9; padding: 30px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#e84118,#c23616); padding:25px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:24px;">Password Reset</h1>
              <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">Secure your VIRQA account</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; font-size:15px; line-height:1.6;">
              <p style="margin-top:0;">Hello,</p>
              <p>We received a request to reset your password. Here is your highly secure 6-digit verification code:</p>
              
              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc; border:1px solid #e5e7eb; border-radius:8px; padding:20px; margin:20px 0; text-align:center;">
                <tr>
                  <td>
                    <span style="font-family:monospace; font-size:32px; font-weight:bold; letter-spacing:8px; color:#c23616;">{{otpCode}}</span>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px; color:#d93025;">
                <strong>Important:</strong> This code will strictly expire in 10 minutes.
              </p>
              <p>If you did not request a password reset, please ignore this email or contact security immediately.</p>
              <p style="margin-bottom:0;">
                Best regards,<br>
                <strong>VIRQA Security Division</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; text-align:center; padding:20px; font-size:12px; color:#888;">
              &copy; {{year}} VIRQA. All rights reserved.<br>
              <span style="font-size:11px;">This is an automated security mechanism, please do not reply.</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
