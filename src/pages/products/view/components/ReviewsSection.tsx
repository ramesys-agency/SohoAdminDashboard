export interface ReviewData {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  reviews: ReviewData[];
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-sm ${i <= count ? "text-amber-400" : "text-slate-200"}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return (
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-6">Customer Reviews</h3>
        <p className="text-sm text-slate-500 italic">No reviews yet.</p>
      </section>
    );
  }

  const avg = (
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900">Customer Reviews</h3>
        <div className="flex items-center gap-2">
          <Stars count={Math.round(parseFloat(avg))} />
          <span className="text-sm font-bold text-slate-900">{avg}</span>
          <span className="text-xs text-slate-500">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>
      <div className="space-y-5">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="pb-5 border-b border-slate-100 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{r.name}</p>
                  <Stars count={r.rating} />
                </div>
              </div>
              <span className="text-xs text-slate-400">{r.date}</span>
            </div>
            <p className="text-sm text-slate-600 mt-2 pl-12">{r.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
