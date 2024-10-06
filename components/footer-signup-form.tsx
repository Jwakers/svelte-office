'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function FooterSignupForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();

    if (!email) return;

    const urlParams = new URLSearchParams({ email });
    router.push(`?${urlParams.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-96 border p-2">
      <h4 className="mb-2">15% off your first order when you sign up to our newsletter. </h4>
      <form className="flex flex-wrap gap-2 sm:flex-nowrap" onSubmit={handleSubmit}>
        <Input type="email" placeholder="Email" name="email" required />
        <Button type="submit" className="w-full sm:w-auto">
          Subscribe
        </Button>
      </form>
    </div>
  );
}
