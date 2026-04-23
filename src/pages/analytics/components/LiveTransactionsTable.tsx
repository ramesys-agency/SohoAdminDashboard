import StatusBadge from "../../../components/ui/StatusBadge";

const transactions = [
  {
    initials: "JS",
    name: "Jordan Smith",
    color: "bg-[#1325ec]/20 text-[#1325ec]",
    status: "Completed",
    date: "Oct 24, 14:20",
    amount: "৳1,240.00",
  },
  {
    initials: "MA",
    name: "Maria Alvarez",
    color: "bg-orange-100 text-orange-600",
    status: "Pending",
    date: "Oct 24, 13:10",
    amount: "৳845.50",
  },
  {
    initials: "KC",
    name: "Kevin Chen",
    color: "bg-blue-100 text-blue-600",
    status: "Completed",
    date: "Oct 24, 11:45",
    amount: "৳2,100.00",
  },
  {
    initials: "LW",
    name: "Liam Wilson",
    color: "bg-slate-100 text-slate-600",
    status: "Failed",
    date: "Oct 23, 18:22",
    amount: "৳50.00",
  },
];

export default function LiveTransactionsTable() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <h3 className="font-bold text-lg text-slate-900">Live Transactions</h3>
        <button className="size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200">
          <span className="material-symbols-outlined text-sm">filter_list</span>
        </button>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t.name}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div
                    className={`size-8 rounded-full ${t.color} flex items-center justify-center font-bold text-xs`}
                  >
                    {t.initials}
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {t.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                <td className="px-6 py-4 text-sm font-bold text-right text-slate-900">
                  {t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
