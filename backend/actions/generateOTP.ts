import nodemailer from 'nodemailer';

// Replace these with your own email settings
const EMAIL_USERNAME = process.env.OTP_SENDER_EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.OTP_SENDER_EMAIL_PASSWORD;

// Create a nodemailer transporter using SMTP
const transporter = nodemailer?.createTransport({
  service: 'smtp',
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

interface Params {
  otpLength: number;
  email: string;
}

// Function to generate a random OTP
export function generateOTP(params: Params) {
  const otp = Math.floor(Math.random() * 9000) + 1000;

  // Replace with your recipient's email
  const recipientEmail = params.email;

  // Generate and send OTP email

  const mailOptions = {
    from: EMAIL_USERNAME,
    to: recipientEmail,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  transporter?.sendMail(mailOptions, (error: any, info: { response: any }) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
  return otp;
}
