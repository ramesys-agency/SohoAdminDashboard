import MetricCard from "../../../components/ui/MetricCard";

interface MetricCardsProps {
  totalSales?: number;
  totalOrders?: number;
  totalCustomers?: number;
}

export default function MetricCards({
  totalSales = 0,
  totalOrders = 0,
  totalCustomers = 0,
}: MetricCardsProps) {
  const metrics = [
    {
      title: "Total Revenue",
      value: `৳${totalSales.toLocaleString()}`,
      icon: "payments",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: "up" as const,
      trendValue: "12.5%",
      sparklinePath: "M0 25 Q10 15, 20 20 T40 10 T60 15 T80 5 T100 12",
      sparklineColor: "#1325ec",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: "shopping_bag",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: "down" as const,
      trendValue: "2.4%",
      sparklinePath: "M0 5 Q10 20, 20 15 T40 25 T60 10 T80 18 T100 22",
      sparklineColor: "#f97316",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      icon: "person",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      trend: "up" as const,
      trendValue: "18.2%",
      sparklinePath: "M0 28 Q20 28, 40 15 T80 10 T100 2",
      sparklineColor: "#10b981",
    },
    {
      title: "Total Products",
      value: "42",
      icon: "inventory_2",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "up" as const,
      trendValue: "5.0%",
      sparklinePath: "M0 15 Q30 15, 50 12 T100 8",
      sparklineColor: "#a855f7",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((m) => (
        <MetricCard key={m.title} {...m} />
      ))}
    </div>
  );
}
