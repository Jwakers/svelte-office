'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getImageSizes } from '@/lib/utils';
import Image from 'next/image';
import modalImage from 'public/advance-lifestyle.jpg';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import LoadingDots from '@/components/loading-dots';
import { useRecaptcha } from '@/lib/hooks';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import ReCaptchaProvider from '../recaptcha-provider';
import { subscribeEmail } from './actions';

type ActionReturnType = Awaited<ReturnType<typeof subscribeEmail>>;

const STORAGE_KEY = 'hasInteractedWithModal';

const INITIAL_STATE: ActionReturnType = {
  success: false,
  message: '',
  errors: null
};

export default function EmailSignupModalComponent() {
  const [isOpen, setIsOpen] = useState(false);
  // @ts-ignore
  const [state, formAction] = useFormState(subscribeEmail, INITIAL_STATE);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const params = useSearchParams();

  const handleChange = (open: boolean) => {
    setIsOpen(open);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  useEffect(() => {
    const hasInteracted = localStorage.getItem(STORAGE_KEY);

    if (hasInteracted) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state.errors?.length) {
      toast.error(state.message);
    }

    if (state.success) {
      toast.success(state.message);
      setTimeout(() => handleChange(false), 1000);
    }
  }, [state]);

  useEffect(() => {
    const emailParam = params.get('email');
    if (!emailParam) return;

    setEmail(emailParam);
    setIsOpen(true);
  }, [params]);

  return (
    <ReCaptchaProvider>
      <Dialog open={isOpen} onOpenChange={handleChange}>
        <DialogContent className="sm:max-w-[425px]">
          <Image
            src={modalImage}
            alt="Advance desk image"
            sizes={getImageSizes({ sm: '425px' })}
            className="max-h-60 object-cover"
          />
          <div className="space-y-6 p-4">
            <DialogHeader>
              <DialogTitle>Get 15% Off Your First Order!</DialogTitle>
              <DialogDescription>
                Sign up for our newsletter and receive an exclusive discount.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <Form action={formAction} email={email} setEmail={setEmail} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ReCaptchaProvider>
  );
}

function Form({
  action,
  email,
  setEmail
}: {
  action: () => void;
  email?: string;
  setEmail?: Dispatch<SetStateAction<string | undefined>>;
}) {
  const token = useRecaptcha();

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="firstName" placeholder="First Name" required />
        <Input name="lastName" placeholder="Last Name" required />
      </div>
      <Input
        name="email"
        placeholder="Enter your email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail?.(e.target.value)}
      />
      <input hidden name="token" value={token} type="text" />
      <FormButton />
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <LoadingDots /> : 'Get My 15% Off'}
    </Button>
  );
}
