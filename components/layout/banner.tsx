import { Truck } from 'react-feather';

export default function Banner() {
  return (
    <div className="flex items-center justify-center gap-1 bg-black p-2 text-xs uppercase text-white">
      <Truck height={14} />
      <span>Free delivery on all products</span>
    </div>
  );
}
