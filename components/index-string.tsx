export default function IndexString({ value, text }: { value: number; text: string }) {
  if (value <= 0) return null;
  return (
    <p className="text-sm text-secondary">
      <span className="font-semibold">{value}</span> {text}
    </p>
  );
}
