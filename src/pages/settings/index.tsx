import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { getUserById } from "../../api/user";
import type { AuthResponse } from "../auth/auth.interface";

type User = AuthResponse["data"]["user"];

function ProfileSettings({ user }: { user?: User }) {
  const [firstName, lastName] = (user?.fullName || user?.name || "").split(" ");
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">
          Personal Information
        </h3>
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
          <div className="size-20 rounded-full bg-[#1325ec]/10 flex items-center justify-center text-[#1325ec] text-3xl font-bold overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName || user.name || "User"}
                className="size-full object-cover"
              />
            ) : (
              (user?.fullName || user?.name || "A").charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900">
              {user?.fullName || user?.name || "Alex Rivera"}
            </p>
            <p className="text-sm text-slate-500 mb-3">
              {user?.email || "alex@storeadmin.com"}
            </p>
            <button className="px-3 py-1.5 text-xs font-bold bg-[#1325ec]/10 text-[#1325ec] rounded-lg hover:bg-[#1325ec]/20">
              Change Avatar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              First Name
            </label>
            <input
              type="text"
              key={firstName}
              defaultValue={firstName || ""}
              placeholder="First Name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              key={lastName}
              defaultValue={lastName || ""}
              placeholder="Last Name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              key={user?.email}
              defaultValue={user?.email || ""}
              placeholder="email@example.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Phone
            </label>
            <input
              type="text"
              key={user?.phone}
              defaultValue={user?.phone || ""}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Time Zone
            </label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none">
              <option>UTC−05:00 (Eastern Time)</option>
              <option>UTC+05:30 (India Standard Time)</option>
              <option>UTC+00:00 (GMT)</option>
            </select>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">
          Change Password
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Settings() {
  const authUser = useAuthStore((state) => state.user);

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile", authUser?.id],
    queryFn: () => getUserById(authUser?.id as string),
    enabled: !!authUser?.id,
  });

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Settings
        </h2>
        <p className="text-slate-500 text-sm">
          Manage your personal information and account preferences.
        </p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="size-8 border-4 border-[#1325ec]/20 border-t-[#1325ec] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <ProfileSettings user={userProfile} />
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button className="px-5 py-2.5 text-sm font-bold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700">
                Cancel
              </button>
              <button className="px-5 py-2.5 text-sm font-bold bg-[#1325ec] text-white rounded-lg shadow-lg shadow-[#1325ec]/20 hover:opacity-90 transition-all">
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
