import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Document,
  CreateDocumentDTO,
  UpdateDocumentDTO,
  DocumentFilters,
  ApiResponse,
} from "@test/shared";
import { apiClient } from "../api/client";

export interface UseDocumentsResult {
  documents: Document[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function getErrorMessage(err: unknown, fallback: string): string {
  return (err as { message?: string }).message ?? fallback;
}

function buildQuery(filters?: DocumentFilters): string {
  const params = new URLSearchParams();

  if (filters?.status) params.set("status", filters.status);
  if (filters?.page !== undefined) params.set("page", String(filters.page));
  if (filters?.pageSize !== undefined)
    params.set("pageSize", String(filters.pageSize));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function useDocuments(filters?: DocumentFilters): UseDocumentsResult {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(
    () => buildQuery(filters),
    [filters?.status, filters?.page, filters?.pageSize],
  );

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse<Document[]>>(
        `/api/documents${query}`,
      );
      setDocuments(response.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load documents"));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  return { documents, loading, error, refetch: () => void fetchDocuments() };
}

export interface UseDocumentResult {
  document: Document | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  update: (dto: UpdateDocumentDTO) => Promise<void>;
}

export function useDocument(id: string): UseDocumentResult {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse<Document>>(
        `/api/documents/${id}`,
      );
      setDocument(response.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load document"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchDocument();
  }, [fetchDocument]);

  async function update(dto: UpdateDocumentDTO): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.patch<ApiResponse<Document>>(
        `/api/documents/${id}`,
        dto,
      );
      setDocument(response.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update document"));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    document,
    loading,
    error,
    refetch: () => void fetchDocument(),
    update,
  };
}

export interface UseCreateDocumentResult {
  create: (dto: CreateDocumentDTO) => Promise<Document>;
  loading: boolean;
  error: string | null;
}

export function useCreateDocument(): UseCreateDocumentResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(dto: CreateDocumentDTO): Promise<Document> {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<Document>>(
        "/api/documents",
        dto,
      );
      return response.data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to create document"));
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error };
}
