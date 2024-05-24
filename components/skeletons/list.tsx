export default function List() {
  return (
    <div
      role="status"
      className="w-full animate-pulse space-y-4 divide-y divide-gray-200 border border-gray-200 py-4"
    >
      {[...Array(5)].map((_) => (
        <div className="flex items-center justify-between px-4 [&:not(:first-child)]:pt-4">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
            <div className="h-2 w-32 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300"></div>
        </div>
      ))}

      <span className="sr-only">Loading...</span>
    </div>
  );
}
