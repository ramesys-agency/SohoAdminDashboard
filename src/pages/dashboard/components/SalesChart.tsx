import { useState } from "react";

export default function SalesChart() {
  const [period, setPeriod] = useState("Last 30 Days");

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Sales Overview</h3>
          <p className="text-sm text-slate-500">
            Daily revenue performance for current month
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium py-1.5 px-3 outline-none text-slate-700"
        >
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Year to Date</option>
        </select>
      </div>
      <div className="h-64 relative">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dashGradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgba(19,37,236,0.2)" }} />
              <stop offset="100%" style={{ stopColor: "rgba(19,37,236,0)" }} />
            </linearGradient>
          </defs>
          <path
            d="M0 150 Q100 120, 200 140 T400 60 T600 110 T800 30 T1000 80 V200 H0 Z"
            fill="url(#dashGradient)"
          />
          <path
            d="M0 150 Q100 120, 200 140 T400 60 T600 110 T800 30 T1000 80"
            fill="none"
            stroke="#1325ec"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {["$150k", "$100k", "$50k", "$0"].map((label) => (
            <div
              key={label}
              className="flex justify-between px-2 text-[10px] text-slate-400 border-t border-slate-100 pt-1"
            >
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-4 px-2 text-[11px] font-medium text-slate-400">
        {["Jan 01", "Jan 07", "Jan 14", "Jan 21", "Jan 28", "Jan 31"].map(
          (d) => (
            <span key={d}>{d}</span>
          ),
        )}
      </div>
    </div>
  );
}
