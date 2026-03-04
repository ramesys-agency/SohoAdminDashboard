import { useState } from "react";

const days = [24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8];

export default function CalendarWidget() {
  const [month] = useState("October 2023");

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-bold text-lg mb-4 text-slate-900">Quick Calendar</h3>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between p-1 mb-2">
          <button className="p-1 hover:bg-slate-100 rounded">
            <span className="material-symbols-outlined text-lg">
              chevron_left
            </span>
          </button>
          <p className="text-sm font-bold text-slate-900">{month}</p>
          <button className="p-1 hover:bg-slate-100 rounded">
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </button>
        </div>
        <div className="grid grid-cols-7 text-center mb-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <p key={i} className="text-[10px] font-bold text-slate-400">
              {d}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center gap-1">
          {days.map((day, i) => (
            <div
              key={i}
              className={`h-8 flex items-center justify-center text-xs font-bold rounded-full cursor-pointer transition-colors ${
                day === 3
                  ? "bg-[#1325ec]/10 text-[#1325ec]"
                  : i < 7
                    ? "text-slate-400"
                    : "text-slate-900 hover:bg-slate-100"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
