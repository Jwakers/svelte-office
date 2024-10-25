'use server';

import { isMailchimpError, isRecaptchaError } from '@/lib/type-guards';
import { verifyRecaptcha } from '@/lib/utils';
import mailchimp from '@mailchimp/mailchimp_marketing';
import capitalize from 'lodash.capitalize';
import { z } from 'zod';

type SubscribeEmailActionResult = {
  message: string;
  success: boolean;
  errors: string[] | string | null;
};

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_NEWSLETTER_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX
});

const formSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  token: z.string()
});

export async function subscribeEmail(
  _: FormData,
  formData: FormData
): Promise<SubscribeEmailActionResult> {
  // Convert formData to an object that zod can parse
  const formDataObject = Object.fromEntries(formData.entries());

  try {
    const validatedData = formSchema.strict().parse(formDataObject);
    await verifyRecaptcha(validatedData.token);

    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
      email_address: validatedData.email.toLowerCase(),
      merge_fields: {
        FNAME: capitalize(validatedData.firstName),
        LNAME: capitalize(validatedData.lastName)
      },
      status: 'subscribed'
    });

    return { success: true, message: 'Thank you for signing up!', errors: null };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error('Invalid email address:', error.errors);
      return {
        success: false,
        message: 'Invalid email address',
        errors: error.errors.map((e) => e.message).join(', ')
      };
    }

    // Check if this is a Mailchimp error
    if (isMailchimpError(error)) {
      const errorData = error.response.body;

      if (errorData.status === 400 && errorData.title === 'Member Exists') {
        return {
          success: false,
          message: 'This email is already subscribed to the newsletter.',
          errors: errorData.detail
        };
      }

      console.error('Mailchimp API Error:', errorData);
      return {
        success: false,
        message: errorData.title,
        errors: errorData.detail
      };
    }

    if (isRecaptchaError(error)) {
      return {
        message: error.error,
        success: false,
        errors: 'ReCAPTCHA failed. Please try again.'
      };
    }

    console.error('Unexpected error:');
    return {
      success: false,
      message: 'Server error, please try again later.',
      errors: 'Server error, please try again later.'
    };
  }
}
