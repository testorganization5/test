import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { request } from "~/lib/api";
import type { Cookbook, CookbookType } from "~/lib/types";
import type { CookbookFormValues } from "~/lib/schemas";

export interface CookbookFilters {
  search?: string;
  sort?: string;
  type?: CookbookType[];
  mine?: boolean;
  hideMine?: boolean;
  limit?: number;
}

function toQuery(filters: CookbookFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.mine) params.set("mine", "true");
  if (filters.hideMine) params.set("hideMine", "true");
  if (filters.limit) params.set("limit", String(filters.limit));
  filters.type?.forEach((t) => params.append("type", t));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const cookbookKeys = {
  all: ["cookbooks"] as const,
  list: (filters: CookbookFilters) => ["cookbooks", "list", filters] as const,
  detail: (id: string) => ["cookbooks", "detail", id] as const,
};

export function useCookbooks(filters: CookbookFilters = {}) {
  return useQuery({
    queryKey: cookbookKeys.list(filters),
    queryFn: () => request<Cookbook[]>(`/cookbooks${toQuery(filters)}`),
  });
}

export function useCookbook(id: string | undefined) {
  return useQuery({
    queryKey: cookbookKeys.detail(id ?? ""),
    queryFn: () => request<Cookbook>(`/cookbooks/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateCookbook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: CookbookFormValues) =>
      request<Cookbook>("/cookbooks", { method: "POST", body: values }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cookbookKeys.all }),
  });
}

export function useUpdateCookbook(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: CookbookFormValues) =>
      request<Cookbook>(`/cookbooks/${id}`, { method: "PATCH", body: values }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cookbookKeys.all }),
  });
}

export function useDeleteCookbook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      request<void>(`/cookbooks/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cookbookKeys.all }),
  });
}

export function useCloneCookbook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      request<Cookbook>(`/cookbooks/${id}/clone`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cookbookKeys.all }),
  });
}

export function useToggleCookbookLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) =>
      request<Cookbook>(`/cookbooks/${id}/like`, {
        method: liked ? "DELETE" : "PUT",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cookbookKeys.all }),
  });
}
