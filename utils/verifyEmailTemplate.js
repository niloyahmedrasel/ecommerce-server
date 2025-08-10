const verifyEmailTemplate = (username, otp) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }

            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .header {
                text-align: center;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }

           .header h1 {
                color: #3498db;
            }

           .content {
                text-align: center;
            }

          .content p {
                font-size: 16px;
                line-height: 1.5;
            }

            .otp {
                font-size: 20px;
                font-weight: bold;
                color: #e74c3c;
                margin: 20px 0;
            }

          .footer {
                text-align: center;
                font-size: 14px;
                color: #888;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
                <p>Hello ${username}, thank you for registering with us. To complete your registration, please verify your email address by entering the following OTP:</p>
                <div class="otp">
                    <p>${otp}</p>
                </div>
                <p>If you did not register with us, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 SHINE IIT. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

};

export default verifyEmailTemplate;