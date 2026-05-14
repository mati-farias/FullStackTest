import { useState } from "react";
import type {
  ApiResponse,
  TransitionRequest,
  TransitionResult,
} from "@test/shared";
import { apiClient } from "../api/client";

export interface UseTransitionResult {
  transition: (req: TransitionRequest) => Promise<TransitionResult>;
  loading: boolean;
  error: string | null;
}

export function useTransition(documentId: string): UseTransitionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function transition(req: TransitionRequest): Promise<TransitionResult> {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<TransitionResult>>(
        `/api/documents/${documentId}/transitions`,
        req,
      );

      return response.data;
    } catch (err: unknown) {
      setError((err as { message?: string }).message ?? "Transition failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { transition, loading, error };
}
