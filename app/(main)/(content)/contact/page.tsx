import Breadcrumbs from '@/components/breadcrumbs';
import ContactForm from 'components/contact';

export const metadata = {
  title: 'Contact Us',
  description:
    "Get in touch with Svelte Office. We're here to help with any questions about our premium office furniture. Contact us for support, inquiries, or feedback."
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs current="Contact us" />
      <section className="mx-auto h-full w-full animate-fadeIn p-3 md:max-w-3xl">
        <h1 className="font-serif text-3xl">Contact us</h1>
        <p className="mb-4 max-w-lg">
          Please fill out this short form and we will get back to you as soon as we can.
        </p>
        <ContactForm />
      </section>
    </>
  );
}
