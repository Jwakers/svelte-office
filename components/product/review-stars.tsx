import clsx from 'clsx';
import { getReviews } from 'lib/yotpo';
import { Star } from 'react-feather';

export async function ReviewStars({ productId }: { productId: string }) {
  const id = productId.split('/').at(-1);
  if (!id) return;

  const {
    response: {
      bottomline: { average_score }
    }
  } = await getReviews(id);

  const stars = Math.ceil(average_score);

  if (average_score <= 3) return null;

  return (
    <div className="flex gap-2">
      <span>{average_score}</span>
      <div className="flex gap-1">
        {[...Array(stars)].map((_, i) => (
          <Star
            className={clsx('fill-yellow-400 text-yellow-400', i && 'hidden sm:block')}
            key={`star-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
