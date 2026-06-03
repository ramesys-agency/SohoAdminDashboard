import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import {
  sendNotification,
  type NotificationAudience,
  type NotificationType,
} from "../../api/notifications";
import { getAllUsers, type AdminUser } from "../../api/users";
import { getCollections, type Collection } from "../../api/collections";
import { getProducts, type ApiProduct } from "../../api/products";

type RedirectType = "none" | "collection" | "product";
type RedirectTarget = { id: string; name: string; slug: string } | null;

const REGIONS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const TYPES: { value: NotificationType; label: string; icon: string }[] = [
  { value: "general", label: "General", icon: "notifications" },
  { value: "order", label: "Order", icon: "local_shipping" },
  { value: "sale", label: "Sale / Promo", icon: "sell" },
  { value: "update", label: "Update", icon: "campaign" },
];

const AUDIENCES: {
  value: NotificationAudience;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "all",
    label: "All customers",
    description: "Every active customer of the app",
    icon: "groups",
  },
  {
    value: "region",
    label: "By region",
    description: "Customers in the selected region(s)",
    icon: "map",
  },
  {
    value: "users",
    label: "Specific users",
    description: "Hand-pick individual users",
    icon: "person_search",
  },
];

export default function Notifications() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<NotificationType>("general");
  const [audience, setAudience] = useState<NotificationAudience>("all");
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<AdminUser[]>([]);
  const [includeAdmins, setIncludeAdmins] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [redirectType, setRedirectType] = useState<RedirectType>("none");
  const [redirectTarget, setRedirectTarget] = useState<RedirectTarget>(null);
  const [redirectSearch, setRedirectSearch] = useState("");
  const [pushEnabled, setPushEnabled] = useState(true);

  // User search results for the "specific users" audience
  const { data: userResults, isFetching: usersLoading } = useQuery({
    queryKey: ["notif-user-search", userSearch],
    queryFn: () =>
      getAllUsers({
        limit: 10,
        role: "all",
        ...(userSearch ? { search: userSearch } : {}),
      }),
    enabled: audience === "users",
  });

  const searchedUsers = userResults?.data ?? [];

  const { data: collectionResults, isFetching: collectionsLoading } = useQuery({
    queryKey: ["notif-collection-search", redirectSearch],
    queryFn: () => getCollections(1, 10, redirectSearch || undefined),
    enabled: redirectType === "collection",
  });

  const { data: productResults, isFetching: productsLoading } = useQuery({
    queryKey: ["notif-product-search", redirectSearch],
    queryFn: () =>
      getProducts({ limit: 10, search: redirectSearch || undefined }),
    enabled: redirectType === "product",
  });

  const redirectItems: RedirectTarget[] =
    redirectType === "collection"
      ? (collectionResults?.data ?? []).map((c: Collection) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        }))
      : redirectType === "product"
        ? (productResults?.data ?? []).map((p: ApiProduct) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
          }))
        : [];

  const redirectLoading =
    redirectType === "collection" ? collectionsLoading : productsLoading;

  const selectedUserIds = useMemo(
    () => new Set(selectedUsers.map((u) => u.id)),
    [selectedUsers],
  );

  const toggleRegion = (region: string) => {
    setRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
  };

  const toggleUser = (user: AdminUser) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user],
    );
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setType("general");
    setAudience("all");
    setRegions([]);
    setSelectedUsers([]);
    setIncludeAdmins(false);
    setUserSearch("");
    setRedirectType("none");
    setRedirectTarget(null);
    setRedirectSearch("");
    setPushEnabled(true);
  };

  const validate = (): string | null => {
    if (!title.trim()) return "Please enter a title.";
    if (!body.trim()) return "Please enter a message body.";
    if (audience === "region" && regions.length === 0)
      return "Please select at least one region.";
    if (audience === "users" && selectedUsers.length === 0)
      return "Please select at least one user.";
    return null;
  };

  const audienceLabel =
    audience === "all"
      ? "all customers"
      : audience === "region"
        ? regions.length
          ? `customers in ${regions.join(", ")}`
          : "selected regions"
        : `${selectedUsers.length} selected user(s)`;

  const handleSend = () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    setShowConfirm(false);
    try {
      setSending(true);
      const redirectData =
        redirectType !== "none" && redirectTarget
          ? {
              screen: redirectType,
              id: redirectTarget.id,
              slug: redirectTarget.slug,
              name: redirectTarget.name,
            }
          : null;
      const result = await sendNotification({
        title: title.trim(),
        body: body.trim(),
        type,
        audience,
        includeAdmins,
        pushEnabled,
        ...(audience === "region" ? { regions } : {}),
        ...(audience === "users"
          ? { userIds: selectedUsers.map((u) => u.id) }
          : {}),
        ...(redirectData ? { data: redirectData } : {}),
      });
      toast.success(
        `Notification delivered to ${result.sent} user(s).` +
          (result.sent === 0 ? " No recipients matched your filters." : ""),
      );
      resetForm();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send notification.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Push Notifications"
        description="Compose and broadcast an in-app notification to your customers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---- Composer ---- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Message
            </h3>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      type === t.value
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {t.icon}
                    </span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="e.g. EID Fashion Sale Is Here!"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Message *
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Write the notification message…"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
              <p className="text-xs text-slate-400 text-right">
                {body.length}/500
              </p>
            </div>
          </div>

          {/* ---- Delivery channel ---- */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Delivery Channel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPushEnabled(true)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  pushEnabled
                    ? "bg-primary/5 border-primary ring-1 ring-primary"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl ${
                    pushEnabled ? "text-primary" : "text-slate-400"
                  }`}
                >
                  phone_android
                </span>
                <p className="font-bold text-sm text-slate-900 mt-2">
                  Mobile + In-app
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sends a push notification to the device and saves it in-app
                </p>
              </button>
              <button
                type="button"
                onClick={() => setPushEnabled(false)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  !pushEnabled
                    ? "bg-primary/5 border-primary ring-1 ring-primary"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl ${
                    !pushEnabled ? "text-primary" : "text-slate-400"
                  }`}
                >
                  notifications
                </span>
                <p className="font-bold text-sm text-slate-900 mt-2">
                  In-app only
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Saved in the notification centre — no device push sent
                </p>
              </button>
            </div>
          </div>

          {/* ---- Redirect ---- */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Redirect on tap
            </h3>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: "none", label: "No redirect", icon: "block" },
                  {
                    value: "collection",
                    label: "Collection",
                    icon: "collections_bookmark",
                  },
                  { value: "product", label: "Product", icon: "inventory_2" },
                ] as { value: RedirectType; label: string; icon: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setRedirectType(opt.value);
                    setRedirectTarget(null);
                    setRedirectSearch("");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                    redirectType === opt.value
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {opt.icon}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>

            {redirectType !== "none" && (
              <div className="space-y-3">
                {redirectTarget ? (
                  <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {redirectType === "collection"
                          ? "collections_bookmark"
                          : "inventory_2"}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {redirectTarget.name}
                      </span>
                      <span className="text-xs text-slate-400 truncate hidden sm:block">
                        /{redirectTarget.slug}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRedirectTarget(null);
                        setRedirectSearch("");
                      }}
                      className="ml-3 text-slate-400 hover:text-slate-600 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                        search
                      </span>
                      <input
                        type="text"
                        value={redirectSearch}
                        onChange={(e) => setRedirectSearch(e.target.value)}
                        placeholder={`Search ${redirectType}s…`}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-52 overflow-y-auto">
                      {redirectLoading && (
                        <p className="p-4 text-sm text-slate-400">Searching…</p>
                      )}
                      {!redirectLoading && redirectItems.length === 0 && (
                        <p className="p-4 text-sm text-slate-400">
                          No {redirectType}s found.
                        </p>
                      )}
                      {!redirectLoading &&
                        redirectItems.map((item) => (
                          <button
                            key={item!.id}
                            type="button"
                            onClick={() => setRedirectTarget(item)}
                            className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors"
                          >
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">
                              {redirectType === "collection"
                                ? "collections_bookmark"
                                : "inventory_2"}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {item!.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                /{item!.slug}
                              </p>
                            </div>
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ---- Audience ---- */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Audience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {AUDIENCES.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAudience(a.value)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    audience === a.value
                      ? "bg-primary/5 border-primary ring-1 ring-primary"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-2xl ${
                      audience === a.value ? "text-primary" : "text-slate-400"
                    }`}
                  >
                    {a.icon}
                  </span>
                  <p className="font-bold text-sm text-slate-900 mt-2">
                    {a.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {a.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Region picker */}
            {audience === "region" && (
              <div className="space-y-2 pt-2">
                <label className="text-sm font-semibold text-slate-700">
                  Select regions
                </label>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => {
                    const active = regions.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => toggleRegion(r)}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                          active
                            ? "bg-primary text-white border-primary"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {active && (
                          <span className="material-symbols-outlined text-[14px] align-middle mr-1">
                            check
                          </span>
                        )}
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* User picker */}
            {audience === "users" && (
              <div className="space-y-3 pt-2">
                <label className="text-sm font-semibold text-slate-700">
                  Find users
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email…"
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                {/* Selected chips */}
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((u) => (
                      <span
                        key={u.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                      >
                        {u.fullName}
                        <button
                          type="button"
                          onClick={() => toggleUser(u)}
                          className="hover:text-primary/70"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            close
                          </span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Results */}
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {usersLoading && (
                    <p className="p-4 text-sm text-slate-400">Searching…</p>
                  )}
                  {!usersLoading && searchedUsers.length === 0 && (
                    <p className="p-4 text-sm text-slate-400">
                      No users found.
                    </p>
                  )}
                  {!usersLoading &&
                    searchedUsers.map((u) => {
                      const checked = selectedUserIds.has(u.id);
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => toggleUser(u)}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors"
                        >
                          <span
                            className={`size-5 rounded border flex items-center justify-center shrink-0 ${
                              checked
                                ? "bg-primary border-primary"
                                : "border-slate-300"
                            }`}
                          >
                            {checked && (
                              <span className="material-symbols-outlined text-white text-[14px]">
                                check
                              </span>
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {u.fullName}
                              {u.role === "admin" && (
                                <span className="ml-2 text-[10px] font-bold uppercase text-purple-600">
                                  admin
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {u.email}
                              {u.region ? ` · ${u.region}` : ""}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Include admins toggle (only meaningful for all/region) */}
            {audience !== "users" && (
              <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeAdmins}
                  onChange={(e) => setIncludeAdmins(e.target.checked)}
                  className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-600">
                  Also include admin accounts
                </span>
              </label>
            )}
          </div>
        </div>

        {/* ---- Preview / Send ---- */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 lg:sticky lg:top-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Preview
            </h3>

            {/* Notification preview card */}
            <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3 border border-slate-100">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  {TYPES.find((t) => t.value === type)?.icon ?? "notifications"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 wrap-break-word">
                  {title || "Notification title"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 wrap-break-word">
                  {body || "Your message will appear here."}
                </p>
              </div>
            </div>

            {/* Audience summary */}
            <div className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Category</span>
                <span className="font-semibold text-slate-700 capitalize">
                  {type}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Audience</span>
                <span className="font-semibold text-slate-700">
                  {audience === "all"
                    ? "All customers"
                    : audience === "region"
                      ? regions.length
                        ? regions.join(", ")
                        : "No region selected"
                      : `${selectedUsers.length} user(s)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Redirects to</span>
                <span className="font-semibold text-slate-700 capitalize truncate max-w-[60%] text-right">
                  {redirectType === "none"
                    ? "None"
                    : redirectTarget
                      ? redirectTarget.name
                      : `No ${redirectType} selected`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Channel</span>
                <span className="font-semibold text-slate-700">
                  {pushEnabled ? "Mobile + In-app" : "In-app only"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                send
              </span>
              {sending ? "Sending…" : "Send Notification"}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Confirm dialog ---- */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon + heading */}
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  send
                </span>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Send notification?
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  This will be sent to{" "}
                  <span className="font-semibold text-slate-700">
                    {audienceLabel}
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between gap-2">
                <span>Title</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[60%]">
                  {title}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Category</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {type}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span>Audience</span>
                <span className="font-semibold text-slate-800 text-right">
                  {audienceLabel}
                </span>
              </div>
              {redirectType !== "none" && (
                <div className="flex justify-between gap-2">
                  <span>Redirects to</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[60%]">
                    {redirectTarget ? redirectTarget.name : `No ${redirectType} selected`}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <span>Channel</span>
                <span className="font-semibold text-slate-800">
                  {pushEnabled ? "Mobile + In-app" : "In-app only"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSend}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
