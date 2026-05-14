import { z } from "zod";

export const transitionRequestSchema = z.object({
  targetStatus: z.enum([
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "WITHDRAWN",
  ]),
  comment: z.string().optional(),
  reviewerId: z.string().uuid().optional(),
});
