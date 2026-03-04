const reviews = [
  {
    name: "Sarah J.",
    rating: 5,
    comment: "Great quality! Fits perfectly and very comfortable.",
    date: "Oct 20, 2023",
  },
  {
    name: "Mark S.",
    rating: 4,
    comment: "Nice shirt, the fabric is soft. Sizing runs slightly large.",
    date: "Oct 18, 2023",
  },
  {
    name: "Emma W.",
    rating: 5,
    comment: "Bought 3 of these in different colors. Excellent value.",
    date: "Oct 15, 2023",
  },
];

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

export default function ReviewsSection() {
  const avg = (
    reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  ).toFixed(1);
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900">Customer Reviews</h3>
        <div className="flex items-center gap-2">
          <Stars count={5} />
          <span className="text-sm font-bold text-slate-900">{avg}</span>
          <span className="text-xs text-slate-500">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>
      <div className="space-y-5">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="pb-5 border-b border-slate-100 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[#1325ec]/10 text-[#1325ec] flex items-center justify-center font-bold text-sm">
                  {r.name[0]}
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
