const nodemailer = require('nodemailer');

export default async function ({
  subject,
  html,
  fromLabel = 'Svelte office',
  to = process.env.HOSTINGER_CONTACT_EMAIL as string
}: {
  subject: string;
  html: string;
  fromLabel?: string;
  to?: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      port: 465,
      secure: true,
      host: 'smtp.hostinger.com',
      auth: {
        user: process.env.HOSTINGER_CONTACT_EMAIL,
        pass: process.env.HOSTINGER_CONTACT_PASSWORD
      }
    });

    const mailData = {
      from: `${fromLabel} <${process.env.HOSTINGER_CONTACT_EMAIL}>`,
      to,
      subject,
      html
    };

    return await transporter.sendMail(mailData);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
