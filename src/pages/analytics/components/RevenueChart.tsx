export default function RevenueChart() {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900">Revenue Over Time</h3>
        <button className="material-symbols-outlined text-slate-400">
          more_horiz
        </button>
      </div>
      <div className="flex-1 min-h-[300px] relative">
        <div className="absolute inset-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 400 150"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="analyticsGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#1325ec" />
                <stop offset="100%" stopColor="#1325ec" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,120 C50,110 80,60 120,70 C160,80 200,20 250,40 C300,60 350,10 400,30"
              fill="none"
              stroke="#1325ec"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <path
              d="M0,120 C50,110 80,60 120,70 C160,80 200,20 250,40 C300,60 350,10 400,30 V150 H0 Z"
              fill="url(#analyticsGradient)"
              opacity="0.1"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400 font-medium px-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
