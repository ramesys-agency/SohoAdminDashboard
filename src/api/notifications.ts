import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export type NotificationType = "order" | "sale" | "update" | "general";
export type NotificationAudience = "all" | "region" | "users";

export interface SendNotificationInput {
  title: string;
  body: string;
  type?: NotificationType;
  audience?: NotificationAudience;
  regions?: string[];
  userIds?: string[];
  includeAdmins?: boolean;
  data?: Record<string, unknown> | null;
  pushEnabled?: boolean;
}

export interface SendNotificationResult {
  sent: number;
  recipients: number;
  /**
   * Device delivery is queued, not sent inline — the backend retries it and
   * confirms it against Expo receipts after this request has already returned.
   */
  push: {
    queued: boolean;
    devices: number;
    jobs: number;
    dispatchId: string | null;
  };
}

export const sendNotification = async (
  input: SendNotificationInput
): Promise<SendNotificationResult> => {
  const { data } = await api.post(apiEndpoint.notifications.adminSend, input);
  return data.data;
};
