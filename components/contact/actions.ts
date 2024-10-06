'use server';

import { isRecaptchaError } from '@/lib/type-guards';
import { verifyRecaptcha } from '@/lib/utils';
import sendEmail from 'lib/send-email';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email(),
  subject: z.string().min(3, { message: 'Subject is too short' }),
  message: z.string().min(10, { message: 'Message is too short' }),
  token: z.string()
});

type ContactFormSchema = z.infer<typeof contactFormSchema>;

type ContactActionResult = {
  message: string;
  success: boolean;
  errors: { message: string; path: string | null }[];
};

const sendContactEmail = async (data: ContactFormSchema) => {
  await sendEmail({
    subject: data.subject,
    fromLabel: 'Svelte Office contact form',
    html: `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong> ${data.message}</p>
    `
  });
};

export async function contactAction(
  previousState: FormData,
  formData: FormData
): Promise<ContactActionResult> {
  try {
    const data = Object.fromEntries(formData.entries());
    const validatedData = contactFormSchema.parse(data);

    await verifyRecaptcha(validatedData.token);
    await sendContactEmail(validatedData);

    return { message: 'Message sent, thank you!', success: true, errors: [] };
  } catch (err) {
    console.error('Contact form error:', err);
    if (err instanceof z.ZodError) {
      return {
        message: 'Form error',
        success: false,
        errors: err.issues.map((e) => ({
          message: e.message,
          path: e.path[0]?.toString() ?? null
        }))
      };
    }

    if (isRecaptchaError(err)) {
      return {
        message: err.error,
        success: false,
        errors: [{ message: 'ReCAPTCHA failed. Please try again.', path: null }]
      };
    }

    return {
      message: 'Server error. Please try again later.',
      success: false,
      errors: [{ message: 'Server error. Please try again later.', path: null }]
    };
  }
}
