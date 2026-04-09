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
</style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h2>Welcome to VIRQA!</h2>
      <p>Click the button below to activate your account and set your password:</p>
      <a href="{{activationLink}}" class="button">Activate Account</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
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
  <title>Welcome to VIRQA</title>
</head>
<body style="margin:0; padding:0; background-color:#0f172a; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f172a; padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#1e293b; border-radius:16px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.5);">

          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding:40px 30px; text-align:center;">
              <!-- Logo Area -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <div style="display:inline-block; background:rgba(255,255,255,0.15); border-radius:14px; padding:12px 28px;">
                      <span style="font-size:26px; font-weight:900; color:#ffffff; letter-spacing:3px;">VIRQA</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin:0; font-size:28px; font-weight:700; color:#ffffff;">You're Invited!</h1>
                    <p style="margin:10px 0 0; font-size:15px; color:rgba(255,255,255,0.8);">Your AI Interview Platform account is ready</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Wave Divider -->
          <tr>
            <td style="background:linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); height:2px;"></td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:40px 35px; color:#cbd5e1;">

              <!-- Greeting -->
              <p style="font-size:16px; line-height:1.7; margin:0 0 12px; color:#e2e8f0;">Hello,</p>
              <p style="font-size:16px; line-height:1.7; margin:0 0 30px; color:#94a3b8;">
                You have been officially added to the <strong style="color:#ffffff;">VIRQA AI Interview Platform</strong> as an <strong style="color:#7c3aed;">Employee</strong>. Your account has been created and is ready to use. Please find your login credentials below.
              </p>

              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a; border:1px solid #334155; border-radius:12px; overflow:hidden; margin:0 0 30px;">
                <!-- Box Header -->
                <tr>
                  <td style="background:#1e3a5f; padding:14px 20px; border-bottom:1px solid #334155;">
                    <span style="font-size:13px; font-weight:700; color:#60a5fa; text-transform:uppercase; letter-spacing:1.5px;">🔐 Your Login Credentials</span>
                  </td>
                </tr>
                <!-- Email Row -->
                <tr>
                  <td style="padding:18px 20px; border-bottom:1px solid #1e293b;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:12px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:1px; width:140px;">Email Address</td>
                        <td style="font-size:15px; font-weight:600; color:#e2e8f0; font-family:monospace;">{{email}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Password Row -->
                <tr>
                  <td style="padding:18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size:12px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:1px; width:140px;">Temp. Password</td>
                        <td>
                          <span style="font-family:monospace; font-size:16px; font-weight:700; color:#f8fafc; background:linear-gradient(135deg,#2563eb22,#7c3aed22); border:1px solid #7c3aed55; padding:5px 14px; border-radius:8px; letter-spacing:2px;">{{password}}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#422006; border:1px solid #9a3412; border-radius:10px; margin:0 0 35px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; font-size:13px; color:#fdba74; line-height:1.5;">
                      ⚠️ <strong>Important:</strong> You will be required to change this temporary password immediately after your first login. Please do not share these credentials with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:5px 0 35px;">
                    <a href="{{loginLink}}" style="display:inline-block; background:linear-gradient(135deg,#2563eb,#7c3aed); color:#ffffff !important; font-size:16px; font-weight:700; text-decoration:none; padding:16px 50px; border-radius:10px; letter-spacing:0.5px; box-shadow:0 8px 25px rgba(124,58,237,0.4);">
                      🚀 &nbsp; Login to Your Account
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Website Link -->
              <p style="text-align:center; font-size:13px; color:#475569; margin:0 0 5px;">
                Or visit us directly at:
              </p>
              <p style="text-align:center; margin:0;">
                <a href="{{loginLink}}" style="color:#60a5fa; font-size:13px; text-decoration:none;">{{loginLink}}</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 35px;"><div style="border-top:1px solid #334155;"></div></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:25px 35px; text-align:center;">
              <p style="margin:0 0 8px; font-size:13px; color:#475569;">Warm Regards,</p>
              <p style="margin:0 0 16px; font-size:14px; font-weight:700; color:#7c3aed;">The VIRQA Team</p>
              <p style="margin:0; font-size:11px; color:#334155;">&copy; {{year}} VIRQA &mdash; AI-Powered Interview Platform. All rights reserved.</p>
              <p style="margin:6px 0 0; font-size:11px; color:#334155;">This is an automated message. Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
        <!-- End Card -->

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

export const interviewInviteTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Interview Invitation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 35px 25px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Interview Invitation</h1>
              <p style="margin: 8px 0 0; font-size: 15px; opacity: 0.9;">VIRQA AI Interview Platform</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; color: #334155; font-size: 16px; line-height: 1.6;">
              <p style="margin-top: 0;">Dear Candidate,</p>
              <p>Congratulations! You have been invited for an AI-powered interview for the position of <strong>{{jobTitle}}</strong>.</p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 25px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; font-size: 17px; color: #1e293b;">Schedule Details:</h3>
                <p style="margin: 5px 0;"><strong>📅 Date:</strong> {{date}}</p>
                <p style="margin: 5px 0;"><strong>⏰ Time:</strong> {{time}}</p>
                <p style="margin: 5px 0;"><strong>⏳ Duration:</strong> {{duration}} minutes</p>
              </div>

              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 25px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; font-size: 17px; color: #1e40af;">Access Credentials:</h3>
                <p style="margin: 5px 0;"><strong>Email:</strong> {{email}}</p>
                <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <span style="font-family: monospace; font-weight: bold; background: #dbeafe; padding: 2px 6px; border-radius: 4px;">{{password}}</span></p>
                <p style="font-size: 13px; color: #64748b; margin-top: 10px;">Please use these credentials to log in to our platform and participate in the interview at the scheduled time.</p>
              </div>

              <div style="text-align: center; margin-top: 40px;">
                <a href="{{loginLink}}" style="display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 8px; transition: background 0.2s;">
                  Login to Portal
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; text-align: center; padding: 25px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
              &copy; {{year}} VIRQA - Excellence in AI Recruitment.<br>
              This is an automated notification. Please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const interviewRescheduleTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Interview Rescheduled</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdf2f2; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fdf2f2; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 35px 25px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 700;">Interview Rescheduled</h1>
              <p style="margin: 8px 0 0; font-size: 15px; opacity: 0.9;">Update for your scheduled session</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; color: #334155; font-size: 16px; line-height: 1.6;">
              <p style="margin-top: 0;">Dear Candidate,</p>
              <p>Please note that the interview session for <strong>{{jobTitle}}</strong> has been rescheduled. Below are the updated details:</p>
              
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 25px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; font-size: 17px; color: #92400e;">New Schedule Details:</h3>
                <p style="margin: 5px 0;"><strong>📅 New Date:</strong> {{date}}</p>
                <p style="margin: 5px 0;"><strong>⏰ New Time:</strong> {{time}}</p>
                <p style="margin: 5px 0;"><strong>⏳ Duration:</strong> {{duration}} minutes</p>
              </div>

              <p style="font-size: 14px; color: #64748b; margin-top: 10px;">Your login credentials remain the same. Please reach out if you have any scheduling conflicts.</p>

              <div style="text-align: center; margin-top: 40px;">
                <a href="{{loginLink}}" style="display: inline-block; background-color: #f59e0b; color: #ffffff !important; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 8px; transition: background 0.2s;">
                  View Updated Schedule
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; text-align: center; padding: 25px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
              &copy; {{year}} VIRQA - Excellence in AI Recruitment.<br>
              This is an automated notification. Please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

