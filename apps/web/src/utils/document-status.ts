import type { DocumentStatus } from "@test/shared";

export const statusColors: Record<DocumentStatus, string> = {
  DRAFT: "#777",
  SUBMITTED: "#2563eb",
  UNDER_REVIEW: "#d97706",
  APPROVED: "#16a34a",
  REJECTED: "#dc2626",
  WITHDRAWN: "#777",
};
