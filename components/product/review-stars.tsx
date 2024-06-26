import { getReviews } from 'lib/yotpo';
import { Star } from 'react-feather';

export async function ReviewStars({ productId }: { productId: string }) {
  const id = productId.split('/').at(-1);
  if (!id) return;

  const {
    response: {
      bottomline: { average_score, total_review }
    }
  } = await getReviews(id);

  const stars = Math.ceil(average_score);

  if (average_score <= 3) return null;

  return (
    <div className="flex gap-2">
      <span className="text-sm text-secondary">({total_review})</span>
      <div className="flex gap-1">
        {[...Array(stars)].map((_, i) => (
          <Star className="fill-accent-yellow text-accent-yellow" key={`star-${i}`} />
        ))}
      </div>
    </div>
  );
}
