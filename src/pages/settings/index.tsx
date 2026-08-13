import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} from "../../api/user";
import type { AuthResponse } from "../auth/auth.interface";
import { toast } from "sonner";
import PasswordModal from "./components/PasswordModal";
import { AVATAR_IMAGE_SPEC, imageHint } from "../../lib/imageGuidelines";

type User = AuthResponse["data"]["user"];

function ProfileSettings({
  user,
  onDataChange,
  onPasswordClick,
}: {
  user?: User;
  onDataChange: (data: any) => void;
  onPasswordClick: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const [f, ...l] = (user.fullName || "").split(" ");
      setFirstName(f || "");
      setLastName(l.join(" ") || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Cancel remounts this component, so the pending preview URL would otherwise
  // be abandoned without ever being revoked.
  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    },
    [avatarPreview],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      onDataChange({ avatarFile: file });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "firstName") setFirstName(value);
    if (field === "lastName") setLastName(value);
    if (field === "phone") setPhone(value);

    onDataChange({
      fullName:
        field === "firstName"
          ? `${value} ${lastName}`
          : field === "lastName"
            ? `${firstName} ${value}`
            : `${firstName} ${lastName}`,
      phone: field === "phone" ? value : phone,
    });
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">
          Personal Information
        </h3>
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold overflow-hidden border border-slate-100">
            {avatarPreview || user?.avatar ? (
              <img
                src={avatarPreview || user?.avatar}
                alt={user?.fullName || "User"}
                className="size-full object-cover"
              />
            ) : (
              (user?.fullName || "A").charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900">
              {user?.fullName || "Admin User"}
            </p>
            <p className="text-sm text-slate-500 mb-3">
              {user?.email || "admin@soho.com"}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              Change Avatar
            </button>
            <p className="text-[10px] text-slate-400 mt-1.5">
              {imageHint(AVATAR_IMAGE_SPEC)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="First Name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Last Name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-slate-50 text-slate-500 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Time Zone
            </label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary outline-none bg-white">
              <option>UTC+06:00 (Bangladesh Standard Time)</option>
              <option>UTC+05:30 (India Standard Time)</option>
              <option>UTC+00:00 (GMT)</option>
            </select>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Security & Password
            </h3>
            <p className="text-sm text-slate-500">
              Update your account password to keep your account secure.
            </p>
          </div>
          <button
            onClick={() => onPasswordClick()}
            className="px-4 py-2 text-sm font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Change Password
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Settings() {
  const authUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile", authUser?.id],
    queryFn: () => getUserById(authUser?.id as string),
    enabled: !!authUser?.id,
  });

  // Cancel discards the edit and leaves the page. Settings is reachable from
  // anywhere in the sidebar, so fall back to the dashboard when this was the
  // entry point and there is nothing to go back to.
  const handleCancel = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate("/", { replace: true });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // 1. Handle Avatar Upload if changed
      if (formData.avatarFile) {
        await updateUserAvatar(formData.avatarFile);
      }

      // 2. Handle Profile Update
      const profilePayload = {
        fullName: formData.fullName,
        phone: formData.phone,
      };

      if (profilePayload.fullName || profilePayload.phone) {
        await updateUserProfile(profilePayload);
      }

      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-20">
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
            <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <ProfileSettings
              user={userProfile}
              onDataChange={(data) =>
                setFormData((prev: any) => ({ ...prev, ...data }))
              }
              onPasswordClick={() => setIsPasswordModalOpen(true)}
            />
            {/* Sticky so both actions stay reachable without scrolling to the
                very bottom of the page. The container's pb-20 is its runway. */}
            <div className="sticky bottom-0 z-10 flex justify-end gap-3 py-4 bg-white border-t border-slate-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-bold bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
