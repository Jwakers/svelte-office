'use client';

import { useRecaptcha } from '@/lib/hooks';
import LoadingDots from 'components/loading-dots';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import ReCaptchaProvider from '../recaptcha-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { contactAction } from './actions';

type ActionReturnType = Awaited<ReturnType<typeof contactAction>>;

const initialState: ActionReturnType = { message: '', success: false, errors: [] };

function Form() {
  // @ts-ignore
  const [state, formAction] = useFormState(contactAction, initialState);
  const router = useRouter();
  const token = useRecaptcha();

  useEffect(() => {
    if (!state.errors.length) return;
    toast.error(state.message);
  }, [state.errors]);

  useEffect(() => {
    if (!state.success) return;

    toast.success(state.message);
    setTimeout(() => {
      router.push('/');
    }, 1000);
  }, [state.success]);

  return (
    <>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm uppercase">
            Your name
          </label>
          <ErrorMessage field="name" errors={state.errors} />
          <Input
            type="text"
            id="name"
            name="name"
            className="block w-full border bg-white p-3 text-sm"
            placeholder="John Smith"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm uppercase">
            Your email
          </label>
          <ErrorMessage field="email" errors={state.errors} />
          <Input
            type="email"
            id="email"
            name="email"
            className="block w-full border bg-white p-3 text-sm"
            placeholder="name@gmail.com"
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="mb-2 block text-sm uppercase">
            Subject
          </label>
          <ErrorMessage field="subject" errors={state.errors} />
          <Input
            type="text"
            id="subject"
            name="subject"
            className="block w-full border bg-white p-3 text-sm"
            placeholder="Let us know how we can help you"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-2 block text-sm uppercase">
            Your message
          </label>
          <ErrorMessage field="message" errors={state.errors} />
          <Textarea
            id="message"
            name="message"
            rows={6}
            className="block w-full border bg-white p-3 text-sm"
            placeholder="Leave a comment..."
            required
          />
        </div>
        <input type="hidden" name="token" value={token} />
        <FormButton />
      </form>
    </>
  );
}

function FormButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <LoadingDots /> : <span>Send message</span>}
    </Button>
  );
}

const ErrorMessage = ({ field, errors }: { field: string; errors: ActionReturnType['errors'] }) => {
  const error = errors?.find((err) => err.path === field)?.message;
  return error ? <span className="text-sm text-error">{error}</span> : null;
};

export default function ContactForm() {
  return (
    <ReCaptchaProvider>
      <Form />
    </ReCaptchaProvider>
  );
}
