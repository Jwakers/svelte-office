'use server';

import { verifyRecaptcha } from '@/lib/utils';
import mailchimp, { ErrorResponse } from '@mailchimp/mailchimp_marketing';
import capitalize from 'lodash.capitalize';
import { z } from 'zod';

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

export async function subscribeEmail(previousState: FormData, formData: FormData) {
  // Convert formData to an object that zod can parse
  const formDataObject = Object.fromEntries(formData.entries());

  try {
    const validatedData = formSchema.parse(formDataObject);
    console.log(validatedData);
    verifyRecaptcha(validatedData.token);

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
        errors: error.errors.map((e) => e.message)
      };
    }

    // Check if this is a Mailchimp error
    if (isMailchimpError(error)) {
      const errorData = error?.response?.body as ErrorResponse;

      if (errorData.status === 400 && errorData.title === 'Member Exists') {
        return {
          success: false,
          message: 'This email is already subscribed to the newsletter.',
          errors: [errorData.detail]
        };
      }

      console.error('Mailchimp API Error:', errorData);
      return {
        success: false,
        message: errorData.title,
        errors: [errorData.detail]
      };
    }

    console.error('Unexpected error:');
    return {
      success: false,
      message: 'Server error, please try again later.',
      errors: ['Server error, please try again later.']
    };
  }
}

function isMailchimpError(error: any) {
  const errorData: ErrorResponse = error?.response?.body as ErrorResponse;

  return errorData && 'status' in errorData && 'title' in errorData && 'detail' in errorData;
}
