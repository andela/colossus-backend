import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD
  }
});


const sendVerificationMail = async (clientMail, subject, html) => {
  await transport.sendMail({
    to: clientMail,
    from: 'no-reply@barefoot.com',
    subject,
    html
  });
};

export default sendVerificationMail;
