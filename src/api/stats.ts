import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  recentOrders: {
    id: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }[];
  salesTrend: {
    month: string;
    amount: number;
  }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get<{ success: boolean; data: DashboardStats }>(apiEndpoint.stats.dashboard);
  return data.data;
};
