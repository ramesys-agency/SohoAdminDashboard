import type { Order } from "../../../../api/orders";
import dayjs from "dayjs";

interface OrderTimelineProps {
  order: Order;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
  const logs = [...(order.statusLogs || [])].sort(
    (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix(),
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-fit">
      <h3 className="font-bold text-slate-900 mb-6">Status History</h3>
      <div className="space-y-6">
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500 italic text-center py-4">
            No status updates yet.
          </p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`size-2.5 rounded-full mt-1.5 ${index === 0 ? "bg-primary" : "bg-slate-300"}`}
                />
                {index !== logs.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 mt-2" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 uppercase">
                  {log.status.replace(/_/g, " ")}
                </p>
                {log.note && (
                  <p className="text-xs text-slate-500 mt-1">{log.note}</p>
                )}
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                  {dayjs(log.createdAt).format("MMM DD, YYYY - HH:mm")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
