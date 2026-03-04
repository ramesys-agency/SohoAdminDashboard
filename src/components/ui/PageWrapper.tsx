import { type ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

/**
 * Provides a consistent outer padding and spacing
 * for all dashboard pages.
 */
export default function PageWrapper({ children }: PageWrapperProps) {
  return <div className="p-8 space-y-8">{children}</div>;
}
