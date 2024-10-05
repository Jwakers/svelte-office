import sendEmail from 'lib/send-email';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string().min(3, { message: 'Subject is too short' }),
  message: z.string().min(10, { message: 'Message is too short' }),
  token: z.string()
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

export async function POST(request: Request) {
  const data: ContactFormSchema = await request.json();
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;
  const verifyParams = `secret=${secretKey}&response=${data.token}`;
  let score;

  try {
    const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?${verifyParams}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    score = await res.json();
  } catch (err) {
    console.log('recaptcha error:', err);
    return NextResponse.json({ message: 'ReCAPTCHA Error', error: err }, { status: 500 });
  }

  try {
    contactFormSchema.parse(data);
    const res = await sendEmail({
      subject: `${data.subject}`,
      fromLabel: 'Svelte Office contact form',
      html: `
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong> ${data.message}</p>
  `
    });

    if (!score?.success) return NextResponse.json({ message: 'ReCAPTCHA Failed' }, { status: 500 });

    return NextResponse.json({ message: 'Message sent, thank you!' }, { status: 200 });
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          errors: err.issues.map((e) => ({
            message: e.message,
            path: e.path[0]
          }))
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'There was an error', error: err }, { status: 500 });
  }
}
