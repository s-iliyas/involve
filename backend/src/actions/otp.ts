import * as cryptojs from 'crypto-js';
import * as sg from '@sendgrid/mail';

export const generateOTP = (
  email: string,
): { otp: number; hashTimestamp: string } => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expires = Date.now() + 300000;
  const data = `${email}.${otp}.${expires}`;
  const hash = cryptojs.HmacSHA256(data, process.env.SECRET_KEY);
  const hashTimestamp = `${hash}.${expires}`;
  return { otp, hashTimestamp };
};

interface Params {
  email: string;
  otp: number;
  hashTimestamp: string;
}

export const verify = (params: Params): boolean => {
  const [hash, expires] = params.hashTimestamp.split('.');
  const now = Date.now();
  if (now > parseInt(expires)) return false;
  const data = `${params.email}.${params.otp}.${expires}`;
  const newHash = cryptojs.HmacSHA256(data, process.env.SECRET_KEY).toString();
  return newHash === hash ? true : false;
};

export const sendOTP = (email: string, otp: number) => {
  sg.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    from: 'shaik.m.iliyas@gmail.com',
    to: email,
    subject: 'OTP Verification',
    html: `
          <div>
            <p>Welcome aboard!!</p>
            <br />
            <p>Your OTP is <strong>${otp}</strong></p>
            <br />
            <small>OTP is valid for 5 minutes.</small>
          </div>
    `,
  };
  return new Promise((resolve, reject) => {
    sg.send(msg)
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        console.log('[SEND_OTP] - ', err?.response?.body?.errors[0].message);
        reject(err?.response?.body?.errors[0].message);
      });
  });
};
