import ContactForm from 'components/contact';

export default function ContactPage() {
  return (
    <section className="mx-auto h-full w-full border-black p-3 md:max-w-3xl md:border-l md:border-r">
      <h1 className="font-serif text-3xl">Contact us</h1>
      <p className="mb-4 max-w-lg">
        Please fill out this short form and we will get back to you as soon as we can.
      </p>
      <ContactForm />
    </section>
  );
}
