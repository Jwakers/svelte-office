'use client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const recaptchaKey: string | undefined = process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function ReCaptchaProvider({ children }: React.PropsWithChildren) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey ?? 'NOT_DEFINED'}
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
