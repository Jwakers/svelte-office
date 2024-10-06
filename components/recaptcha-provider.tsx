'use client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function ReCaptchaProvider({ children }: React.PropsWithChildren) {
  if (!RECAPTCHA_SITE_KEY) {
    throw new Error('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined in the environment variables.');
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'head',
        nonce: undefined
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
