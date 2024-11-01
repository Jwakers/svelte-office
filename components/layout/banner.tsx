import { Truck } from 'lucide-react';

export default function Banner() {
  return (
    <div className="flex items-center gap-1 bg-brand p-2 text-xs uppercase text-white">
      <Truck height={14} />
      <span>Free delivery on orders over £250</span>
    </div>
  );
}
