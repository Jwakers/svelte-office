import sendEmail from 'lib/send-email';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string().min(3, { message: 'Subject is too short' }),
  message: z.string().min(10, { message: 'Message is too short' })
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

export async function POST(request: Request) {
  const data = await request.json();

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

    console.log(res);

    if (res?.responseCode && res?.responseCode !== 200) throw Error(res.response);

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
