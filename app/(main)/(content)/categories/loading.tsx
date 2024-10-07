import { ArrowRight } from 'react-feather';

export default function Loading() {
  return (
    <section>
      <h1 className="p-3 font-serif text-2xl md:text-3xl">Categories</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex h-full animate-pulse flex-col shadow-border">
            <div className="aspect-square w-full bg-gray-200" />
            <div className="flex h-full flex-col border-t bg-white p-3">
              <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
              <div className="mt-auto flex justify-between">
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <ArrowRight className="text-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
