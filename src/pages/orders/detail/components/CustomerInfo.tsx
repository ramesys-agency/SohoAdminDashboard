import type { Order } from "../../../../api/orders";

interface CustomerInfoProps {
  order: Order;
}

export default function CustomerInfo({ order }: CustomerInfoProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-6">
        Customer & Shipping Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Customer Details
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500">Full Name</p>
              <p className="text-sm font-bold text-slate-900">
                {order.customerFullName || order.user?.fullName || "Guest"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email Address</p>
              <p className="text-sm font-bold text-slate-900">
                {order.customerEmail || order.user?.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Phone (Logistics)</p>
              <p className="text-sm font-bold text-slate-900">
                {order.customerMobileNumber || order.user?.phone || "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Shipping Address
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500">Street / Area</p>
              <p className="text-sm font-medium text-slate-900">
                {order.dropAddress || order.address?.street}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Location</p>
              <p className="text-sm font-medium text-slate-900">
                {order.receiverThana || order.address?.thana}, {order.receiverDistrict || order.address?.district}
              </p>
              <p className="text-sm font-medium text-slate-900">
                {order.receiverDivision || order.address?.division}
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                <span className="material-symbols-outlined text-sm">
                  local_shipping
                </span>
                {order.cod ? "Cash on Delivery" : "Prepaid Order"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
