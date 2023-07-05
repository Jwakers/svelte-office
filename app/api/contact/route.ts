import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactFormSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(3, { message: 'Subject is too short' }),
  message: z.string().min(10, { message: 'Message is too short' })
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const data = await request.json();

  try {
    await sleep(1000);
    contactFormSchema.parse(data);

    // Submit data to DB here
    return NextResponse.json({ message: 'Message sent, thank you!' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({
        errors: err.issues.map((e) => ({
          message: e.message,
          path: e.path[0]
        }))
      });
    }
  }
}
