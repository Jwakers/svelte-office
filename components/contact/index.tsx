'use client';

import { useMutation } from '@tanstack/react-query';
import { ContactFormSchema } from 'app/api/contact/route';
import clsx from 'clsx';
import LoadingDots from 'components/loading-dots';
import { FormEvent, useState } from 'react';

type MutationResponse = {
  message?: string;
  errors?: { message: string; path: string }[];
};

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const postContactData = async () => {
    const res = await fetch('api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, subject, message })
    });

    const data: MutationResponse = await res.json();

    if (!data?.errors && res.ok) {
      setEmail('');
      setSubject('');
      setMessage('');
      alert(data?.message || 'Message sent');
    }

    return data;
  };

  const mutation = useMutation(postContactData);

  const { isLoading, data, isError } = mutation;

  console.log(data);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  const renderError = (key: keyof ContactFormSchema) => {
    if (!data?.errors) return null;
    const message = data.errors.find((err) => err.path === key);

    return message ? <span className="text-sm text-red-500">{message.message}</span> : null;
  };

  return !isError ? (
    <form action="#" className="space-y-4 text-black" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm uppercase">
          Your email
        </label>
        {renderError('email')}
        <input
          type="email"
          id="email"
          className="block w-full border border-black bg-white p-3 text-sm"
          placeholder="name@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="subject" className="mb-2 block text-sm uppercase">
          Subject
        </label>
        {renderError('subject')}
        <input
          type="text"
          id="subject"
          className="block w-full border border-black bg-white p-3 text-sm"
          placeholder="Let us know how we can help you"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="mb-2 block text-sm uppercase">
          Your message
        </label>
        {renderError('message')}
        <textarea
          id="message"
          rows={6}
          className="block w-full border border-black bg-white p-3 text-sm"
          placeholder="Leave a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className={clsx('button inline-flex items-center', {
          'pointer-events-none cursor-not-allowed': isLoading
        })}
      >
        <span>Send message</span>
        {isLoading ? <LoadingDots /> : null}
      </button>
    </form>
  ) : (
    <p>There was an error, please try again later.</p>
  );
}
