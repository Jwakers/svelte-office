const nodemailer = require('nodemailer');

export default async function ({
  subject,
  html,
  to = process.env.HOSTINGER_CONTACT_EMAIL as string
}: {
  subject: string;
  html: string;
  to?: string;
}) {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.hostinger.com',
    auth: {
      user: process.env.HOSTINGER_CONTACT_EMAIL,
      pass: process.env.HOSTINGER_CONTACT_PASSWORD
    }
  });

  const mailData = {
    from: `Svelte office order <${process.env.HOSTINGER_CONTACT_EMAIL}>`,
    to,
    subject,
    html
  };

  return await transporter.sendMail(mailData);
}
