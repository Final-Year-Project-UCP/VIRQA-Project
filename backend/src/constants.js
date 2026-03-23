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
    <div class="footer">
      &copy; {{year}} VIRQA. All rights reserved.
    </div>
  </div>
</body>
</html>
`;