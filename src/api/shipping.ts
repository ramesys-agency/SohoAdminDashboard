import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export interface Aggregator {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  status: boolean;
}

export interface PickupAddress {
  id: string | number;
  name: string;
  address: string;
  division: string;
  district: string;
  thana: string;
  sender_phone_number: string;
}

export const getAggregators = async (): Promise<Aggregator[]> => {
  const { data } = await api.get(apiEndpoint.logistics.aggregators);
  // Backend returns raw RoadRush response: { status, count, aggregators: [] }
  return data.aggregators || [];
};

export const getPickupAddresses = async (): Promise<PickupAddress[]> => {
  const { data } = await api.get(apiEndpoint.logistics.pickupAddresses);
  // Backend now returns raw RoadRush response: { status, count, sender_addresses: [] }
  return data.sender_addresses || [];
};

export const addPickupAddress = async (formData: any): Promise<any> => {
  // Backend expects 'name', 'phone', 'address' instead of 'sender_*'
  const payload = {
    name: formData.sender_name,
    phone: formData.sender_phone,
    address: formData.sender_address,
    division: formData.division,
    district: formData.district,
    thana: formData.thana,
  };
  const { data } = await api.post(apiEndpoint.logistics.pickupAddresses, payload);
  return data;
};
