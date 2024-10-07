import Image from 'components/skeletons/image';
import List from 'components/skeletons/list';
import TextLarge from 'components/skeletons/text-large';

export default function Loading() {
  return (
    <section className="animate-fadeIn md:grid md:grid-cols-2">
      <div className="flex flex-col p-4 md:border-r">
        <Image />
      </div>
      <div className="relative space-y-4 p-4">
        <TextLarge />
        <List />
      </div>
    </section>
  );
}
