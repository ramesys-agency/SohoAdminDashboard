import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import {
  getAggregators,
  getPickupAddresses,
  addPickupAddress,
  type PickupAddress,
} from "../../api/shipping";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";

export default function ShippingPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_address: "",
    division: "",
    district: "",
    thana: "",
    sender_phone: "",
  });

  const { data: aggregators, isLoading: loadingAggregators } = useQuery({
    queryKey: ["aggregators"],
    queryFn: getAggregators,
  });

  const {
    data: pickupAddresses,
    isLoading: loadingPickups,
    isError: pickupsError,
    error: pickupErrorObj,
  } = useQuery({
    queryKey: ["pickupAddresses"],
    queryFn: getPickupAddresses,
  });

  const addMutation = useMutation({
    mutationFn: addPickupAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickupAddresses"] });
      setShowAddForm(false);
      setFormData({
        sender_name: "",
        sender_address: "",
        division: "",
        district: "",
        thana: "",
        sender_phone: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Shipping & Logistics"
        description="Manage your pickup locations and delivery partners."
        actions={
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            leftIcon={<span className="material-symbols-outlined">add</span>}
          >
            {showAddForm ? "Cancel" : "Add Pickup Address"}
          </Button>
        }
      />

      <div className="space-y-8 mt-8">
        {/* Pickup Addresses Section */}
        {showAddForm && (
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-base font-bold text-slate-900 mb-6">
              New Pickup Address
            </h3>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Sender Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.sender_name}
                  onChange={(e) =>
                    setFormData({ ...formData, sender_name: e.target.value })
                  }
                  placeholder="e.g. Main Warehouse"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.sender_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, sender_phone: e.target.value })
                  }
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Full Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.sender_address}
                  onChange={(e) =>
                    setFormData({ ...formData, sender_address: e.target.value })
                  }
                  placeholder="House #, Road #, Area"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Division
                </label>
                <input
                  type="text"
                  required
                  value={formData.division}
                  onChange={(e) =>
                    setFormData({ ...formData, division: e.target.value })
                  }
                  placeholder="e.g. Dhaka"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  District
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  placeholder="e.g. Dhaka"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Thana
                </label>
                <input
                  type="text"
                  required
                  value={formData.thana}
                  onChange={(e) =>
                    setFormData({ ...formData, thana: e.target.value })
                  }
                  placeholder="e.g. Gulshan"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "Adding..." : "Save Address"}
                </Button>
              </div>
            </form>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Senders Addresses List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Pickup Locations
            </h3>
            {loadingPickups ? (
              <div className="h-32 flex items-center justify-center bg-white rounded-xl border border-dashed border-slate-300">
                <div className="size-6 border-2 border-[#1325ec]/20 border-t-[#1325ec] rounded-full animate-spin"></div>
              </div>
            ) : pickupsError ? (
              <div className="p-8 text-center bg-red-50 rounded-xl border border-dashed border-red-200">
                <p className="text-red-500 text-sm font-semibold">
                  Failed to load pickup locations.
                </p>
                <p className="text-red-400 text-xs mt-1">
                  {pickupErrorObj?.message || "Internal Server Error"}
                </p>
              </div>
            ) : !pickupAddresses || pickupAddresses.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <span className="material-symbols-outlined text-3xl">
                    location_off
                  </span>
                </div>
                <h4 className="text-slate-900 font-bold mb-1">
                  No Pickup Locations
                </h4>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  You haven't added any sender addresses yet. Add one to enable
                  logistics for your orders.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pickupAddresses?.map((addr: PickupAddress) => (
                  <div
                    key={addr.id}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <span className="material-symbols-outlined">
                          location_on
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {addr.name}
                        </h4>
                        <p className="text-sm text-slate-500">{addr.address}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {addr.thana}, {addr.district}, {addr.division}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-semibold text-slate-700">
                          {addr.sender_phone_number}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                          Pickup Phone
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Partners Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Delivery Partners
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              {loadingAggregators ? (
                <div className="p-12 flex justify-center">
                  <div className="size-6 border-2 border-[#1325ec]/20 border-t-[#1325ec] rounded-full animate-spin"></div>
                </div>
              ) : aggregators?.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">
                    No delivery partners available. Check your RoadRush
                    connection.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {aggregators?.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-[#1325ec] uppercase">
                          {partner.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 capitalize">
                            {partner.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Logistics Partner
                          </p>
                        </div>
                      </div>
                      <StatusBadge
                        status={partner.status ? "Active" : "Inactive"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-blue-600 text-sm">
                  info
                </span>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Aggregators are managed via the RoadRush platform. Enable or
                  disable partners in your RoadRush settings to update this
                  list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
