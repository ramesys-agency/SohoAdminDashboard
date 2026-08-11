/**
 * Placement images come back as storage keys or absolute URLs depending on the
 * upload backend, so resolve relative ones against the API host.
 */
export const getFullImageUrl = (url?: string | null): string => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  const backendBase = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
    : "http://localhost:5000";

  return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
};
